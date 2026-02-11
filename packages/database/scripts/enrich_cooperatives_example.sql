-- Example Script: How to Enrich Cooperatives Dataset
-- This script demonstrates practical examples of enriching cooperative data

-- =============================================
-- EXAMPLE 1: Enrich from JSON Metadata
-- =============================================
-- If you have JSON data with additional fields, extract and populate them

UPDATE agrosoluce.cooperatives
SET 
    member_count = CASE 
        WHEN metadata->>'member_count' IS NOT NULL 
        THEN (metadata->>'member_count')::INTEGER 
        ELSE NULL 
    END,
    established_year = CASE 
        WHEN metadata->>'established_year' IS NOT NULL 
        THEN (metadata->>'established_year')::INTEGER 
        ELSE NULL 
    END,
    financial_health_score = CASE 
        WHEN metadata->>'financial_health_score' IS NOT NULL 
        THEN (metadata->>'financial_health_score')::NUMERIC 
        ELSE NULL 
    END,
    sustainability_score = CASE 
        WHEN metadata->>'sustainability_score' IS NOT NULL 
        THEN (metadata->>'sustainability_score')::NUMERIC 
        ELSE NULL 
    END,
    website_url = metadata->>'website_url',
    contact_email = COALESCE(contact_email, metadata->>'contact_email'),
    contact_phone = COALESCE(contact_phone, metadata->>'contact_phone')
WHERE metadata IS NOT NULL 
  AND metadata != '{}'::jsonb;

-- =============================================
-- EXAMPLE 2: Calculate Missing Annual Volume
-- =============================================
-- Estimate annual volume from product quantities if missing

UPDATE agrosoluce.cooperatives c
SET annual_volume_tons = COALESCE(
    c.annual_volume_tons,
    (
        SELECT SUM(p.quantity_available) / 1000.0 -- Convert kg to tons
        FROM agrosoluce.products p
        WHERE p.cooperative_id = c.id
        AND p.unit = 'kg'
    )
)
WHERE c.annual_volume_tons IS NULL;

-- =============================================
-- EXAMPLE 3: Enrich with Market Prices
-- =============================================
-- Add current market price to cooperative metadata

UPDATE agrosoluce.cooperatives c
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{current_market_price_usd_per_ton}',
    to_jsonb(mp.price_per_ton_usd)
)
FROM (
    SELECT DISTINCT ON (commodity, country)
        commodity, 
        country, 
        price_per_ton_usd
    FROM agrosoluce.market_prices
    ORDER BY commodity, country, price_date DESC
) mp
WHERE c.commodity = mp.commodity 
  AND c.country = mp.country
  AND c.commodity IS NOT NULL
  AND c.country IS NOT NULL;

-- =============================================
-- EXAMPLE 4: Enrich with Geographic Data
-- =============================================
-- Add climate and agricultural potential data

UPDATE agrosoluce.cooperatives c
SET metadata = jsonb_set(
    jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{climate_zone}',
        to_jsonb(gd.climate_zone)
    ),
    '{agricultural_potential_score}',
    to_jsonb(gd.agricultural_potential_score)
)
FROM agrosoluce.geographic_data gd
WHERE c.country = gd.country 
  AND (c.region = gd.region OR (c.region IS NULL AND gd.region IS NULL))
  AND (c.department = gd.department OR (c.department IS NULL AND gd.department IS NULL))
  AND gd.climate_zone IS NOT NULL;

-- =============================================
-- EXAMPLE 5: Calculate Member Count from Farmers
-- =============================================
-- If member_count is missing, count active farmers

UPDATE agrosoluce.cooperatives c
SET member_count = (
    SELECT COUNT(*)
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id
    AND f.is_active = true
)
WHERE c.member_count IS NULL;

-- =============================================
-- EXAMPLE 6: Update Data Quality Scores
-- =============================================
-- Recalculate enrichment scores for all cooperatives

UPDATE agrosoluce.cooperatives
SET data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(id),
    last_verified_at = NOW()
WHERE id IN (
    SELECT id FROM agrosoluce.cooperatives
    WHERE data_quality_score IS NULL 
       OR data_quality_score < 70
       OR last_verified_at IS NULL
       OR last_verified_at < NOW() - INTERVAL '30 days'
);

-- =============================================
-- EXAMPLE 7: Enrich Compliance Flags
-- =============================================
-- Update compliance flags based on certifications

UPDATE agrosoluce.cooperatives c
SET compliance_flags = jsonb_set(
    COALESCE(compliance_flags, '{}'::jsonb),
    '{eudrReady}',
    to_jsonb(
        EXISTS (
            SELECT 1 FROM agrosoluce.certifications cert
            WHERE cert.cooperative_id = c.id
            AND cert.status = 'active'
            AND cert.certification_type IN ('organic', 'fair_trade', 'rainforest_alliance')
        )
    )
)
WHERE compliance_flags->>'eudrReady' IS NULL;

-- Update child labor risk based on certifications and data quality
UPDATE agrosoluce.cooperatives c
SET compliance_flags = jsonb_set(
    COALESCE(compliance_flags, '{}'::jsonb),
    '{childLaborRisk}',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM agrosoluce.certifications cert
            WHERE cert.cooperative_id = c.id
            AND cert.status = 'active'
            AND cert.certification_type IN ('fair_trade', 'rainforest_alliance')
        ) THEN to_jsonb('low'::text)
        WHEN c.data_quality_score >= 70 THEN to_jsonb('medium'::text)
        ELSE to_jsonb('high'::text)
    END
)
WHERE compliance_flags->>'childLaborRisk' IS NULL 
   OR compliance_flags->>'childLaborRisk' = 'unknown';

-- =============================================
-- EXAMPLE 8: Batch Enrichment with Logging
-- =============================================
-- Enrich multiple cooperatives and log the operations

DO $$
DECLARE
    coop_record RECORD;
    enriched_fields TEXT[];
    success_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    FOR coop_record IN 
        SELECT id, name 
        FROM agrosoluce.cooperatives 
        WHERE data_quality_score IS NULL 
           OR data_quality_score < 50
        LIMIT 100 -- Process in batches
    LOOP
        BEGIN
            -- Perform enrichment
            PERFORM agrosoluce.auto_enrich_cooperative(coop_record.id);
            
            -- Determine what fields were enriched
            enriched_fields := ARRAY[]::TEXT[];
            IF (SELECT data_quality_score FROM agrosoluce.cooperatives WHERE id = coop_record.id) IS NOT NULL THEN
                enriched_fields := enriched_fields || 'data_quality_score';
            END IF;
            
            -- Log successful enrichment
            INSERT INTO agrosoluce.enrichment_log (
                entity_type, 
                entity_id, 
                enrichment_type, 
                enrichment_source,
                fields_enriched,
                success
            ) VALUES (
                'cooperative', 
                coop_record.id, 
                'batch', 
                'automated_script',
                enriched_fields,
                true
            );
            
            success_count := success_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log errors
            INSERT INTO agrosoluce.enrichment_log (
                entity_type, 
                entity_id, 
                enrichment_type, 
                enrichment_source,
                success,
                error_message
            ) VALUES (
                'cooperative', 
                coop_record.id, 
                'batch', 
                'automated_script',
                false,
                SQLERRM
            );
            
            error_count := error_count + 1;
        END;
    END LOOP;
    
    RAISE NOTICE 'Enrichment complete: % successful, % errors', success_count, error_count;
END $$;

-- =============================================
-- EXAMPLE 9: Query Enriched Data
-- =============================================
-- Use the enriched views for reporting

-- Get cooperatives with high data quality and good scores
SELECT 
    name,
    country,
    commodity,
    member_count,
    financial_health_score,
    sustainability_score,
    data_completeness_score,
    current_market_price_per_ton,
    climate_zone
FROM agrosoluce.enriched_cooperatives
WHERE data_completeness_score >= 70
  AND financial_health_score >= 6
ORDER BY data_completeness_score DESC, sustainability_score DESC
LIMIT 20;

-- =============================================
-- EXAMPLE 10: Export Enriched Data for Analysis
-- =============================================
-- Create a comprehensive export view

CREATE OR REPLACE VIEW agrosoluce.cooperatives_export AS
SELECT 
    c.id,
    c.name,
    c.country,
    c.region,
    c.commodity,
    c.annual_volume_tons,
    c.member_count,
    c.established_year,
    c.financial_health_score,
    c.sustainability_score,
    c.data_quality_score,
    c.compliance_flags->>'eudrReady' AS eudr_ready,
    c.compliance_flags->>'childLaborRisk' AS child_labor_risk,
    array_to_string(c.certifications, ', ') AS certifications_list,
    mp.price_per_ton_usd AS current_market_price,
    gd.climate_zone,
    gd.agricultural_potential_score,
    COUNT(DISTINCT f.id) AS total_farmers,
    COUNT(DISTINCT p.id) AS total_products,
    AVG(survey.overall_satisfaction) AS avg_satisfaction
FROM agrosoluce.cooperatives c
LEFT JOIN agrosoluce.farmers f ON f.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.satisfaction_surveys survey ON survey.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT price_per_ton_usd 
    FROM agrosoluce.market_prices 
    WHERE commodity = c.commodity 
    AND country = c.country 
    ORDER BY price_date DESC 
    LIMIT 1
) mp ON true
LEFT JOIN agrosoluce.geographic_data gd ON 
    gd.country = c.country 
    AND gd.region = c.region 
    AND gd.department = c.department
GROUP BY 
    c.id, c.name, c.country, c.region, c.commodity, 
    c.annual_volume_tons, c.member_count, c.established_year,
    c.financial_health_score, c.sustainability_score, c.data_quality_score,
    c.compliance_flags, c.certifications,
    mp.price_per_ton_usd, gd.climate_zone, gd.agricultural_potential_score;

-- Export to CSV (run this in psql or your database client)
-- \copy (SELECT * FROM agrosoluce.cooperatives_export) TO 'cooperatives_enriched.csv' WITH CSV HEADER;


-- Migration: Dataset Enrichment Guide
-- This migration demonstrates various strategies for enriching the AgroSoluce dataset
-- Includes: additional fields, computed columns, seed data, and enrichment views

-- =============================================
-- STRATEGY 1: ADD ENRICHMENT FIELDS TO EXISTING TABLES
-- =============================================

-- Enrich cooperatives table with additional business intelligence fields
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS member_count INTEGER,
ADD COLUMN IF NOT EXISTS established_year INTEGER,
ADD COLUMN IF NOT EXISTS legal_structure VARCHAR(100), -- 'cooperative', 'association', 'union', etc.
ADD COLUMN IF NOT EXISTS primary_language VARCHAR(50),
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb, -- {facebook: url, twitter: url, etc.}
ADD COLUMN IF NOT EXISTS financial_health_score NUMERIC(3, 1) CHECK (financial_health_score >= 0 AND financial_health_score <= 10),
ADD COLUMN IF NOT EXISTS sustainability_score NUMERIC(3, 1) CHECK (sustainability_score >= 0 AND sustainability_score <= 10),
ADD COLUMN IF NOT EXISTS market_reputation_score NUMERIC(3, 1) CHECK (market_reputation_score >= 0 AND market_reputation_score <= 10),
ADD COLUMN IF NOT EXISTS export_experience_years INTEGER,
ADD COLUMN IF NOT EXISTS previous_buyers_count INTEGER,
ADD COLUMN IF NOT EXISTS quality_control_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS processing_capacity_tons_per_year NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS storage_capacity_tons NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS transportation_access VARCHAR(100), -- 'excellent', 'good', 'limited'
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_source VARCHAR(255), -- Who verified this data
ADD COLUMN IF NOT EXISTS data_quality_score NUMERIC(3, 1) CHECK (data_quality_score >= 0 AND data_quality_score <= 10);

-- Enrich farmers table with additional producer information
ALTER TABLE agrosoluce.farmers
ADD COLUMN IF NOT EXISTS farm_size_hectares NUMERIC(8, 2),
ADD COLUMN IF NOT EXISTS primary_crop VARCHAR(100),
ADD COLUMN IF NOT EXISTS secondary_crops TEXT[],
ADD COLUMN IF NOT EXISTS farming_experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education_level VARCHAR(50), -- 'none', 'primary', 'secondary', 'tertiary'
ADD COLUMN IF NOT EXISTS household_size INTEGER,
ADD COLUMN IF NOT EXISTS annual_income_usd NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS access_to_credit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS irrigation_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS organic_practices BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_harvest_date DATE,
ADD COLUMN IF NOT EXISTS expected_next_harvest_date DATE,
ADD COLUMN IF NOT EXISTS yield_per_hectare NUMERIC(8, 2);

-- =============================================
-- STRATEGY 2: CREATE ENRICHMENT LOOKUP TABLES
-- =============================================

-- Market prices reference table (for price enrichment)
CREATE TABLE IF NOT EXISTS agrosoluce.market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    price_per_ton_usd NUMERIC(10, 2) NOT NULL,
    price_date DATE NOT NULL,
    source VARCHAR(255), -- 'FAO', 'local_market', 'export_price', etc.
    quality_grade VARCHAR(50), -- 'premium', 'standard', 'bulk'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(commodity, country, price_date, quality_grade)
);

-- Geographic enrichment table (regions, climate zones, etc.)
CREATE TABLE IF NOT EXISTS agrosoluce.geographic_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    department VARCHAR(100),
    commune VARCHAR(100),
    climate_zone VARCHAR(100), -- 'tropical', 'savanna', etc.
    rainfall_mm_per_year NUMERIC(6, 2),
    average_temperature_celsius NUMERIC(4, 1),
    soil_type VARCHAR(100),
    elevation_meters INTEGER,
    agricultural_potential_score NUMERIC(3, 1) CHECK (agricultural_potential_score >= 0 AND agricultural_potential_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country, region, department, commune)
);

-- Certification standards reference table
CREATE TABLE IF NOT EXISTS agrosoluce.certification_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_code VARCHAR(50) UNIQUE NOT NULL, -- 'FAIRTRADE', 'RA', 'ORGANIC', etc.
    certification_name VARCHAR(255) NOT NULL,
    description TEXT,
    issuer_organization VARCHAR(255),
    requirements_summary TEXT,
    typical_cost_usd NUMERIC(10, 2),
    renewal_period_months INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STRATEGY 3: CREATE COMPUTED/ENRICHED VIEWS
-- =============================================

-- Enriched cooperative view with calculated metrics
CREATE OR REPLACE VIEW agrosoluce.enriched_cooperatives AS
SELECT 
    c.*,
    COUNT(DISTINCT f.id) AS total_farmers,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT cert.id) AS total_certifications,
    AVG(baseline.total_admin_hours_per_week) AS avg_baseline_admin_hours,
    MAX(progress.progress_month) AS last_progress_report_month,
    AVG(survey.overall_satisfaction) AS avg_satisfaction_score,
    -- Calculate enrichment score based on data completeness
    (
        CASE WHEN c.name IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.country IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.commodity IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.annual_volume_tons IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.member_count IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.established_year IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.financial_health_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.sustainability_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.website_url IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.contact_email IS NOT NULL THEN 1 ELSE 0 END
    ) * 10 AS data_completeness_score,
    -- Market price enrichment (latest price for commodity)
    mp.price_per_ton_usd AS current_market_price_per_ton,
    -- Geographic enrichment
    gd.climate_zone,
    gd.agricultural_potential_score
FROM agrosoluce.cooperatives c
LEFT JOIN agrosoluce.farmers f ON f.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.baseline_measurements baseline ON baseline.cooperative_id = c.id
LEFT JOIN agrosoluce.monthly_progress progress ON progress.cooperative_id = c.id
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
GROUP BY c.id, mp.price_per_ton_usd, gd.climate_zone, gd.agricultural_potential_score;

-- Enriched farmer view with cooperative context
CREATE OR REPLACE VIEW agrosoluce.enriched_farmers AS
SELECT 
    f.*,
    c.name AS cooperative_name,
    c.region AS cooperative_region,
    c.commodity AS cooperative_commodity,
    c.certifications AS cooperative_certifications,
    COUNT(DISTINCT b.id) AS total_batches,
    SUM(b.quantity) AS total_production_quantity,
    MAX(b.harvest_date) AS last_harvest_date,
    -- Calculate farmer productivity score
    CASE 
        WHEN f.farm_size_hectares > 0 AND f.yield_per_hectare > 0 
        THEN (f.yield_per_hectare / NULLIF(f.farm_size_hectares, 0)) * 10
        ELSE NULL
    END AS productivity_score
FROM agrosoluce.farmers f
LEFT JOIN agrosoluce.cooperatives c ON c.id = f.cooperative_id
LEFT JOIN agrosoluce.batches b ON b.farmer_id = f.id
GROUP BY f.id, c.name, c.region, c.commodity, c.certifications;

-- =============================================
-- STRATEGY 4: CREATE ENRICHMENT FUNCTIONS
-- =============================================

-- Function to calculate cooperative enrichment score
CREATE OR REPLACE FUNCTION agrosoluce.calculate_cooperative_enrichment_score(coop_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    score NUMERIC := 0;
    max_score NUMERIC := 100;
BEGIN
    -- Basic information (30 points)
    SELECT score + 
        CASE WHEN name IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN country IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN commodity IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN annual_volume_tons IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN contact_email IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN contact_phone IS NOT NULL THEN 5 ELSE 0 END
    INTO score
    FROM agrosoluce.cooperatives WHERE id = coop_id;
    
    -- Extended information (40 points)
    SELECT score + 
        CASE WHEN member_count IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN established_year IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN financial_health_score IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN sustainability_score IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN website_url IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN processing_capacity_tons_per_year IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN storage_capacity_tons IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN export_experience_years IS NOT NULL THEN 5 ELSE 0 END
    INTO score
    FROM agrosoluce.cooperatives WHERE id = coop_id;
    
    -- Activity data (30 points)
    SELECT score + 
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.farmers WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END +
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.products WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END +
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.certifications WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END
    INTO score;
    
    RETURN LEAST(score, max_score);
END;
$$ LANGUAGE plpgsql;

-- Function to auto-enrich cooperative from external sources (placeholder)
CREATE OR REPLACE FUNCTION agrosoluce.auto_enrich_cooperative(coop_id UUID)
RETURNS VOID AS $$
BEGIN
    -- This function would integrate with external APIs to enrich data
    -- Examples: Google Maps API for location data, certification databases, etc.
    -- For now, this is a placeholder structure
    
    -- Update data quality score based on available data
    UPDATE agrosoluce.cooperatives
    SET data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(coop_id)
    WHERE id = coop_id;
    
    -- Update last verified timestamp
    UPDATE agrosoluce.cooperatives
    SET last_verified_at = NOW()
    WHERE id = coop_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STRATEGY 5: CREATE ENRICHMENT TRIGGERS
-- =============================================

-- Trigger to auto-calculate enrichment scores when data is updated
CREATE OR REPLACE FUNCTION agrosoluce.update_enrichment_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Update data quality score whenever cooperative data changes
    NEW.data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cooperative_enrichment
    BEFORE INSERT OR UPDATE ON agrosoluce.cooperatives
    FOR EACH ROW
    EXECUTE FUNCTION agrosoluce.update_enrichment_scores();

-- =============================================
-- STRATEGY 6: SEED DATA FOR ENRICHMENT
-- =============================================

-- Insert certification standards reference data
INSERT INTO agrosoluce.certification_standards (certification_code, certification_name, description, issuer_organization, typical_cost_usd, renewal_period_months) VALUES
('FAIRTRADE', 'Fairtrade', 'Fairtrade certification ensures fair prices and better working conditions for farmers', 'Fairtrade International', 2000, 12),
('RA', 'Rainforest Alliance', 'Rainforest Alliance certification promotes sustainable agriculture and forest conservation', 'Rainforest Alliance', 1500, 12),
('ORGANIC', 'Organic', 'Organic certification ensures products are grown without synthetic pesticides or fertilizers', 'Various (IFOAM, USDA, etc.)', 1000, 12),
('UTZ', 'UTZ Certified', 'UTZ certification promotes sustainable farming and better opportunities for farmers', 'UTZ', 1800, 12),
('4C', '4C Association', '4C certification ensures sustainable coffee production', '4C Association', 1200, 12),
('RSPO', 'RSPO', 'Roundtable on Sustainable Palm Oil certification', 'RSPO', 2500, 12)
ON CONFLICT (certification_code) DO NOTHING;

-- Insert sample market prices (you would update this with real data)
INSERT INTO agrosoluce.market_prices (commodity, country, price_per_ton_usd, price_date, source, quality_grade) VALUES
('Cocoa', 'Ivory Coast', 2500, CURRENT_DATE, 'local_market', 'premium'),
('Cocoa', 'Ivory Coast', 2200, CURRENT_DATE, 'local_market', 'standard'),
('Coffee', 'Ivory Coast', 1800, CURRENT_DATE, 'local_market', 'premium'),
('Coffee', 'Ivory Coast', 1600, CURRENT_DATE, 'local_market', 'standard'),
('Cashew', 'Ivory Coast', 1200, CURRENT_DATE, 'local_market', 'standard')
ON CONFLICT (commodity, country, price_date, quality_grade) DO NOTHING;

-- =============================================
-- STRATEGY 7: CREATE ENRICHMENT INDEXES
-- =============================================

-- Indexes for enrichment fields to improve query performance
CREATE INDEX IF NOT EXISTS idx_cooperatives_member_count ON agrosoluce.cooperatives(member_count);
CREATE INDEX IF NOT EXISTS idx_cooperatives_established_year ON agrosoluce.cooperatives(established_year);
CREATE INDEX IF NOT EXISTS idx_cooperatives_financial_health ON agrosoluce.cooperatives(financial_health_score);
CREATE INDEX IF NOT EXISTS idx_cooperatives_sustainability ON agrosoluce.cooperatives(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_cooperatives_data_quality ON agrosoluce.cooperatives(data_quality_score);
CREATE INDEX IF NOT EXISTS idx_farmers_farm_size ON agrosoluce.farmers(farm_size_hectares);
CREATE INDEX IF NOT EXISTS idx_farmers_primary_crop ON agrosoluce.farmers(primary_crop);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity_country ON agrosoluce.market_prices(commodity, country, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_geographic_data_location ON agrosoluce.geographic_data(country, region, department, commune);

-- =============================================
-- STRATEGY 8: CREATE ENRICHMENT METADATA TABLE
-- =============================================

-- Track enrichment operations and data sources
CREATE TABLE IF NOT EXISTS agrosoluce.enrichment_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'cooperative', 'farmer', 'product', etc.
    entity_id UUID NOT NULL,
    enrichment_type VARCHAR(100) NOT NULL, -- 'manual', 'api', 'import', 'calculated'
    enrichment_source VARCHAR(255), -- 'user_input', 'google_maps', 'certification_db', etc.
    fields_enriched TEXT[], -- Array of field names that were enriched
    enrichment_data JSONB, -- Snapshot of enriched data
    performed_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_enrichment_log_entity ON agrosoluce.enrichment_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_enrichment_log_performed_at ON agrosoluce.enrichment_log(performed_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on new tables
ALTER TABLE agrosoluce.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.geographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.certification_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.enrichment_log ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Anyone can view market prices" ON agrosoluce.market_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can view geographic data" ON agrosoluce.geographic_data FOR SELECT USING (true);
CREATE POLICY "Anyone can view certification standards" ON agrosoluce.certification_standards FOR SELECT USING (true);

-- Enrichment log: users can view logs for their entities
CREATE POLICY "Users can view enrichment logs for their entities" ON agrosoluce.enrichment_log
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
    );

-- =============================================
-- GRANTS
-- =============================================

GRANT SELECT ON agrosoluce.enriched_cooperatives TO authenticated;
GRANT SELECT ON agrosoluce.enriched_cooperatives TO anon;
GRANT SELECT ON agrosoluce.enriched_farmers TO authenticated;
GRANT SELECT ON agrosoluce.enriched_farmers TO anon;
GRANT ALL ON agrosoluce.market_prices TO authenticated;
GRANT ALL ON agrosoluce.geographic_data TO authenticated;
GRANT ALL ON agrosoluce.certification_standards TO authenticated;
GRANT SELECT ON agrosoluce.enrichment_log TO authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON VIEW agrosoluce.enriched_cooperatives IS 'Cooperative data enriched with calculated metrics, market prices, and geographic information';
COMMENT ON VIEW agrosoluce.enriched_farmers IS 'Farmer data enriched with cooperative context and production metrics';
COMMENT ON TABLE agrosoluce.market_prices IS 'Reference table for commodity market prices by country and date';
COMMENT ON TABLE agrosoluce.geographic_data IS 'Geographic enrichment data including climate, soil, and agricultural potential';
COMMENT ON TABLE agrosoluce.certification_standards IS 'Reference table for certification standards and requirements';
COMMENT ON TABLE agrosoluce.enrichment_log IS 'Audit log of all dataset enrichment operations';
COMMENT ON FUNCTION agrosoluce.calculate_cooperative_enrichment_score IS 'Calculates data enrichment/completeness score for a cooperative (0-100)';
COMMENT ON FUNCTION agrosoluce.auto_enrich_cooperative IS 'Automatically enriches cooperative data from external sources';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('009_dataset_enrichment_guide', 'Dataset enrichment guide: additional fields, lookup tables, computed views, and enrichment functions')
ON CONFLICT (migration_name) DO NOTHING;


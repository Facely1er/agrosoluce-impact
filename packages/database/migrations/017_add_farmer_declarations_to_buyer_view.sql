-- Migration: Add Farmer Declarations to Buyer-Facing View
-- Extends buyer_facing_summary view to include aggregate farmer declaration information
-- Shows: total count, declaration types present, last declaration date
-- Does NOT show: individual farmer references, declaration text values, gaps at farmer level
-- All data labeled as "Aggregated farmer declarations (self-reported, unverified)"

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('017_add_farmer_declarations_to_buyer_view', 'Add aggregate farmer declarations to buyer-facing summary view')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- UPDATE BUYER-FACING SUMMARY VIEW
-- =============================================

-- Update the buyer_facing_summary view to include aggregate farmer declaration information
CREATE OR REPLACE VIEW agrosoluce.buyer_facing_summary AS
SELECT 
    c.id,
    c.name,
    c.country,
    c.region,
    c.commodity,
    c.annual_volume_tons,
    -- Readiness badge calculation
    CASE 
        WHEN readiness.readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness.readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_badge,
    -- Evidence coverage percentages
    COALESCE(
        ROUND((farmer_stats.documented_farmers::NUMERIC / NULLIF(farmer_stats.total_farmers, 0) * 100), 1),
        0
    ) AS farmer_coverage_pct,
    COALESCE(
        ROUND((plot_stats.geo_referenced_plots::NUMERIC / NULLIF(plot_stats.total_plots, 0) * 100), 1),
        0
    ) AS plot_coverage_pct,
    COALESCE(
        ROUND((doc_stats.required_docs_uploaded::NUMERIC / NULLIF(doc_stats.total_required_docs, 0) * 100), 1),
        0
    ) AS document_coverage_pct,
    -- Certifications summary
    array_agg(DISTINCT cert.certification_type) FILTER (WHERE cert.status = 'active') AS certifications,
    -- Active lots count
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots_count,
    -- Risk flags (high-level only)
    c.compliance_flags->>'childLaborRisk' AS child_labor_risk,
    c.compliance_flags->>'eudrReady' AS eudr_ready,
    -- Status (only approved cooperatives visible to buyers)
    c.status,
    -- Aggregated farmer declarations (self-reported, unverified)
    -- Total count of farmer declarations
    COALESCE(declaration_stats.total_declarations, 0) AS farmer_declarations_total_count,
    -- Array of distinct declaration types present
    COALESCE(declaration_stats.declaration_types_present, ARRAY[]::VARCHAR[]) AS farmer_declarations_types_present,
    -- Last declaration date (most recent declared_at)
    declaration_stats.farmer_declarations_last_date AS farmer_declarations_last_date
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM agrosoluce.farmer_declarations fd 
            WHERE fd.farmer_id = f.id 
            AND fd.declaration_type = 'child_labor'
        )) AS documented_farmers,
        COUNT(*) AS total_farmers
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id AND f.is_active = true
) farmer_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL) AS geo_referenced_plots,
        COUNT(*) AS total_plots
    FROM agrosoluce.field_declarations fd
    WHERE fd.cooperative_id = c.id
) plot_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE is_buyer_visible = true) AS required_docs_uploaded,
        COUNT(*) AS total_required_docs
    FROM agrosoluce.documents d
    WHERE d.entity_type = 'cooperative' AND d.entity_id = c.id
) doc_stats ON true
-- Aggregate farmer declarations from new farmer_declarations table (migration 016)
-- Join via canonical_cooperative_directory: cooperatives.id = canonical_cooperative_directory.coop_id
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) AS total_declarations,
        array_agg(DISTINCT fd.declaration_type) AS declaration_types_present,
        MAX(fd.declared_at) AS farmer_declarations_last_date
    FROM agrosoluce.farmer_declarations fd
    WHERE fd.coop_id = c.id  -- cooperatives.id maps to canonical_cooperative_directory.coop_id
) declaration_stats ON true
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT 
        (
            CASE WHEN farmer_stats.documented_farmers > 0 THEN 20 ELSE 0 END +
            CASE WHEN plot_stats.geo_referenced_plots > 0 THEN 20 ELSE 0 END +
            CASE WHEN doc_stats.required_docs_uploaded > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT cert.id) > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') > 0 THEN 20 ELSE 0 END
        ) AS readiness_score
) readiness ON true
WHERE c.status = 'approved' -- Only show approved cooperatives to buyers
GROUP BY 
    c.id, c.name, c.country, c.region, c.commodity, c.annual_volume_tons,
    c.compliance_flags, c.status,
    farmer_stats.documented_farmers, farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots, plot_stats.total_plots,
    doc_stats.required_docs_uploaded, doc_stats.total_required_docs,
    readiness.readiness_score,
    declaration_stats.total_declarations,
    declaration_stats.declaration_types_present,
    declaration_stats.farmer_declarations_last_date;

-- =============================================
-- GRANTS (Preserve existing public access)
-- =============================================

-- Ensure grants are preserved for buyer-facing view
GRANT SELECT ON agrosoluce.buyer_facing_summary TO authenticated;
GRANT SELECT ON agrosoluce.buyer_facing_summary TO anon;

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON COLUMN agrosoluce.buyer_facing_summary.farmer_declarations_total_count IS 'Aggregated farmer declarations (self-reported, unverified): Total count of farmer declarations for this cooperative';
COMMENT ON COLUMN agrosoluce.buyer_facing_summary.farmer_declarations_types_present IS 'Aggregated farmer declarations (self-reported, unverified): Array of distinct declaration types present (e.g., child_labor, land_use)';
COMMENT ON COLUMN agrosoluce.buyer_facing_summary.farmer_declarations_last_date IS 'Aggregated farmer declarations (self-reported, unverified): Date of most recent declaration (declared_at)';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('017_add_farmer_declarations_to_buyer_view', 'Add aggregate farmer declarations to buyer-facing summary view')
ON CONFLICT (migration_name) DO NOTHING;


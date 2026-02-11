-- Migration: Coverage Metrics Table
-- Creates a dedicated table for document coverage metrics per cooperative

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('013_coverage_metrics_table', 'Coverage Metrics Table: dedicated table for document coverage metrics per cooperative')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- COVERAGE METRICS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.coverage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coop_id UUID NOT NULL,
    required_docs_total INTEGER NOT NULL DEFAULT 0,
    required_docs_present INTEGER NOT NULL DEFAULT 0,
    coverage_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(coop_id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_coverage_metrics_coop_id ON agrosoluce.coverage_metrics(coop_id);
CREATE INDEX IF NOT EXISTS idx_coverage_metrics_last_updated ON agrosoluce.coverage_metrics(last_updated DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on coverage metrics table
ALTER TABLE agrosoluce.coverage_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view coverage metrics
CREATE POLICY "Authenticated users can view coverage metrics" 
    ON agrosoluce.coverage_metrics
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert coverage metrics
CREATE POLICY "Authenticated users can insert coverage metrics" 
    ON agrosoluce.coverage_metrics
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update coverage metrics
CREATE POLICY "Authenticated users can update coverage metrics" 
    ON agrosoluce.coverage_metrics
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Grant read access to anon users (for public viewing)
CREATE POLICY "Anon users can view coverage metrics" 
    ON agrosoluce.coverage_metrics
    FOR SELECT 
    USING (true);

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.coverage_metrics IS 'Document coverage metrics per cooperative - tracks required vs present document types';
COMMENT ON COLUMN agrosoluce.coverage_metrics.coop_id IS 'Reference to cooperative (can reference canonical_cooperative_directory or cooperatives table)';
COMMENT ON COLUMN agrosoluce.coverage_metrics.required_docs_total IS 'Total number of required document types for this cooperative';
COMMENT ON COLUMN agrosoluce.coverage_metrics.required_docs_present IS 'Number of required document types that have at least one evidence document';
COMMENT ON COLUMN agrosoluce.coverage_metrics.coverage_percentage IS 'Percentage coverage: (required_docs_present / required_docs_total) * 100';
COMMENT ON COLUMN agrosoluce.coverage_metrics.last_updated IS 'Timestamp when coverage metrics were last calculated';

-- =============================================
-- GRANTS
-- =============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA agrosoluce TO authenticated;
GRANT ALL ON agrosoluce.coverage_metrics TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE IF EXISTS agrosoluce.coverage_metrics_id_seq TO authenticated;

-- Grant read access to anon users
GRANT USAGE ON SCHEMA agrosoluce TO anon;
GRANT SELECT ON agrosoluce.coverage_metrics TO anon;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO agrosoluce.migrations (migration_name, description, executed_at) 
VALUES ('013_coverage_metrics_table_completed', 'Coverage Metrics Table migration completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;


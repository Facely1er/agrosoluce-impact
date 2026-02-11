-- Migration: Canonical Cooperative Directory
-- Creates a canonical cooperative directory table for standardized directory management
-- This table serves as the authoritative source for cooperative directory entries

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('012_canonical_cooperative_directory', 'Canonical Cooperative Directory: standardized directory model with coop_id, name, country, region, department, primary_crop, source_registry, record_status')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- CANONICAL COOPERATIVE DIRECTORY TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.canonical_cooperative_directory (
    coop_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    region VARCHAR(100),
    department VARCHAR(100),
    primary_crop VARCHAR(100),
    source_registry VARCHAR(255),
    record_status VARCHAR(50) DEFAULT 'active' CHECK (record_status IN ('active', 'inactive', 'archived', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_canonical_dir_country ON agrosoluce.canonical_cooperative_directory(country);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_region ON agrosoluce.canonical_cooperative_directory(region);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_department ON agrosoluce.canonical_cooperative_directory(department);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_primary_crop ON agrosoluce.canonical_cooperative_directory(primary_crop);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_source_registry ON agrosoluce.canonical_cooperative_directory(source_registry);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_record_status ON agrosoluce.canonical_cooperative_directory(record_status);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_created_at ON agrosoluce.canonical_cooperative_directory(created_at);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_name ON agrosoluce.canonical_cooperative_directory(name);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_canonical_dir_country_region ON agrosoluce.canonical_cooperative_directory(country, region);
CREATE INDEX IF NOT EXISTS idx_canonical_dir_status_created ON agrosoluce.canonical_cooperative_directory(record_status, created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on canonical directory table
ALTER TABLE agrosoluce.canonical_cooperative_directory ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active records
CREATE POLICY "Anyone can view active canonical directory records" 
    ON agrosoluce.canonical_cooperative_directory
    FOR SELECT 
    USING (record_status = 'active');

-- Policy: Authenticated users can view all records
CREATE POLICY "Authenticated users can view all canonical directory records" 
    ON agrosoluce.canonical_cooperative_directory
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert records
CREATE POLICY "Authenticated users can insert canonical directory records" 
    ON agrosoluce.canonical_cooperative_directory
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update records
CREATE POLICY "Authenticated users can update canonical directory records" 
    ON agrosoluce.canonical_cooperative_directory
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Policy: Admins can delete records
CREATE POLICY "Admins can delete canonical directory records" 
    ON agrosoluce.canonical_cooperative_directory
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.canonical_cooperative_directory IS 'Canonical Cooperative Directory - Authoritative source for standardized cooperative directory entries';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.coop_id IS 'Unique identifier for the cooperative directory entry';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.name IS 'Cooperative name';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.country IS 'Country where the cooperative is located';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.region IS 'Region/state where the cooperative is located';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.department IS 'Department/district where the cooperative is located';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.primary_crop IS 'Primary crop/commodity produced by the cooperative';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.source_registry IS 'Source registry or data source identifier';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.record_status IS 'Status of the record: active, inactive, archived, or pending';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.created_at IS 'Timestamp when the record was created';

-- =============================================
-- GRANTS
-- =============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA agrosoluce TO authenticated;
GRANT ALL ON agrosoluce.canonical_cooperative_directory TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE IF EXISTS agrosoluce.canonical_cooperative_directory_coop_id_seq TO authenticated;

-- Grant read access to anon users for active records
GRANT USAGE ON SCHEMA agrosoluce TO anon;
GRANT SELECT ON agrosoluce.canonical_cooperative_directory TO anon;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO agrosoluce.migrations (migration_name, description, executed_at) 
VALUES ('012_canonical_cooperative_directory_completed', 'Canonical Cooperative Directory migration completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;


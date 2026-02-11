-- Migration: Readiness Snapshots Table
-- Creates a table for tracking readiness status snapshots per cooperative

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('014_readiness_snapshots', 'Readiness Snapshots Table: tracks readiness status snapshots per cooperative based on coverage metrics')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- READINESS SNAPSHOTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.readiness_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coop_id UUID NOT NULL,
    readiness_status VARCHAR(20) NOT NULL CHECK (readiness_status IN ('not_ready', 'in_progress', 'buyer_ready')),
    snapshot_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_readiness_snapshots_coop_id ON agrosoluce.readiness_snapshots(coop_id);
CREATE INDEX IF NOT EXISTS idx_readiness_snapshots_created_at ON agrosoluce.readiness_snapshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readiness_snapshots_coop_created ON agrosoluce.readiness_snapshots(coop_id, created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on readiness snapshots table
ALTER TABLE agrosoluce.readiness_snapshots ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view readiness snapshots
CREATE POLICY "Authenticated users can view readiness snapshots" 
    ON agrosoluce.readiness_snapshots
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert readiness snapshots
CREATE POLICY "Authenticated users can insert readiness snapshots" 
    ON agrosoluce.readiness_snapshots
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Grant read access to anon users (for public viewing)
CREATE POLICY "Anon users can view readiness snapshots" 
    ON agrosoluce.readiness_snapshots
    FOR SELECT 
    USING (true);

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.readiness_snapshots IS 'Readiness status snapshots per cooperative - internal shorthand based on documentation coverage';
COMMENT ON COLUMN agrosoluce.readiness_snapshots.coop_id IS 'Reference to cooperative (can reference canonical_cooperative_directory or cooperatives table)';
COMMENT ON COLUMN agrosoluce.readiness_snapshots.readiness_status IS 'Readiness status: not_ready, in_progress, or buyer_ready';
COMMENT ON COLUMN agrosoluce.readiness_snapshots.snapshot_reason IS 'Short text explaining the snapshot reason (e.g., coverage percentage)';
COMMENT ON COLUMN agrosoluce.readiness_snapshots.created_at IS 'Timestamp when snapshot was created';

-- =============================================
-- GRANTS
-- =============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA agrosoluce TO authenticated;
GRANT ALL ON agrosoluce.readiness_snapshots TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE IF EXISTS agrosoluce.readiness_snapshots_snapshot_id_seq TO authenticated;

-- Grant read access to anon users
GRANT USAGE ON SCHEMA agrosoluce TO anon;
GRANT SELECT ON agrosoluce.readiness_snapshots TO anon;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO agrosoluce.migrations (migration_name, description, executed_at) 
VALUES ('014_readiness_snapshots_completed', 'Readiness Snapshots Table migration completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;


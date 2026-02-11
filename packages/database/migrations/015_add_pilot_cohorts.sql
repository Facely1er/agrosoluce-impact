-- Migration: Add Pilot Cohort Support
-- Adds pilot_id and pilot_label columns to canonical_cooperative_directory table
-- This allows scoping work to a defined set of cooperatives

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('015_add_pilot_cohorts', 'Add pilot cohort support: pilot_id and pilot_label columns to canonical_cooperative_directory')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- ADD PILOT COHORT COLUMNS
-- =============================================

-- Add pilot_id column (nullable string, allows any identifier)
ALTER TABLE agrosoluce.canonical_cooperative_directory
ADD COLUMN IF NOT EXISTS pilot_id VARCHAR(100);

-- Add pilot_label column (optional label like "Pilot A")
ALTER TABLE agrosoluce.canonical_cooperative_directory
ADD COLUMN IF NOT EXISTS pilot_label VARCHAR(100);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for filtering by pilot_id
CREATE INDEX IF NOT EXISTS idx_canonical_dir_pilot_id ON agrosoluce.canonical_cooperative_directory(pilot_id);

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.pilot_id IS 'Pilot cohort identifier. A cooperative can belong to zero or one pilot cohort.';
COMMENT ON COLUMN agrosoluce.canonical_cooperative_directory.pilot_label IS 'Optional human-readable label for the pilot cohort (e.g., "Pilot A", "Q1 2024 Pilot")';

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO agrosoluce.migrations (migration_name, description, executed_at) 
VALUES ('015_add_pilot_cohorts_completed', 'Pilot cohort support migration completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;


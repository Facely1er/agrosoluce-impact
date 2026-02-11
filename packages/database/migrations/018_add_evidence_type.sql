-- Migration: Add Evidence Type Typology
-- Adds evidence_type column to documents table for evidence classification
-- Phase 3 - Step 1: Evidence Typology layer

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('018_add_evidence_type', 'Add evidence_type column to documents table for evidence typology classification')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- ADD EVIDENCE_TYPE COLUMN
-- =============================================

-- Add evidence_type column to documents table
ALTER TABLE agrosoluce.documents
ADD COLUMN IF NOT EXISTS evidence_type VARCHAR(50) DEFAULT 'documented'
    CHECK (evidence_type IN ('documented', 'declared', 'attested', 'contextual'));

-- Update existing records to default to 'documented'
UPDATE agrosoluce.documents
SET evidence_type = 'documented'
WHERE evidence_type IS NULL;

-- Create index for filtering by evidence_type
CREATE INDEX IF NOT EXISTS idx_documents_evidence_type ON agrosoluce.documents(evidence_type);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON COLUMN agrosoluce.documents.evidence_type IS 'Evidence classification typology: documented, declared, attested, or contextual. Not a quality or compliance assessment.';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('018_add_evidence_type', 'Add evidence_type column to documents table for evidence typology classification')
ON CONFLICT (migration_name) DO NOTHING;


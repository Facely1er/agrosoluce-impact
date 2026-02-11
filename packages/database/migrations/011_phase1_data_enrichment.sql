-- Migration: Phase 1 Data Enrichment
-- Adds enrichment fields to cooperatives table and document metadata enhancements
-- Implements contextual risks, regulatory context, coverage metrics, and readiness status

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('011_phase1_data_enrichment', 'Phase 1 Data Enrichment: contextual risks, regulatory context, coverage metrics, readiness status, and document metadata')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- 1. COOPERATIVE ENRICHMENT FIELDS
-- =============================================

-- Add enrichment columns to cooperatives table
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS contextual_risks JSONB,
ADD COLUMN IF NOT EXISTS regulatory_context JSONB,
ADD COLUMN IF NOT EXISTS coverage_metrics JSONB,
ADD COLUMN IF NOT EXISTS readiness_status TEXT DEFAULT 'not_ready'
    CHECK (readiness_status IN ('not_ready', 'in_progress', 'buyer_ready'));

-- Create indexes for enrichment fields
CREATE INDEX IF NOT EXISTS idx_cooperatives_readiness_status ON agrosoluce.cooperatives(readiness_status);
CREATE INDEX IF NOT EXISTS idx_cooperatives_contextual_risks ON agrosoluce.cooperatives USING GIN (contextual_risks);
CREATE INDEX IF NOT EXISTS idx_cooperatives_regulatory_context ON agrosoluce.cooperatives USING GIN (regulatory_context);
CREATE INDEX IF NOT EXISTS idx_cooperatives_coverage_metrics ON agrosoluce.cooperatives USING GIN (coverage_metrics);

-- =============================================
-- 2. DOCUMENT METADATA ENHANCEMENTS
-- =============================================

-- Add metadata fields to documents table
ALTER TABLE agrosoluce.documents
ADD COLUMN IF NOT EXISTS doc_type TEXT, -- 'certification' | 'policy' | 'land_evidence' | 'other'
ADD COLUMN IF NOT EXISTS issuer TEXT,
ADD COLUMN IF NOT EXISTS issued_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_required_type BOOLEAN DEFAULT false;

-- Create indexes for document metadata
CREATE INDEX IF NOT EXISTS idx_documents_doc_type ON agrosoluce.documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_documents_issuer ON agrosoluce.documents(issuer);
CREATE INDEX IF NOT EXISTS idx_documents_is_required_type ON agrosoluce.documents(is_required_type);
CREATE INDEX IF NOT EXISTS idx_documents_expires_at ON agrosoluce.documents(expires_at);

-- Update existing documents: map document_type to doc_type if doc_type is null
UPDATE agrosoluce.documents
SET doc_type = CASE
    WHEN document_type LIKE '%certif%' OR document_type LIKE '%cert%' THEN 'certification'
    WHEN document_type LIKE '%policy%' THEN 'policy'
    WHEN document_type LIKE '%plot%' OR document_type LIKE '%land%' OR document_type LIKE '%map%' OR document_type LIKE '%gps%' THEN 'land_evidence'
    ELSE 'other'
END
WHERE doc_type IS NULL;

-- Map expiry_date to expires_at if expires_at is null
UPDATE agrosoluce.documents
SET expires_at = expiry_date::TIMESTAMP WITH TIME ZONE
WHERE expires_at IS NULL AND expiry_date IS NOT NULL;

-- =============================================
-- 3. COMMENTS
-- =============================================

COMMENT ON COLUMN agrosoluce.cooperatives.contextual_risks IS 'Contextual risk tags (geo & regulatory): deforestation_zone, protected_area_overlap, climate_risk';
COMMENT ON COLUMN agrosoluce.cooperatives.regulatory_context IS 'Regulatory context: eudr_applicable, child_labor_due_diligence_required, other_requirements';
COMMENT ON COLUMN agrosoluce.cooperatives.coverage_metrics IS 'Coverage ratios: farmers_total, farmers_with_declarations, plots_total, plots_with_geo, required_docs_total, required_docs_present';
COMMENT ON COLUMN agrosoluce.cooperatives.readiness_status IS 'Readiness status: not_ready, in_progress, buyer_ready';
COMMENT ON COLUMN agrosoluce.documents.doc_type IS 'Document type: certification, policy, land_evidence, other';
COMMENT ON COLUMN agrosoluce.documents.is_required_type IS 'Whether this document type is required for buyer readiness';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('011_phase1_data_enrichment', 'Phase 1 Data Enrichment: contextual risks, regulatory context, coverage metrics, readiness status, and document metadata')
ON CONFLICT (migration_name) DO NOTHING;


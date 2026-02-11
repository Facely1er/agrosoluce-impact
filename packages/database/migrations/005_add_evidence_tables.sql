-- Migration: Add Evidence Tables
-- This migration creates tables for evidence and attestations (field declarations, audits, etc.)
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('005_add_evidence_tables', 'Add evidence tables for field declarations, audits, and attestations')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- EVIDENCE TABLES
-- =============================================

-- Field Declarations
CREATE TABLE IF NOT EXISTS agrosoluce.field_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES agrosoluce.farmers(id) ON DELETE SET NULL,
    field_location_latitude DECIMAL(10, 8),
    field_location_longitude DECIMAL(11, 8),
    crop_type VARCHAR(255) NOT NULL,
    area DECIMAL(10, 2) NOT NULL, -- in hectares
    declaration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Audits
CREATE TABLE IF NOT EXISTS agrosoluce.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    audit_type VARCHAR(100) NOT NULL, -- 'third_party', 'internal', 'regulatory', etc.
    auditor_name VARCHAR(255) NOT NULL,
    audit_date DATE NOT NULL,
    findings TEXT,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Attestations
CREATE TABLE IF NOT EXISTS agrosoluce.attestations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL, -- Can reference cooperative, farmer, batch, product, etc.
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('cooperative', 'farmer', 'batch', 'product')),
    attestation_type VARCHAR(100) NOT NULL, -- 'sustainability', 'labor', 'environmental', etc.
    content TEXT NOT NULL,
    signed_by VARCHAR(255) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_field_declarations_cooperative_id ON agrosoluce.field_declarations(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_field_declarations_farmer_id ON agrosoluce.field_declarations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_field_declarations_status ON agrosoluce.field_declarations(status);
CREATE INDEX IF NOT EXISTS idx_field_declarations_location ON agrosoluce.field_declarations USING GIST (point(field_location_longitude, field_location_latitude)) WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audits_cooperative_id ON agrosoluce.audits(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_audits_audit_date ON agrosoluce.audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_audits_status ON agrosoluce.audits(status);

CREATE INDEX IF NOT EXISTS idx_attestations_entity ON agrosoluce.attestations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_attestations_type ON agrosoluce.attestations(attestation_type);
CREATE INDEX IF NOT EXISTS idx_attestations_signed_at ON agrosoluce.attestations(signed_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on field_declarations table
ALTER TABLE agrosoluce.field_declarations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view field declarations from their cooperative
CREATE POLICY "Users can view field declarations from their cooperative"
    ON agrosoluce.field_declarations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = field_declarations.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert field declarations
CREATE POLICY "Cooperative users can insert field declarations"
    ON agrosoluce.field_declarations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = field_declarations.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative users can update their field declarations
CREATE POLICY "Cooperative users can update their field declarations"
    ON agrosoluce.field_declarations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = field_declarations.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Enable RLS on audits table
ALTER TABLE agrosoluce.audits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view audits from their cooperative
CREATE POLICY "Users can view audits from their cooperative"
    ON agrosoluce.audits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = audits.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert audits
CREATE POLICY "Cooperative users can insert audits"
    ON agrosoluce.audits
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = audits.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Enable RLS on attestations table
ALTER TABLE agrosoluce.attestations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view attestations for entities they have access to
CREATE POLICY "Users can view attestations"
    ON agrosoluce.attestations
    FOR SELECT
    USING (
        -- For cooperative attestations
        (entity_type = 'cooperative' AND EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id::text = attestations.entity_id::text
            AND up.user_id = auth.uid()
        ))
        OR
        -- For farmer attestations
        (entity_type = 'farmer' AND EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id::text = attestations.entity_id::text
            AND up.user_id = auth.uid()
        ))
        OR
        -- For batch attestations
        (entity_type = 'batch' AND EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.cooperatives c ON b.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE b.id::text = attestations.entity_id::text
            AND up.user_id = auth.uid()
        ))
        OR
        -- For product attestations
        (entity_type = 'product' AND EXISTS (
            SELECT 1 FROM agrosoluce.products p
            JOIN agrosoluce.cooperatives c ON p.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE p.id::text = attestations.entity_id::text
            AND up.user_id = auth.uid()
        ))
        OR
        -- Admins can view all
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert attestations
CREATE POLICY "Cooperative users can insert attestations"
    ON agrosoluce.attestations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND (user_type = 'cooperative' OR user_type = 'admin')
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.field_declarations IS 'Field declarations by farmers/cooperatives';
COMMENT ON TABLE agrosoluce.audits IS 'Audit records (third-party, internal, regulatory)';
COMMENT ON TABLE agrosoluce.attestations IS 'Attestations and declarations signed by entities';
COMMENT ON COLUMN agrosoluce.field_declarations.area IS 'Field area in hectares';
COMMENT ON COLUMN agrosoluce.attestations.entity_id IS 'UUID of the entity (cooperative, farmer, batch, or product)';


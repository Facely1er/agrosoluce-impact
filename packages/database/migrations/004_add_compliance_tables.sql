-- Migration: Add Compliance Tables
-- This migration creates tables for regulatory compliance (EUDR, certifications, etc.)
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('004_add_compliance_tables', 'Add compliance tables for EUDR, certifications, and regulatory requirements')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- COMPLIANCE TABLES
-- =============================================

-- Certifications
CREATE TABLE IF NOT EXISTS agrosoluce.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES agrosoluce.farmers(id) ON DELETE CASCADE,
    certification_type VARCHAR(100) NOT NULL, -- 'organic', 'fair_trade', 'rainforest_alliance', etc.
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending')),
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT certifications_entity_check CHECK (
        (cooperative_id IS NOT NULL AND farmer_id IS NULL) OR
        (cooperative_id IS NULL AND farmer_id IS NOT NULL)
    )
);

-- EUDR Verifications
CREATE TABLE IF NOT EXISTS agrosoluce.eudr_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES agrosoluce.batches(id) ON DELETE CASCADE,
    gps_coordinates JSONB, -- {latitude: number, longitude: number}
    deforestation_check VARCHAR(50) DEFAULT 'pending' CHECK (deforestation_check IN ('passed', 'failed', 'pending')),
    child_labor_check VARCHAR(50) DEFAULT 'pending' CHECK (child_labor_check IN ('passed', 'failed', 'pending')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('verified', 'rejected', 'pending')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Compliance Requirements
CREATE TABLE IF NOT EXISTS agrosoluce.compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_type VARCHAR(100) NOT NULL, -- 'eudr', 'child_labor', 'organic', etc.
    description TEXT NOT NULL,
    applicable_to VARCHAR(50) NOT NULL CHECK (applicable_to IN ('cooperative', 'farmer', 'product', 'batch')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_certifications_cooperative_id ON agrosoluce.certifications(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_certifications_farmer_id ON agrosoluce.certifications(farmer_id);
CREATE INDEX IF NOT EXISTS idx_certifications_type ON agrosoluce.certifications(certification_type);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON agrosoluce.certifications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_expiry_date ON agrosoluce.certifications(expiry_date);

CREATE INDEX IF NOT EXISTS idx_eudr_verifications_batch_id ON agrosoluce.eudr_verifications(batch_id);
CREATE INDEX IF NOT EXISTS idx_eudr_verifications_status ON agrosoluce.eudr_verifications(status);
CREATE INDEX IF NOT EXISTS idx_eudr_verifications_verified_at ON agrosoluce.eudr_verifications(verified_at);

CREATE INDEX IF NOT EXISTS idx_compliance_requirements_type ON agrosoluce.compliance_requirements(requirement_type);
CREATE INDEX IF NOT EXISTS idx_compliance_requirements_applicable_to ON agrosoluce.compliance_requirements(applicable_to);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on certifications table
ALTER TABLE agrosoluce.certifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view certifications from their cooperative
CREATE POLICY "Users can view certifications from their cooperative"
    ON agrosoluce.certifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = certifications.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = certifications.farmer_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Public can view active certifications
        status = 'active'
        OR
        -- Admins can view all
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert certifications
CREATE POLICY "Cooperative users can insert certifications"
    ON agrosoluce.certifications
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = certifications.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = certifications.farmer_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative users can update their certifications
CREATE POLICY "Cooperative users can update their certifications"
    ON agrosoluce.certifications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = certifications.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = certifications.farmer_id
            AND up.user_id = auth.uid()
        )
    );

-- Enable RLS on eudr_verifications table
ALTER TABLE agrosoluce.eudr_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view EUDR verifications for batches they have access to
CREATE POLICY "Users can view EUDR verifications"
    ON agrosoluce.eudr_verifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.cooperatives c ON b.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE b.id = eudr_verifications.batch_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Buyers can view verifications for products they're interested in
        EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.products p ON b.product_id = p.id
            JOIN agrosoluce.orders o ON o.cooperative_id = p.cooperative_id
            JOIN agrosoluce.user_profiles up ON o.buyer_id = up.id
            WHERE b.id = eudr_verifications.batch_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert EUDR verifications
CREATE POLICY "Cooperative users can insert EUDR verifications"
    ON agrosoluce.eudr_verifications
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.cooperatives c ON b.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE b.id = eudr_verifications.batch_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Admins can update EUDR verifications
CREATE POLICY "Admins can update EUDR verifications"
    ON agrosoluce.eudr_verifications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Enable RLS on compliance_requirements table (read-only for most users)
ALTER TABLE agrosoluce.compliance_requirements ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view compliance requirements
CREATE POLICY "Everyone can view compliance requirements"
    ON agrosoluce.compliance_requirements
    FOR SELECT
    USING (true);

-- Policy: Only admins can insert/update compliance requirements
CREATE POLICY "Admins can manage compliance requirements"
    ON agrosoluce.compliance_requirements
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.certifications IS 'Certifications for cooperatives and farmers (organic, fair trade, etc.)';
COMMENT ON TABLE agrosoluce.eudr_verifications IS 'EU Deforestation Regulation (EUDR) compliance verifications for batches';
COMMENT ON TABLE agrosoluce.compliance_requirements IS 'Regulatory compliance requirements and standards';
COMMENT ON COLUMN agrosoluce.eudr_verifications.deforestation_check IS 'Deforestation risk assessment result';
COMMENT ON COLUMN agrosoluce.eudr_verifications.child_labor_check IS 'Child labor due diligence result';


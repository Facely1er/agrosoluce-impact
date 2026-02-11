-- Migration: AgroSoluce v1 Scope Tables
-- Creates tables for buyer requests, matching, and compliance flags
-- Based on v1 scope requirements

-- =============================================
-- UPDATE COOPERATIVES TABLE FOR V1 SCOPE
-- =============================================

-- Add v1 scope fields to cooperatives table
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS commodity VARCHAR(100), -- e.g. cocoa, coffee
ADD COLUMN IF NOT EXISTS annual_volume_tons NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS compliance_flags JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS profile_source VARCHAR(100) DEFAULT 'directory_v1';

-- Add index for commodity filtering
CREATE INDEX IF NOT EXISTS idx_cooperatives_commodity ON agrosoluce.cooperatives(commodity);
CREATE INDEX IF NOT EXISTS idx_cooperatives_country ON agrosoluce.cooperatives(country);

-- =============================================
-- BUYER REQUESTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.ag_buyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_org VARCHAR(255) NOT NULL,
    buyer_contact_email VARCHAR(255) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    commodity VARCHAR(100) NOT NULL,
    min_volume_tons NUMERIC(10, 2),
    max_volume_tons NUMERIC(10, 2),
    requirements JSONB DEFAULT '{}'::jsonb, -- { certifications: [], eudrRequired: boolean, childLaborZeroTolerance: boolean }
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'matched', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for buyer requests
CREATE INDEX IF NOT EXISTS idx_buyer_requests_status ON agrosoluce.ag_buyer_requests(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_commodity ON agrosoluce.ag_buyer_requests(commodity);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_target_country ON agrosoluce.ag_buyer_requests(target_country);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_created_at ON agrosoluce.ag_buyer_requests(created_at);

-- =============================================
-- REQUEST MATCHES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.ag_request_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES agrosoluce.ag_buyer_requests(id) ON DELETE CASCADE,
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'suggested' CHECK (status IN ('suggested', 'shortlisted', 'contacted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, cooperative_id)
);

-- Indexes for request matches
CREATE INDEX IF NOT EXISTS idx_request_matches_request_id ON agrosoluce.ag_request_matches(request_id);
CREATE INDEX IF NOT EXISTS idx_request_matches_cooperative_id ON agrosoluce.ag_request_matches(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_request_matches_status ON agrosoluce.ag_request_matches(status);
CREATE INDEX IF NOT EXISTS idx_request_matches_score ON agrosoluce.ag_request_matches(match_score DESC);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on new tables
ALTER TABLE agrosoluce.ag_buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.ag_request_matches ENABLE ROW LEVEL SECURITY;

-- Buyer requests: anyone can view open/matched requests, buyers can manage their own
CREATE POLICY "Anyone can view open buyer requests" ON agrosoluce.ag_buyer_requests
    FOR SELECT USING (status IN ('open', 'matched'));

CREATE POLICY "Buyers can create requests" ON agrosoluce.ag_buyer_requests
    FOR INSERT WITH CHECK (true); -- Allow anonymous creation for v1

CREATE POLICY "Buyers can update their requests" ON agrosoluce.ag_buyer_requests
    FOR UPDATE USING (true); -- Allow updates for v1

-- Request matches: public read for open requests
CREATE POLICY "Anyone can view matches for open requests" ON agrosoluce.ag_request_matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.ag_buyer_requests
            WHERE id = ag_request_matches.request_id
            AND status IN ('open', 'matched')
        )
    );

CREATE POLICY "System can create matches" ON agrosoluce.ag_request_matches
    FOR INSERT WITH CHECK (true); -- Allow system to create matches

CREATE POLICY "System can update matches" ON agrosoluce.ag_request_matches
    FOR UPDATE USING (true); -- Allow updates for v1

-- =============================================
-- TRIGGERS
-- =============================================

-- Add updated_at trigger for buyer requests
CREATE TRIGGER update_buyer_requests_updated_at BEFORE UPDATE ON agrosoluce.ag_buyer_requests
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- Add updated_at trigger for request matches
CREATE TRIGGER update_request_matches_updated_at BEFORE UPDATE ON agrosoluce.ag_request_matches
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- =============================================
-- GRANTS
-- =============================================

-- Grant permissions to authenticated users
GRANT ALL ON agrosoluce.ag_buyer_requests TO authenticated;
GRANT ALL ON agrosoluce.ag_request_matches TO authenticated;

-- Grant read access to anon users for public data
GRANT SELECT ON agrosoluce.ag_buyer_requests TO anon;
GRANT SELECT ON agrosoluce.ag_request_matches TO anon;
GRANT INSERT ON agrosoluce.ag_buyer_requests TO anon;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.ag_buyer_requests IS 'Buyer sourcing requests for v1 scope - simple interest flow';
COMMENT ON TABLE agrosoluce.ag_request_matches IS 'Matching results between buyer requests and cooperatives';
COMMENT ON COLUMN agrosoluce.cooperatives.compliance_flags IS 'JSONB field for EUDR, child labor, and other compliance flags';
COMMENT ON COLUMN agrosoluce.cooperatives.commodity IS 'Primary commodity (cocoa, coffee, etc.)';
COMMENT ON COLUMN agrosoluce.ag_buyer_requests.requirements IS 'JSONB field for certifications, EUDR, child labor requirements';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('007_agrosoluce_v1_scope', 'AgroSoluce v1 scope tables: buyer requests, matching, compliance flags')
ON CONFLICT (migration_name) DO NOTHING;


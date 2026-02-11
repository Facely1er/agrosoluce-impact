-- Migration: Farmer Declarations
-- Creates farmer_declarations table for self-reported farmer declarations
-- All records are labeled as "Self-reported by farmer (unverified)"
--
-- Rules:
-- - No farmer name fields
-- - No verification flags
-- - All records must be labeled "Self-reported by farmer (unverified)"

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('016_farmer_declarations', 'Farmer Declarations: self-reported declarations with farmer_reference, no names, no verification flags')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- FARMER DECLARATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS agrosoluce.farmer_declarations (
    declaration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coop_id UUID NOT NULL REFERENCES agrosoluce.canonical_cooperative_directory(coop_id) ON DELETE CASCADE,
    farmer_reference VARCHAR(255) NOT NULL, -- Internal/non-public reference (e.g., "FARMER-001", not a name)
    declaration_type VARCHAR(100) NOT NULL, -- e.g., 'child_labor', 'land_use', 'organic_practices', etc.
    declared_value TEXT NOT NULL, -- The actual declaration value (can be boolean, text, JSON, etc.)
    declared_at TIMESTAMP WITH TIME ZONE NOT NULL, -- When the farmer made the declaration
    collected_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL, -- Coop user who collected this
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one declaration per farmer_reference per declaration_type per declared_at date
    CONSTRAINT unique_farmer_declaration UNIQUE (coop_id, farmer_reference, declaration_type, declared_at::DATE)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_id ON agrosoluce.farmer_declarations(coop_id);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_farmer_reference ON agrosoluce.farmer_declarations(farmer_reference);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_type ON agrosoluce.farmer_declarations(declaration_type);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_declared_at ON agrosoluce.farmer_declarations(declared_at DESC);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_collected_by ON agrosoluce.farmer_declarations(collected_by);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_created_at ON agrosoluce.farmer_declarations(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_type ON agrosoluce.farmer_declarations(coop_id, declaration_type);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_farmer ON agrosoluce.farmer_declarations(coop_id, farmer_reference);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on farmer_declarations table
ALTER TABLE agrosoluce.farmer_declarations ENABLE ROW LEVEL SECURITY;

-- Policy: Cooperative members can view declarations for their cooperative
CREATE POLICY "Cooperative members can view their farmer declarations" 
    ON agrosoluce.farmer_declarations
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd
            JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE ccd.coop_id = farmer_declarations.coop_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Allow if collected_by matches current user
        collected_by IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy: Cooperative members can insert declarations for their cooperative
CREATE POLICY "Cooperative members can create farmer declarations" 
    ON agrosoluce.farmer_declarations
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd
            JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE ccd.coop_id = farmer_declarations.coop_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Allow if collected_by matches current user
        collected_by IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Policy: Cooperative members can update declarations for their cooperative
CREATE POLICY "Cooperative members can update their farmer declarations" 
    ON agrosoluce.farmer_declarations
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd
            JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE ccd.coop_id = farmer_declarations.coop_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative members can delete declarations for their cooperative
CREATE POLICY "Cooperative members can delete their farmer declarations" 
    ON agrosoluce.farmer_declarations
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd
            JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE ccd.coop_id = farmer_declarations.coop_id
            AND up.user_id = auth.uid()
        )
    );

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.farmer_declarations IS 'Farmer declarations - Self-reported by farmer (unverified). No farmer names, no verification flags.';
COMMENT ON COLUMN agrosoluce.farmer_declarations.declaration_id IS 'Unique identifier for the declaration record';
COMMENT ON COLUMN agrosoluce.farmer_declarations.coop_id IS 'Reference to the cooperative (canonical_cooperative_directory)';
COMMENT ON COLUMN agrosoluce.farmer_declarations.farmer_reference IS 'Internal/non-public reference identifier for the farmer (e.g., "FARMER-001"). NOT a name.';
COMMENT ON COLUMN agrosoluce.farmer_declarations.declaration_type IS 'Type of declaration (e.g., child_labor, land_use, organic_practices)';
COMMENT ON COLUMN agrosoluce.farmer_declarations.declared_value IS 'The actual declaration value (can be boolean, text, JSON, etc.)';
COMMENT ON COLUMN agrosoluce.farmer_declarations.declared_at IS 'When the farmer made the declaration';
COMMENT ON COLUMN agrosoluce.farmer_declarations.collected_by IS 'Cooperative user who collected this declaration';
COMMENT ON COLUMN agrosoluce.farmer_declarations.created_at IS 'When this record was created in the system';

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.farmer_declarations TO authenticated;
GRANT SELECT ON agrosoluce.farmer_declarations TO anon; -- Read-only for anonymous users if needed

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('016_farmer_declarations', 'Farmer Declarations: self-reported declarations with farmer_reference, no names, no verification flags')
ON CONFLICT (migration_name) DO NOTHING;


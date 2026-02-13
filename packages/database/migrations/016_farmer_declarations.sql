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
-- FARMER DECLARATIONS TABLE (016 schema)
-- Skip table/index/policy creation when table already exists from 010 (has farmer_id).
-- =============================================

DO $$
BEGIN
  -- If farmer_declarations already exists from migration 010 (has farmer_id), just record migration and skip.
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'agrosoluce' AND table_name = 'farmer_declarations' AND column_name = 'farmer_id') THEN
    RETURN;
  END IF;

  -- Table does not exist or has 016 schema (coop_id); create only when table does not exist.
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'agrosoluce' AND table_name = 'farmer_declarations') THEN
    CREATE TABLE agrosoluce.farmer_declarations (
        declaration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        coop_id UUID NOT NULL REFERENCES agrosoluce.canonical_cooperative_directory(coop_id) ON DELETE CASCADE,
        farmer_reference VARCHAR(255) NOT NULL,
        declaration_type VARCHAR(100) NOT NULL,
        declared_value TEXT NOT NULL,
        declared_at TIMESTAMP WITH TIME ZONE NOT NULL,
        collected_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_farmer_declaration UNIQUE (coop_id, farmer_reference, declaration_type, declared_at)
    );
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_id ON agrosoluce.farmer_declarations(coop_id);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_farmer_reference ON agrosoluce.farmer_declarations(farmer_reference);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_type ON agrosoluce.farmer_declarations(declaration_type);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_declared_at ON agrosoluce.farmer_declarations(declared_at DESC);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_collected_by ON agrosoluce.farmer_declarations(collected_by);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_created_at ON agrosoluce.farmer_declarations(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_type ON agrosoluce.farmer_declarations(coop_id, declaration_type);
    CREATE INDEX IF NOT EXISTS idx_farmer_declarations_coop_farmer ON agrosoluce.farmer_declarations(coop_id, farmer_reference);
    ALTER TABLE agrosoluce.farmer_declarations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Cooperative members can view their farmer declarations" ON agrosoluce.farmer_declarations FOR SELECT USING (
        EXISTS (SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id WHERE ccd.coop_id = farmer_declarations.coop_id AND up.user_id = auth.uid())
        OR collected_by IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
    );
    CREATE POLICY "Cooperative members can create farmer declarations" ON agrosoluce.farmer_declarations FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id WHERE ccd.coop_id = farmer_declarations.coop_id AND up.user_id = auth.uid())
        OR collected_by IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
    );
    CREATE POLICY "Cooperative members can update their farmer declarations" ON agrosoluce.farmer_declarations FOR UPDATE USING (
        EXISTS (SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id WHERE ccd.coop_id = farmer_declarations.coop_id AND up.user_id = auth.uid())
    );
    CREATE POLICY "Cooperative members can delete their farmer declarations" ON agrosoluce.farmer_declarations FOR DELETE USING (
        EXISTS (SELECT 1 FROM agrosoluce.canonical_cooperative_directory ccd JOIN agrosoluce.cooperatives c ON c.id = ccd.coop_id JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id WHERE ccd.coop_id = farmer_declarations.coop_id AND up.user_id = auth.uid())
    );
    GRANT ALL ON agrosoluce.farmer_declarations TO authenticated;
    GRANT SELECT ON agrosoluce.farmer_declarations TO anon;
  END IF;
END $$;


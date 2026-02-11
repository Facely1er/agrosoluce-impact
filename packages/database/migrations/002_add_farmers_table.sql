-- Migration: Add Farmers Table
-- This migration creates the farmers table for the Producer Registry module
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('002_add_farmers_table', 'Add farmers table for Producer Registry module')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- PRODUCER REGISTRY TABLES
-- =============================================

-- Farmers (individual producers)
CREATE TABLE IF NOT EXISTS agrosoluce.farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_description TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_farmers_cooperative_id ON agrosoluce.farmers(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_farmers_registration_number ON agrosoluce.farmers(registration_number);
CREATE INDEX IF NOT EXISTS idx_farmers_location ON agrosoluce.farmers USING GIST (point(longitude, latitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Add farmer count to cooperatives (computed via view or function)
-- This will be calculated dynamically, but we can add a trigger to update a cached count if needed

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on farmers table
ALTER TABLE agrosoluce.farmers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view farmers from their cooperative
CREATE POLICY "Users can view farmers from their cooperative"
    ON agrosoluce.farmers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = farmers.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Admins can view all
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert farmers
CREATE POLICY "Cooperative users can insert farmers"
    ON agrosoluce.farmers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = farmers.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative users can update their farmers
CREATE POLICY "Cooperative users can update their farmers"
    ON agrosoluce.farmers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = farmers.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative users can delete their farmers
CREATE POLICY "Cooperative users can delete their farmers"
    ON agrosoluce.farmers
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = farmers.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.farmers IS 'Individual farmers/producers registered with cooperatives';
COMMENT ON COLUMN agrosoluce.farmers.cooperative_id IS 'Reference to the cooperative this farmer belongs to';
COMMENT ON COLUMN agrosoluce.farmers.registration_number IS 'Unique registration number for the farmer';
COMMENT ON COLUMN agrosoluce.farmers.latitude IS 'GPS latitude coordinate for farmer location';
COMMENT ON COLUMN agrosoluce.farmers.longitude IS 'GPS longitude coordinate for farmer location';


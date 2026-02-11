-- Migration: Add Traceability Tables
-- This migration creates tables for supply chain traceability (batch tracking)
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('003_add_traceability_tables', 'Add traceability tables for batch tracking and origin verification')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- TRACEABILITY TABLES
-- =============================================

-- Batches (product batches with origin tracking)
CREATE TABLE IF NOT EXISTS agrosoluce.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES agrosoluce.products(id) ON DELETE CASCADE,
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES agrosoluce.farmers(id) ON DELETE SET NULL,
    harvest_date DATE,
    origin_gps_latitude DECIMAL(10, 8),
    origin_gps_longitude DECIMAL(11, 8),
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'kg',
    batch_number VARCHAR(100) UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Batch Transactions (traceability chain)
CREATE TABLE IF NOT EXISTS agrosoluce.batch_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES agrosoluce.batches(id) ON DELETE CASCADE,
    from_entity_type VARCHAR(50) NOT NULL CHECK (from_entity_type IN ('farmer', 'cooperative', 'buyer')),
    from_entity_id UUID NOT NULL,
    to_entity_type VARCHAR(50) NOT NULL CHECK (to_entity_type IN ('farmer', 'cooperative', 'buyer')),
    to_entity_id UUID NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('harvest', 'transfer', 'sale', 'processing')),
    quantity DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_batches_product_id ON agrosoluce.batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_cooperative_id ON agrosoluce.batches(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_batches_farmer_id ON agrosoluce.batches(farmer_id);
CREATE INDEX IF NOT EXISTS idx_batches_batch_number ON agrosoluce.batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_batches_harvest_date ON agrosoluce.batches(harvest_date);
CREATE INDEX IF NOT EXISTS idx_batches_location ON agrosoluce.batches USING GIST (point(origin_gps_longitude, origin_gps_latitude)) WHERE origin_gps_latitude IS NOT NULL AND origin_gps_longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_batch_transactions_batch_id ON agrosoluce.batch_transactions(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_timestamp ON agrosoluce.batch_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_from_entity ON agrosoluce.batch_transactions(from_entity_type, from_entity_id);
CREATE INDEX IF NOT EXISTS idx_batch_transactions_to_entity ON agrosoluce.batch_transactions(to_entity_type, to_entity_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on batches table
ALTER TABLE agrosoluce.batches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view batches from their cooperative
CREATE POLICY "Users can view batches from their cooperative"
    ON agrosoluce.batches
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = batches.cooperative_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Buyers can view batches for products they're interested in
        EXISTS (
            SELECT 1 FROM agrosoluce.products p
            JOIN agrosoluce.orders o ON o.cooperative_id = p.cooperative_id
            JOIN agrosoluce.user_profiles up ON o.buyer_id = up.id
            WHERE p.id = batches.product_id
            AND up.user_id = auth.uid()
        )
        OR
        -- Admins can view all
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert batches
CREATE POLICY "Cooperative users can insert batches"
    ON agrosoluce.batches
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = batches.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Policy: Cooperative users can update their batches
CREATE POLICY "Cooperative users can update their batches"
    ON agrosoluce.batches
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE c.id = batches.cooperative_id
            AND up.user_id = auth.uid()
        )
    );

-- Enable RLS on batch_transactions table
ALTER TABLE agrosoluce.batch_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view transactions for batches they have access to
CREATE POLICY "Users can view batch transactions"
    ON agrosoluce.batch_transactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.cooperatives c ON b.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE b.id = batch_transactions.batch_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Policy: Cooperative users can insert batch transactions
CREATE POLICY "Cooperative users can insert batch transactions"
    ON agrosoluce.batch_transactions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.batches b
            JOIN agrosoluce.cooperatives c ON b.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE b.id = batch_transactions.batch_id
            AND up.user_id = auth.uid()
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.batches IS 'Product batches with origin tracking for traceability';
COMMENT ON COLUMN agrosoluce.batches.farmer_id IS 'Reference to the farmer who produced this batch';
COMMENT ON COLUMN agrosoluce.batches.origin_gps_latitude IS 'GPS latitude of the origin/harvest location';
COMMENT ON COLUMN agrosoluce.batches.origin_gps_longitude IS 'GPS longitude of the origin/harvest location';
COMMENT ON TABLE agrosoluce.batch_transactions IS 'Transaction history for batches (traceability chain)';
COMMENT ON COLUMN agrosoluce.batch_transactions.transaction_type IS 'Type of transaction: harvest, transfer, sale, processing';


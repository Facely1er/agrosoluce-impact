-- =============================================
-- AgroSoluce Database Migrations - Combined File
-- =============================================
-- This file contains all migrations in order.
-- Execute this file in Supabase SQL Editor.
-- 
-- Generated: 2025-12-06T03:31:12.508Z
-- =============================================

-- =============================================
-- Migration: 001_initial_schema_setup.sql
-- =============================================

-- Migration: Initial Agrosoluce Schema Setup
-- This migration creates the initial database schema for the Agrosoluce marketplace
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- SCHEMA CREATION
-- =============================================

-- Create the agrosoluce schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS agrosoluce;

-- Grant necessary permissions on the schema
GRANT USAGE ON SCHEMA agrosoluce TO authenticated;
GRANT USAGE ON SCHEMA agrosoluce TO anon;

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS agrosoluce.migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checksum VARCHAR(64),
    description TEXT
);

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('001_initial_schema_setup', 'Initial Agrosoluce marketplace schema setup')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- USER MANAGEMENT TABLES
-- =============================================

-- User profiles (for both buyers and cooperatives)
CREATE TABLE IF NOT EXISTS agrosoluce.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('buyer', 'cooperative', 'admin')),
    organization_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- COOPERATIVE TABLES
-- =============================================

-- Cooperatives (from the JSON data, will be migrated)
CREATE TABLE IF NOT EXISTS agrosoluce.cooperatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    department VARCHAR(100),
    commune VARCHAR(100),
    sector VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    products TEXT[],
    certifications TEXT[],
    is_verified BOOLEAN DEFAULT false,
    user_profile_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- PRODUCT TABLES
-- =============================================

-- Product categories
CREATE TABLE IF NOT EXISTS agrosoluce.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES agrosoluce.product_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS agrosoluce.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    category_id UUID REFERENCES agrosoluce.product_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'XOF',
    unit VARCHAR(50), -- kg, ton, bag, etc.
    quantity_available DECIMAL(10, 2),
    harvest_date DATE,
    organic BOOLEAN DEFAULT false,
    certifications TEXT[],
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- TRANSACTION TABLES
-- =============================================

-- Orders
CREATE TABLE IF NOT EXISTS agrosoluce.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    shipping_address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Order items
CREATE TABLE IF NOT EXISTS agrosoluce.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES agrosoluce.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES agrosoluce.products(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MESSAGING TABLES
-- =============================================

-- Messages (for buyer-cooperative communication)
CREATE TABLE IF NOT EXISTS agrosoluce.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES agrosoluce.orders(id) ON DELETE SET NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON agrosoluce.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON agrosoluce.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON agrosoluce.user_profiles(user_type);

-- Cooperative indexes
CREATE INDEX IF NOT EXISTS idx_cooperatives_region ON agrosoluce.cooperatives(region);
CREATE INDEX IF NOT EXISTS idx_cooperatives_department ON agrosoluce.cooperatives(department);
CREATE INDEX IF NOT EXISTS idx_cooperatives_sector ON agrosoluce.cooperatives(sector);
CREATE INDEX IF NOT EXISTS idx_cooperatives_is_verified ON agrosoluce.cooperatives(is_verified);
CREATE INDEX IF NOT EXISTS idx_cooperatives_location ON agrosoluce.cooperatives(latitude, longitude);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_cooperative_id ON agrosoluce.products(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON agrosoluce.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON agrosoluce.products(is_active);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON agrosoluce.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_cooperative_id ON agrosoluce.orders(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON agrosoluce.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON agrosoluce.orders(created_at);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON agrosoluce.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON agrosoluce.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON agrosoluce.messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON agrosoluce.messages(is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agrosoluce.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.messages ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON agrosoluce.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON agrosoluce.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON agrosoluce.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cooperatives policies (public read, cooperative owners can update)
CREATE POLICY "Anyone can view cooperatives" ON agrosoluce.cooperatives
    FOR SELECT USING (true);

CREATE POLICY "Cooperative owners can update their cooperative" ON agrosoluce.cooperatives
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE id = cooperatives.user_profile_id AND user_id = auth.uid()
        )
    );

-- Products policies (public read, cooperative owners can manage)
CREATE POLICY "Anyone can view active products" ON agrosoluce.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Cooperative owners can manage their products" ON agrosoluce.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.cooperatives
            WHERE id = products.cooperative_id 
            AND user_profile_id IN (
                SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
            )
        )
    );

-- Orders policies (buyers and cooperative owners can view their orders)
CREATE POLICY "Users can view their orders" ON agrosoluce.orders
    FOR SELECT USING (
        buyer_id IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
        OR cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Buyers can create orders" ON agrosoluce.orders
    FOR INSERT WITH CHECK (
        buyer_id IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
    );

-- Messages policies (users can view their messages)
CREATE POLICY "Users can view their messages" ON agrosoluce.messages
    FOR SELECT USING (
        sender_id IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
        OR receiver_id IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can send messages" ON agrosoluce.messages
    FOR INSERT WITH CHECK (
        sender_id IN (SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid())
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION agrosoluce.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON agrosoluce.user_profiles
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_cooperatives_updated_at BEFORE UPDATE ON agrosoluce.cooperatives
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON agrosoluce.products
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON agrosoluce.orders
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Insert default product categories
INSERT INTO agrosoluce.product_categories (name, description) VALUES
('Coffee', 'Coffee beans and products'),
('Cocoa', 'Cocoa beans and chocolate products'),
('Cashew', 'Cashew nuts and products'),
('Palm Oil', 'Palm oil and derivatives'),
('Rubber', 'Natural rubber and products'),
('Cotton', 'Cotton and textile products'),
('Fruits', 'Fresh and processed fruits'),
('Vegetables', 'Fresh and processed vegetables'),
('Grains', 'Rice, maize, and other grains'),
('Livestock', 'Cattle, poultry, and other livestock products')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON SCHEMA agrosoluce IS 'Agrosoluce Marketplace - Agricultural marketplace platform for West African cooperatives';
COMMENT ON TABLE agrosoluce.cooperatives IS 'Cooperative organizations and their information';
COMMENT ON TABLE agrosoluce.products IS 'Products listed by cooperatives';
COMMENT ON TABLE agrosoluce.orders IS 'Orders placed by buyers';
COMMENT ON TABLE agrosoluce.messages IS 'Messages between buyers and cooperatives';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA agrosoluce TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA agrosoluce TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA agrosoluce TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA agrosoluce TO authenticated;

-- Grant read access to anon users for public data
GRANT USAGE ON SCHEMA agrosoluce TO anon;
GRANT SELECT ON agrosoluce.cooperatives TO anon;
GRANT SELECT ON agrosoluce.products TO anon;
GRANT SELECT ON agrosoluce.product_categories TO anon;

-- =============================================
-- MIGRATION COMPLETION
-- =============================================

-- Log successful completion
INSERT INTO agrosoluce.migrations (migration_name, description, executed_at) 
VALUES ('001_initial_schema_setup_completed', 'Initial Agrosoluce schema setup completed successfully', NOW())
ON CONFLICT (migration_name) DO NOTHING;



-- =============================================
-- Migration: 002_add_farmers_table.sql
-- =============================================

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



-- =============================================
-- Migration: 003_add_traceability_tables.sql
-- =============================================

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



-- =============================================
-- Migration: 004_add_compliance_tables.sql
-- =============================================

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



-- =============================================
-- Migration: 005_add_evidence_tables.sql
-- =============================================

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



-- =============================================
-- Migration: 006_add_logistics_tables.sql
-- =============================================

-- Migration: Add Logistics Tables
-- This migration creates tables for logistics coordination (shipping, tracking, etc.)
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('006_add_logistics_tables', 'Add logistics tables for shipping and tracking')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- LOGISTICS TABLES
-- =============================================

-- Shipping Records
CREATE TABLE IF NOT EXISTS agrosoluce.shipping_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES agrosoluce.orders(id) ON DELETE CASCADE,
    carrier VARCHAR(255), -- DHL, Maersk, etc.
    tracking_number VARCHAR(255),
    shipping_address TEXT NOT NULL,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'delayed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Shipping Tracking Events
CREATE TABLE IF NOT EXISTS agrosoluce.shipping_tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_record_id UUID REFERENCES agrosoluce.shipping_records(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'picked_up', 'in_transit', 'arrived', 'delivered', etc.
    location VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shipping_records_order_id ON agrosoluce.shipping_records(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_records_tracking_number ON agrosoluce.shipping_records(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipping_records_status ON agrosoluce.shipping_records(status);

CREATE INDEX IF NOT EXISTS idx_shipping_tracking_events_shipping_record_id ON agrosoluce.shipping_tracking_events(shipping_record_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_events_timestamp ON agrosoluce.shipping_tracking_events(timestamp);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on shipping_records table
ALTER TABLE agrosoluce.shipping_records ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view shipping records for their orders
CREATE POLICY "Users can view shipping records for their orders"
    ON agrosoluce.shipping_records
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.orders o
            JOIN agrosoluce.user_profiles up ON o.buyer_id = up.id
            WHERE o.id = shipping_records.order_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.orders o
            JOIN agrosoluce.cooperatives c ON o.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE o.id = shipping_records.order_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Enable RLS on shipping_tracking_events table
ALTER TABLE agrosoluce.shipping_tracking_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tracking events for shipping records they have access to
CREATE POLICY "Users can view tracking events"
    ON agrosoluce.shipping_tracking_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.shipping_records sr
            JOIN agrosoluce.orders o ON sr.order_id = o.id
            JOIN agrosoluce.user_profiles up ON o.buyer_id = up.id
            WHERE sr.id = shipping_tracking_events.shipping_record_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.shipping_records sr
            JOIN agrosoluce.orders o ON sr.order_id = o.id
            JOIN agrosoluce.cooperatives c ON o.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE sr.id = shipping_tracking_events.shipping_record_id
            AND up.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.shipping_records IS 'Shipping records for orders';
COMMENT ON TABLE agrosoluce.shipping_tracking_events IS 'Tracking events for shipping records';



-- =============================================
-- Migration: 007_agrosoluce_v1_scope.sql
-- =============================================

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



-- =============================================
-- Migration: 008_farmers_first_toolkit.sql
-- =============================================

-- Migration: Farmers First Implementation Toolkit
-- Creates tables for onboarding, training, feedback, and value tracking
-- Based on AgroSoluce Farmers First Implementation Toolkit

-- =============================================
-- ONBOARDING TABLES
-- =============================================

-- Cooperative onboarding tracking
CREATE TABLE IF NOT EXISTS agrosoluce.cooperative_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
    current_step INTEGER DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    welcome_call_scheduled_at TIMESTAMP WITH TIME ZONE,
    welcome_call_completed_at TIMESTAMP WITH TIME ZONE,
    onboarding_champion_id UUID, -- References user_profiles
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding steps checklist
CREATE TABLE IF NOT EXISTS agrosoluce.onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    onboarding_id UUID NOT NULL REFERENCES agrosoluce.cooperative_onboarding(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name VARCHAR(255) NOT NULL,
    step_description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES agrosoluce.user_profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRAINING TABLES
-- =============================================

-- Training sessions
CREATE TABLE IF NOT EXISTS agrosoluce.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    session_type VARCHAR(100) NOT NULL, -- 'welcome', 'module_1', 'module_2', etc.
    session_title VARCHAR(255) NOT NULL,
    session_description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    trainer_id UUID REFERENCES agrosoluce.user_profiles(id),
    location VARCHAR(255), -- 'virtual', 'on_site', 'hybrid'
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    attendance_count INTEGER DEFAULT 0,
    materials_url TEXT,
    recording_url TEXT,
    feedback_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training champions
CREATE TABLE IF NOT EXISTS agrosoluce.training_champions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(100), -- 'primary', 'secondary', 'backup'
    training_completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    responsibilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, user_profile_id)
);

-- Training module completions
CREATE TABLE IF NOT EXISTS agrosoluce.training_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_session_id UUID NOT NULL REFERENCES agrosoluce.training_sessions(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER, -- 0-100 if applicable
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FEEDBACK AND SURVEYS TABLES
-- =============================================

-- Satisfaction surveys (monthly)
CREATE TABLE IF NOT EXISTS agrosoluce.satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    survey_month DATE NOT NULL, -- First day of the month
    submitted_by UUID REFERENCES agrosoluce.user_profiles(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Standard questions (1-5 scale)
    platform_meets_needs INTEGER CHECK (platform_meets_needs >= 1 AND platform_meets_needs <= 5),
    technical_support_sufficient INTEGER CHECK (technical_support_sufficient >= 1 AND technical_support_sufficient <= 5),
    training_appropriate INTEGER CHECK (training_appropriate >= 1 AND training_appropriate <= 5),
    would_recommend INTEGER CHECK (would_recommend >= 1 AND would_recommend <= 5),
    satisfied_with_improvements INTEGER CHECK (satisfied_with_improvements >= 1 AND satisfied_with_improvements <= 5),
    
    -- Qualitative questions
    most_helpful_feature TEXT,
    most_missing_feature TEXT,
    how_can_we_serve_better TEXT,
    challenges_encountered TEXT,
    suggestions TEXT,
    
    -- Impact questions
    hours_saved_per_week NUMERIC(5, 2),
    price_improvement_percentage NUMERIC(5, 2),
    problems_avoided TEXT,
    unexpected_benefits TEXT,
    other_cooperatives_recommended TEXT,
    
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, survey_month)
);

-- General feedback submissions
CREATE TABLE IF NOT EXISTS agrosoluce.feedback_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID REFERENCES agrosoluce.cooperatives(id) ON DELETE SET NULL,
    user_profile_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    feedback_type VARCHAR(100), -- 'bug', 'feature_request', 'complaint', 'compliment', 'suggestion'
    subject VARCHAR(255),
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES agrosoluce.user_profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VALUE TRACKING TABLES
-- =============================================

-- Baseline measurements (before AgroSoluce)
CREATE TABLE IF NOT EXISTS agrosoluce.baseline_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    measured_by UUID REFERENCES agrosoluce.user_profiles(id),
    
    -- Administrative time (hours/week)
    hours_member_management NUMERIC(5, 2),
    hours_meeting_organization NUMERIC(5, 2),
    hours_report_preparation NUMERIC(5, 2),
    hours_certification_tracking NUMERIC(5, 2),
    hours_member_communication NUMERIC(5, 2),
    hours_document_management NUMERIC(5, 2),
    total_admin_hours_per_week NUMERIC(5, 2),
    
    -- Commercial efficiency
    avg_days_to_negotiate_price NUMERIC(5, 2),
    percentage_sales_at_optimal_price NUMERIC(5, 2),
    market_price_access_frequency_per_week NUMERIC(5, 2),
    export_document_prep_days NUMERIC(5, 2),
    
    -- Compliance and certifications
    missed_deadlines_12_months INTEGER,
    audit_preparation_days INTEGER,
    lost_misplaced_documents INTEGER,
    delayed_submissions INTEGER,
    
    -- Security and risks
    security_incidents_12_months INTEGER,
    data_loss_incidents INTEGER,
    internal_communication_problems_per_month INTEGER,
    financial_record_errors INTEGER,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id)
);

-- Monthly progress tracking
CREATE TABLE IF NOT EXISTS agrosoluce.monthly_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    progress_month DATE NOT NULL, -- First day of the month
    submitted_by UUID REFERENCES agrosoluce.user_profiles(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Administrative time savings
    current_admin_hours_per_week NUMERIC(5, 2),
    baseline_admin_hours_per_week NUMERIC(5, 2),
    hours_reduction NUMERIC(5, 2),
    percentage_reduction NUMERIC(5, 2),
    automated_tasks_count INTEGER,
    simplified_processes_count INTEGER,
    
    -- Commercial improvement
    avg_price_improvement_percentage NUMERIC(5, 2),
    baseline_avg_price NUMERIC(10, 2),
    current_avg_price NUMERIC(10, 2),
    negotiation_time_reduction_days NUMERIC(5, 2),
    new_opportunities_identified INTEGER,
    premium_buyers_contacted INTEGER,
    
    -- Compliance and certification
    deadlines_met INTEGER,
    total_deadlines INTEGER,
    audit_prep_time_reduction_days INTEGER,
    documents_organized_automatically_percentage NUMERIC(5, 2),
    auto_generated_reports INTEGER,
    
    -- Security and reliability
    security_incidents_prevented INTEGER,
    successful_auto_backups INTEGER,
    internal_communication_improvement_percentage NUMERIC(5, 2),
    data_error_reduction_percentage NUMERIC(5, 2),
    
    -- Member satisfaction
    member_satisfaction_score INTEGER CHECK (member_satisfaction_score >= 1 AND member_satisfaction_score <= 10),
    active_platform_users_percentage NUMERIC(5, 2),
    improvement_suggestions_received INTEGER,
    problems_reported INTEGER,
    
    -- Corrective actions needed
    additional_training_required BOOLEAN DEFAULT false,
    missing_features_identified TEXT,
    technical_support_needed BOOLEAN DEFAULT false,
    configuration_adjustments TEXT,
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, progress_month)
);

-- Value metrics (calculated/aggregated)
CREATE TABLE IF NOT EXISTS agrosoluce.value_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    metric_month DATE NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Efficiency metrics
    admin_time_saved_hours NUMERIC(10, 2),
    admin_cost_saved_usd NUMERIC(10, 2),
    deadline_compliance_percentage NUMERIC(5, 2),
    error_reduction_percentage NUMERIC(5, 2),
    
    -- Economic impact
    price_improvement_usd NUMERIC(10, 2),
    new_revenue_opportunities_usd NUMERIC(10, 2),
    total_economic_impact_usd NUMERIC(10, 2),
    
    -- Capacity building
    digital_literacy_improvement_score NUMERIC(5, 2),
    autonomy_increase_percentage NUMERIC(5, 2),
    
    -- Security
    security_incidents_avoided INTEGER,
    data_integrity_score NUMERIC(5, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, metric_month)
);

-- =============================================
-- INDEXES
-- =============================================

-- Onboarding indexes
CREATE INDEX IF NOT EXISTS idx_cooperative_onboarding_cooperative_id ON agrosoluce.cooperative_onboarding(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_onboarding_status ON agrosoluce.cooperative_onboarding(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_onboarding_id ON agrosoluce.onboarding_steps(onboarding_id);

-- Training indexes
CREATE INDEX IF NOT EXISTS idx_training_sessions_cooperative_id ON agrosoluce.training_sessions(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON agrosoluce.training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_champions_cooperative_id ON agrosoluce.training_champions(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_training_completions_session_id ON agrosoluce.training_completions(training_session_id);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_satisfaction_surveys_cooperative_id ON agrosoluce.satisfaction_surveys(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_satisfaction_surveys_month ON agrosoluce.satisfaction_surveys(survey_month);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_cooperative_id ON agrosoluce.feedback_submissions(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submissions_status ON agrosoluce.feedback_submissions(status);

-- Value tracking indexes
CREATE INDEX IF NOT EXISTS idx_baseline_measurements_cooperative_id ON agrosoluce.baseline_measurements(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_monthly_progress_cooperative_id ON agrosoluce.monthly_progress(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_monthly_progress_month ON agrosoluce.monthly_progress(progress_month);
CREATE INDEX IF NOT EXISTS idx_value_metrics_cooperative_id ON agrosoluce.value_metrics(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_value_metrics_month ON agrosoluce.value_metrics(metric_month);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agrosoluce.cooperative_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.training_champions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.baseline_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.monthly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.value_metrics ENABLE ROW LEVEL SECURITY;

-- Onboarding policies
CREATE POLICY "Cooperative members can view their onboarding" ON agrosoluce.cooperative_onboarding
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Cooperative members can update their onboarding" ON agrosoluce.cooperative_onboarding
    FOR UPDATE USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- Training policies
CREATE POLICY "Cooperative members can view their training" ON agrosoluce.training_sessions
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- Feedback policies
CREATE POLICY "Cooperative members can submit surveys" ON agrosoluce.satisfaction_surveys
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Cooperative members can view their surveys" ON agrosoluce.satisfaction_surveys
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can submit feedback" ON agrosoluce.feedback_submissions
    FOR INSERT WITH CHECK (true);

-- Value tracking policies
CREATE POLICY "Cooperative members can view their baseline" ON agrosoluce.baseline_measurements
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

CREATE POLICY "Cooperative members can submit progress" ON agrosoluce.monthly_progress
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Cooperative members can view their progress" ON agrosoluce.monthly_progress
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- =============================================
-- TRIGGERS
-- =============================================

-- Add updated_at triggers
CREATE TRIGGER update_cooperative_onboarding_updated_at BEFORE UPDATE ON agrosoluce.cooperative_onboarding
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON agrosoluce.training_sessions
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_training_champions_updated_at BEFORE UPDATE ON agrosoluce.training_champions
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_satisfaction_surveys_updated_at BEFORE UPDATE ON agrosoluce.satisfaction_surveys
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_feedback_submissions_updated_at BEFORE UPDATE ON agrosoluce.feedback_submissions
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_monthly_progress_updated_at BEFORE UPDATE ON agrosoluce.monthly_progress
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- =============================================
-- GRANTS
-- =============================================

-- Grant permissions to authenticated users
GRANT ALL ON agrosoluce.cooperative_onboarding TO authenticated;
GRANT ALL ON agrosoluce.onboarding_steps TO authenticated;
GRANT ALL ON agrosoluce.training_sessions TO authenticated;
GRANT ALL ON agrosoluce.training_champions TO authenticated;
GRANT ALL ON agrosoluce.training_completions TO authenticated;
GRANT ALL ON agrosoluce.satisfaction_surveys TO authenticated;
GRANT ALL ON agrosoluce.feedback_submissions TO authenticated;
GRANT ALL ON agrosoluce.baseline_measurements TO authenticated;
GRANT ALL ON agrosoluce.monthly_progress TO authenticated;
GRANT ALL ON agrosoluce.value_metrics TO authenticated;

-- Grant read access to anon users for public data
GRANT SELECT ON agrosoluce.cooperative_onboarding TO anon;
GRANT SELECT ON agrosoluce.training_sessions TO anon;
GRANT INSERT ON agrosoluce.satisfaction_surveys TO anon;
GRANT INSERT ON agrosoluce.feedback_submissions TO anon;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.cooperative_onboarding IS 'Tracks onboarding progress for cooperatives in Farmers First program';
COMMENT ON TABLE agrosoluce.training_sessions IS 'Training sessions for cooperative members';
COMMENT ON TABLE agrosoluce.training_champions IS 'Training champions designated by each cooperative';
COMMENT ON TABLE agrosoluce.satisfaction_surveys IS 'Monthly satisfaction surveys from cooperatives';
COMMENT ON TABLE agrosoluce.baseline_measurements IS 'Baseline measurements before AgroSoluce implementation';
COMMENT ON TABLE agrosoluce.monthly_progress IS 'Monthly progress tracking for value delivery';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('008_farmers_first_toolkit', 'Farmers First Implementation Toolkit: onboarding, training, feedback, and value tracking')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- Migration: 009_dataset_enrichment_guide.sql
-- =============================================

-- Migration: Dataset Enrichment Guide
-- This migration demonstrates various strategies for enriching the AgroSoluce dataset
-- Includes: additional fields, computed columns, seed data, and enrichment views

-- =============================================
-- STRATEGY 1: ADD ENRICHMENT FIELDS TO EXISTING TABLES
-- =============================================

-- Enrich cooperatives table with additional business intelligence fields
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS member_count INTEGER,
ADD COLUMN IF NOT EXISTS established_year INTEGER,
ADD COLUMN IF NOT EXISTS legal_structure VARCHAR(100), -- 'cooperative', 'association', 'union', etc.
ADD COLUMN IF NOT EXISTS primary_language VARCHAR(50),
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb, -- {facebook: url, twitter: url, etc.}
ADD COLUMN IF NOT EXISTS financial_health_score NUMERIC(3, 1) CHECK (financial_health_score >= 0 AND financial_health_score <= 10),
ADD COLUMN IF NOT EXISTS sustainability_score NUMERIC(3, 1) CHECK (sustainability_score >= 0 AND sustainability_score <= 10),
ADD COLUMN IF NOT EXISTS market_reputation_score NUMERIC(3, 1) CHECK (market_reputation_score >= 0 AND market_reputation_score <= 10),
ADD COLUMN IF NOT EXISTS export_experience_years INTEGER,
ADD COLUMN IF NOT EXISTS previous_buyers_count INTEGER,
ADD COLUMN IF NOT EXISTS quality_control_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS processing_capacity_tons_per_year NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS storage_capacity_tons NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS transportation_access VARCHAR(100), -- 'excellent', 'good', 'limited'
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_source VARCHAR(255), -- Who verified this data
ADD COLUMN IF NOT EXISTS data_quality_score NUMERIC(3, 1) CHECK (data_quality_score >= 0 AND data_quality_score <= 10);

-- Enrich farmers table with additional producer information
ALTER TABLE agrosoluce.farmers
ADD COLUMN IF NOT EXISTS farm_size_hectares NUMERIC(8, 2),
ADD COLUMN IF NOT EXISTS primary_crop VARCHAR(100),
ADD COLUMN IF NOT EXISTS secondary_crops TEXT[],
ADD COLUMN IF NOT EXISTS farming_experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education_level VARCHAR(50), -- 'none', 'primary', 'secondary', 'tertiary'
ADD COLUMN IF NOT EXISTS household_size INTEGER,
ADD COLUMN IF NOT EXISTS annual_income_usd NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS access_to_credit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS irrigation_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS organic_practices BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_harvest_date DATE,
ADD COLUMN IF NOT EXISTS expected_next_harvest_date DATE,
ADD COLUMN IF NOT EXISTS yield_per_hectare NUMERIC(8, 2);

-- =============================================
-- STRATEGY 2: CREATE ENRICHMENT LOOKUP TABLES
-- =============================================

-- Market prices reference table (for price enrichment)
CREATE TABLE IF NOT EXISTS agrosoluce.market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    price_per_ton_usd NUMERIC(10, 2) NOT NULL,
    price_date DATE NOT NULL,
    source VARCHAR(255), -- 'FAO', 'local_market', 'export_price', etc.
    quality_grade VARCHAR(50), -- 'premium', 'standard', 'bulk'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(commodity, country, price_date, quality_grade)
);

-- Geographic enrichment table (regions, climate zones, etc.)
CREATE TABLE IF NOT EXISTS agrosoluce.geographic_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    department VARCHAR(100),
    commune VARCHAR(100),
    climate_zone VARCHAR(100), -- 'tropical', 'savanna', etc.
    rainfall_mm_per_year NUMERIC(6, 2),
    average_temperature_celsius NUMERIC(4, 1),
    soil_type VARCHAR(100),
    elevation_meters INTEGER,
    agricultural_potential_score NUMERIC(3, 1) CHECK (agricultural_potential_score >= 0 AND agricultural_potential_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(country, region, department, commune)
);

-- Certification standards reference table
CREATE TABLE IF NOT EXISTS agrosoluce.certification_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_code VARCHAR(50) UNIQUE NOT NULL, -- 'FAIRTRADE', 'RA', 'ORGANIC', etc.
    certification_name VARCHAR(255) NOT NULL,
    description TEXT,
    issuer_organization VARCHAR(255),
    requirements_summary TEXT,
    typical_cost_usd NUMERIC(10, 2),
    renewal_period_months INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STRATEGY 3: CREATE COMPUTED/ENRICHED VIEWS
-- =============================================

-- Enriched cooperative view with calculated metrics
CREATE OR REPLACE VIEW agrosoluce.enriched_cooperatives AS
SELECT 
    c.*,
    COUNT(DISTINCT f.id) AS total_farmers,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT cert.id) AS total_certifications,
    AVG(baseline.total_admin_hours_per_week) AS avg_baseline_admin_hours,
    MAX(progress.progress_month) AS last_progress_report_month,
    AVG(survey.overall_satisfaction) AS avg_satisfaction_score,
    -- Calculate enrichment score based on data completeness
    (
        CASE WHEN c.name IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.country IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.commodity IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.annual_volume_tons IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.member_count IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.established_year IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.financial_health_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.sustainability_score IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.website_url IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN c.contact_email IS NOT NULL THEN 1 ELSE 0 END
    ) * 10 AS data_completeness_score,
    -- Market price enrichment (latest price for commodity)
    mp.price_per_ton_usd AS current_market_price_per_ton,
    -- Geographic enrichment
    gd.climate_zone,
    gd.agricultural_potential_score
FROM agrosoluce.cooperatives c
LEFT JOIN agrosoluce.farmers f ON f.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.baseline_measurements baseline ON baseline.cooperative_id = c.id
LEFT JOIN agrosoluce.monthly_progress progress ON progress.cooperative_id = c.id
LEFT JOIN agrosoluce.satisfaction_surveys survey ON survey.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT price_per_ton_usd 
    FROM agrosoluce.market_prices 
    WHERE commodity = c.commodity 
    AND country = c.country 
    ORDER BY price_date DESC 
    LIMIT 1
) mp ON true
LEFT JOIN agrosoluce.geographic_data gd ON 
    gd.country = c.country 
    AND gd.region = c.region 
    AND gd.department = c.department
GROUP BY c.id, mp.price_per_ton_usd, gd.climate_zone, gd.agricultural_potential_score;

-- Enriched farmer view with cooperative context
CREATE OR REPLACE VIEW agrosoluce.enriched_farmers AS
SELECT 
    f.*,
    c.name AS cooperative_name,
    c.region AS cooperative_region,
    c.commodity AS cooperative_commodity,
    c.certifications AS cooperative_certifications,
    COUNT(DISTINCT b.id) AS total_batches,
    SUM(b.quantity) AS total_production_quantity,
    MAX(b.harvest_date) AS last_harvest_date,
    -- Calculate farmer productivity score
    CASE 
        WHEN f.farm_size_hectares > 0 AND f.yield_per_hectare > 0 
        THEN (f.yield_per_hectare / NULLIF(f.farm_size_hectares, 0)) * 10
        ELSE NULL
    END AS productivity_score
FROM agrosoluce.farmers f
LEFT JOIN agrosoluce.cooperatives c ON c.id = f.cooperative_id
LEFT JOIN agrosoluce.batches b ON b.farmer_id = f.id
GROUP BY f.id, c.name, c.region, c.commodity, c.certifications;

-- =============================================
-- STRATEGY 4: CREATE ENRICHMENT FUNCTIONS
-- =============================================

-- Function to calculate cooperative enrichment score
CREATE OR REPLACE FUNCTION agrosoluce.calculate_cooperative_enrichment_score(coop_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    score NUMERIC := 0;
    max_score NUMERIC := 100;
BEGIN
    -- Basic information (30 points)
    SELECT score + 
        CASE WHEN name IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN country IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN commodity IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN annual_volume_tons IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN contact_email IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN contact_phone IS NOT NULL THEN 5 ELSE 0 END
    INTO score
    FROM agrosoluce.cooperatives WHERE id = coop_id;
    
    -- Extended information (40 points)
    SELECT score + 
        CASE WHEN member_count IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN established_year IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN financial_health_score IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN sustainability_score IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN website_url IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN processing_capacity_tons_per_year IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN storage_capacity_tons IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN export_experience_years IS NOT NULL THEN 5 ELSE 0 END
    INTO score
    FROM agrosoluce.cooperatives WHERE id = coop_id;
    
    -- Activity data (30 points)
    SELECT score + 
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.farmers WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END +
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.products WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END +
        CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.certifications WHERE cooperative_id = coop_id) THEN 10 ELSE 0 END
    INTO score;
    
    RETURN LEAST(score, max_score);
END;
$$ LANGUAGE plpgsql;

-- Function to auto-enrich cooperative from external sources (placeholder)
CREATE OR REPLACE FUNCTION agrosoluce.auto_enrich_cooperative(coop_id UUID)
RETURNS VOID AS $$
BEGIN
    -- This function would integrate with external APIs to enrich data
    -- Examples: Google Maps API for location data, certification databases, etc.
    -- For now, this is a placeholder structure
    
    -- Update data quality score based on available data
    UPDATE agrosoluce.cooperatives
    SET data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(coop_id)
    WHERE id = coop_id;
    
    -- Update last verified timestamp
    UPDATE agrosoluce.cooperatives
    SET last_verified_at = NOW()
    WHERE id = coop_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STRATEGY 5: CREATE ENRICHMENT TRIGGERS
-- =============================================

-- Trigger to auto-calculate enrichment scores when data is updated
CREATE OR REPLACE FUNCTION agrosoluce.update_enrichment_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Update data quality score whenever cooperative data changes
    NEW.data_quality_score = agrosoluce.calculate_cooperative_enrichment_score(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cooperative_enrichment
    BEFORE INSERT OR UPDATE ON agrosoluce.cooperatives
    FOR EACH ROW
    EXECUTE FUNCTION agrosoluce.update_enrichment_scores();

-- =============================================
-- STRATEGY 6: SEED DATA FOR ENRICHMENT
-- =============================================

-- Insert certification standards reference data
INSERT INTO agrosoluce.certification_standards (certification_code, certification_name, description, issuer_organization, typical_cost_usd, renewal_period_months) VALUES
('FAIRTRADE', 'Fairtrade', 'Fairtrade certification ensures fair prices and better working conditions for farmers', 'Fairtrade International', 2000, 12),
('RA', 'Rainforest Alliance', 'Rainforest Alliance certification promotes sustainable agriculture and forest conservation', 'Rainforest Alliance', 1500, 12),
('ORGANIC', 'Organic', 'Organic certification ensures products are grown without synthetic pesticides or fertilizers', 'Various (IFOAM, USDA, etc.)', 1000, 12),
('UTZ', 'UTZ Certified', 'UTZ certification promotes sustainable farming and better opportunities for farmers', 'UTZ', 1800, 12),
('4C', '4C Association', '4C certification ensures sustainable coffee production', '4C Association', 1200, 12),
('RSPO', 'RSPO', 'Roundtable on Sustainable Palm Oil certification', 'RSPO', 2500, 12)
ON CONFLICT (certification_code) DO NOTHING;

-- Insert sample market prices (you would update this with real data)
INSERT INTO agrosoluce.market_prices (commodity, country, price_per_ton_usd, price_date, source, quality_grade) VALUES
('Cocoa', 'Ivory Coast', 2500, CURRENT_DATE, 'local_market', 'premium'),
('Cocoa', 'Ivory Coast', 2200, CURRENT_DATE, 'local_market', 'standard'),
('Coffee', 'Ivory Coast', 1800, CURRENT_DATE, 'local_market', 'premium'),
('Coffee', 'Ivory Coast', 1600, CURRENT_DATE, 'local_market', 'standard'),
('Cashew', 'Ivory Coast', 1200, CURRENT_DATE, 'local_market', 'standard')
ON CONFLICT (commodity, country, price_date, quality_grade) DO NOTHING;

-- =============================================
-- STRATEGY 7: CREATE ENRICHMENT INDEXES
-- =============================================

-- Indexes for enrichment fields to improve query performance
CREATE INDEX IF NOT EXISTS idx_cooperatives_member_count ON agrosoluce.cooperatives(member_count);
CREATE INDEX IF NOT EXISTS idx_cooperatives_established_year ON agrosoluce.cooperatives(established_year);
CREATE INDEX IF NOT EXISTS idx_cooperatives_financial_health ON agrosoluce.cooperatives(financial_health_score);
CREATE INDEX IF NOT EXISTS idx_cooperatives_sustainability ON agrosoluce.cooperatives(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_cooperatives_data_quality ON agrosoluce.cooperatives(data_quality_score);
CREATE INDEX IF NOT EXISTS idx_farmers_farm_size ON agrosoluce.farmers(farm_size_hectares);
CREATE INDEX IF NOT EXISTS idx_farmers_primary_crop ON agrosoluce.farmers(primary_crop);
CREATE INDEX IF NOT EXISTS idx_market_prices_commodity_country ON agrosoluce.market_prices(commodity, country, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_geographic_data_location ON agrosoluce.geographic_data(country, region, department, commune);

-- =============================================
-- STRATEGY 8: CREATE ENRICHMENT METADATA TABLE
-- =============================================

-- Track enrichment operations and data sources
CREATE TABLE IF NOT EXISTS agrosoluce.enrichment_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'cooperative', 'farmer', 'product', etc.
    entity_id UUID NOT NULL,
    enrichment_type VARCHAR(100) NOT NULL, -- 'manual', 'api', 'import', 'calculated'
    enrichment_source VARCHAR(255), -- 'user_input', 'google_maps', 'certification_db', etc.
    fields_enriched TEXT[], -- Array of field names that were enriched
    enrichment_data JSONB, -- Snapshot of enriched data
    performed_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_enrichment_log_entity ON agrosoluce.enrichment_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_enrichment_log_performed_at ON agrosoluce.enrichment_log(performed_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on new tables
ALTER TABLE agrosoluce.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.geographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.certification_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.enrichment_log ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Anyone can view market prices" ON agrosoluce.market_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can view geographic data" ON agrosoluce.geographic_data FOR SELECT USING (true);
CREATE POLICY "Anyone can view certification standards" ON agrosoluce.certification_standards FOR SELECT USING (true);

-- Enrichment log: users can view logs for their entities
CREATE POLICY "Users can view enrichment logs for their entities" ON agrosoluce.enrichment_log
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
    );

-- =============================================
-- GRANTS
-- =============================================

GRANT SELECT ON agrosoluce.enriched_cooperatives TO authenticated;
GRANT SELECT ON agrosoluce.enriched_cooperatives TO anon;
GRANT SELECT ON agrosoluce.enriched_farmers TO authenticated;
GRANT SELECT ON agrosoluce.enriched_farmers TO anon;
GRANT ALL ON agrosoluce.market_prices TO authenticated;
GRANT ALL ON agrosoluce.geographic_data TO authenticated;
GRANT ALL ON agrosoluce.certification_standards TO authenticated;
GRANT SELECT ON agrosoluce.enrichment_log TO authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON VIEW agrosoluce.enriched_cooperatives IS 'Cooperative data enriched with calculated metrics, market prices, and geographic information';
COMMENT ON VIEW agrosoluce.enriched_farmers IS 'Farmer data enriched with cooperative context and production metrics';
COMMENT ON TABLE agrosoluce.market_prices IS 'Reference table for commodity market prices by country and date';
COMMENT ON TABLE agrosoluce.geographic_data IS 'Geographic enrichment data including climate, soil, and agricultural potential';
COMMENT ON TABLE agrosoluce.certification_standards IS 'Reference table for certification standards and requirements';
COMMENT ON TABLE agrosoluce.enrichment_log IS 'Audit log of all dataset enrichment operations';
COMMENT ON FUNCTION agrosoluce.calculate_cooperative_enrichment_score IS 'Calculates data enrichment/completeness score for a cooperative (0-100)';
COMMENT ON FUNCTION agrosoluce.auto_enrich_cooperative IS 'Automatically enriches cooperative data from external sources';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('009_dataset_enrichment_guide', 'Dataset enrichment guide: additional fields, lookup tables, computed views, and enrichment functions')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- Migration: 010_cooperative_dashboard_enhancements.sql
-- =============================================

-- Migration: Cooperative Dashboard Enhancements
-- Aligns database schema with AgroSoluce Cooperative Dashboard requirements
-- Adds missing fields, tables, and views for full dashboard functionality

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('010_cooperative_dashboard_enhancements', 'Cooperative Dashboard enhancements: profile management, lots, buyer requests, documents, declarations, notifications')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- 1. COOPERATIVE PROFILE ENHANCEMENTS
-- =============================================

-- Add status and verification level for admin control
ALTER TABLE agrosoluce.cooperatives
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_level VARCHAR(50) DEFAULT 'self_declared'
    CHECK (verification_level IN ('self_declared', 'docs_reviewed')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT; -- Internal only, buyers never see this

CREATE INDEX IF NOT EXISTS idx_cooperatives_status ON agrosoluce.cooperatives(status);
CREATE INDEX IF NOT EXISTS idx_cooperatives_verification_level ON agrosoluce.cooperatives(verification_level);

-- =============================================
-- 2. PRODUCT LOTS ENHANCEMENTS
-- =============================================

-- Enhance products table to support "lots" concept
ALTER TABLE agrosoluce.products
ADD COLUMN IF NOT EXISTS lot_status VARCHAR(50) DEFAULT 'draft'
    CHECK (lot_status IN ('draft', 'active', 'on_hold')),
ADD COLUMN IF NOT EXISTS quality_grade VARCHAR(50), -- 'premium', 'standard', 'bulk'
ADD COLUMN IF NOT EXISTS harvest_season VARCHAR(50), -- '2024-2025', 'Q1 2024', etc.
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS evidence_warnings TEXT[]; -- Array of warning messages

CREATE INDEX IF NOT EXISTS idx_products_lot_status ON agrosoluce.products(lot_status);
CREATE INDEX IF NOT EXISTS idx_products_evidence_complete ON agrosoluce.products(evidence_complete);

-- =============================================
-- 3. BUYER REQUESTS ENHANCEMENTS
-- =============================================

-- Enhance buyer requests for cooperative dashboard
ALTER TABLE agrosoluce.ag_buyer_requests
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS incoterms_preference VARCHAR(100),
ADD COLUMN IF NOT EXISTS coop_status VARCHAR(50) DEFAULT 'new'
    CHECK (coop_status IN ('new', 'reviewed', 'responded', 'closed')),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_method VARCHAR(50) CHECK (response_method IN ('email', 'phone', 'platform', 'other')),
ADD COLUMN IF NOT EXISTS response_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_buyer_requests_coop_status ON agrosoluce.ag_buyer_requests(coop_status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_reviewed_at ON agrosoluce.ag_buyer_requests(reviewed_at);

-- Link buyer requests to specific products/lots
CREATE TABLE IF NOT EXISTS agrosoluce.buyer_request_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES agrosoluce.ag_buyer_requests(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES agrosoluce.products(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_buyer_request_lots_request_id ON agrosoluce.buyer_request_lots(request_id);
CREATE INDEX IF NOT EXISTS idx_buyer_request_lots_product_id ON agrosoluce.buyer_request_lots(product_id);

-- =============================================
-- 4. UNIFIED DOCUMENTS TABLE
-- =============================================

-- Centralized documents table for all evidence types
CREATE TABLE IF NOT EXISTS agrosoluce.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('cooperative', 'farmer', 'plot', 'lot', 'certification', 'other')),
    entity_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'certification', 'policy', 'plot_evidence', 'child_labor_declaration', 'land_use_declaration', 'other'
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE,
    is_internal_only BOOLEAN DEFAULT false,
    is_buyer_visible BOOLEAN DEFAULT false,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_entity ON agrosoluce.documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON agrosoluce.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON agrosoluce.documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON agrosoluce.documents(uploaded_at DESC);

-- =============================================
-- 5. FARMER DECLARATIONS TABLE
-- =============================================

-- Specific declarations for child labor and land-use legitimacy
CREATE TABLE IF NOT EXISTS agrosoluce.farmer_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES agrosoluce.farmers(id) ON DELETE CASCADE,
    declaration_type VARCHAR(50) NOT NULL CHECK (declaration_type IN ('child_labor', 'land_use_legitimacy')),
    declared_value BOOLEAN NOT NULL, -- true = compliant, false = non-compliant
    declaration_date DATE NOT NULL,
    signed_by VARCHAR(255), -- Name of person making declaration
    witness_name VARCHAR(255), -- Coop officer who witnessed
    witness_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
    document_id UUID REFERENCES agrosoluce.documents(id) ON DELETE SET NULL, -- Link to uploaded document
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(farmer_id, declaration_type, declaration_date) -- One declaration per type per date
);

CREATE INDEX IF NOT EXISTS idx_farmer_declarations_farmer_id ON agrosoluce.farmer_declarations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_type ON agrosoluce.farmer_declarations(declaration_type);
CREATE INDEX IF NOT EXISTS idx_farmer_declarations_date ON agrosoluce.farmer_declarations(declaration_date DESC);

-- =============================================
-- 6. PLOT ENHANCEMENTS
-- =============================================

-- Enhance field_declarations to support plot concept better
ALTER TABLE agrosoluce.field_declarations
ADD COLUMN IF NOT EXISTS plot_reference_id VARCHAR(100), -- Human-readable plot ID
ADD COLUMN IF NOT EXISTS land_status VARCHAR(100), -- 'legitimate', 'under_review', 'disputed', etc.
ADD COLUMN IF NOT EXISTS evidence_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS linked_document_ids UUID[]; -- Array of document IDs

CREATE INDEX IF NOT EXISTS idx_field_declarations_plot_reference ON agrosoluce.field_declarations(plot_reference_id);
CREATE INDEX IF NOT EXISTS idx_field_declarations_land_status ON agrosoluce.field_declarations(land_status);
CREATE INDEX IF NOT EXISTS idx_field_declarations_evidence_complete ON agrosoluce.field_declarations(evidence_complete);

-- =============================================
-- 7. NOTIFICATIONS SYSTEM
-- =============================================

-- Comprehensive notifications and alerts system
CREATE TABLE IF NOT EXISTS agrosoluce.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES agrosoluce.user_profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL, -- 'new_buyer_request', 'expiring_document', 'admin_status_change', 'system_warning', 'missing_declaration', 'rejected_request'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'cooperative', 'request', 'document', 'farmer', 'lot', etc.
    entity_id UUID,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    send_email BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_sent_status VARCHAR(50), -- 'pending', 'sent', 'failed'
    action_url TEXT, -- URL to relevant page in dashboard
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_profile ON agrosoluce.notifications(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON agrosoluce.notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON agrosoluce.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON agrosoluce.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON agrosoluce.notifications(priority);

-- =============================================
-- 8. READINESS CHECKLIST
-- =============================================

-- Gap tracking and guidance system
CREATE TABLE IF NOT EXISTS agrosoluce.readiness_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
    checklist_item VARCHAR(255) NOT NULL, -- 'farmer_declarations', 'plot_geo_references', 'required_documents', 'lot_evidence', etc.
    status VARCHAR(50) DEFAULT 'missing' CHECK (status IN ('complete', 'partial', 'missing')),
    missing_count INTEGER DEFAULT 0,
    total_required INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    effort_level VARCHAR(50) CHECK (effort_level IN ('low', 'medium', 'high')),
    guidance_text TEXT, -- Simple language explanation
    guidance_url TEXT, -- Link to help/documentation
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cooperative_id, checklist_item)
);

CREATE INDEX IF NOT EXISTS idx_readiness_checklist_cooperative ON agrosoluce.readiness_checklist(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_readiness_checklist_status ON agrosoluce.readiness_checklist(status);
CREATE INDEX IF NOT EXISTS idx_readiness_checklist_last_checked ON agrosoluce.readiness_checklist(last_checked_at DESC);

-- =============================================
-- 9. BUYER-FACING SUMMARY VIEW
-- =============================================

-- Computed view showing what buyers see
CREATE OR REPLACE VIEW agrosoluce.buyer_facing_summary AS
SELECT 
    c.id,
    c.name,
    c.country,
    c.region,
    c.commodity,
    c.annual_volume_tons,
    -- Readiness badge calculation
    CASE 
        WHEN readiness.readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness.readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_badge,
    -- Evidence coverage percentages
    COALESCE(
        ROUND((farmer_stats.documented_farmers::NUMERIC / NULLIF(farmer_stats.total_farmers, 0) * 100), 1),
        0
    ) AS farmer_coverage_pct,
    COALESCE(
        ROUND((plot_stats.geo_referenced_plots::NUMERIC / NULLIF(plot_stats.total_plots, 0) * 100), 1),
        0
    ) AS plot_coverage_pct,
    COALESCE(
        ROUND((doc_stats.required_docs_uploaded::NUMERIC / NULLIF(doc_stats.total_required_docs, 0) * 100), 1),
        0
    ) AS document_coverage_pct,
    -- Certifications summary
    array_agg(DISTINCT cert.certification_type) FILTER (WHERE cert.status = 'active') AS certifications,
    -- Active lots count
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots_count,
    -- Risk flags (high-level only)
    c.compliance_flags->>'childLaborRisk' AS child_labor_risk,
    c.compliance_flags->>'eudrReady' AS eudr_ready,
    -- Status (only approved cooperatives visible to buyers)
    c.status
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM agrosoluce.farmer_declarations fd 
            WHERE fd.farmer_id = f.id 
            AND fd.declaration_type = 'child_labor'
        )) AS documented_farmers,
        COUNT(*) AS total_farmers
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id AND f.is_active = true
) farmer_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL) AS geo_referenced_plots,
        COUNT(*) AS total_plots
    FROM agrosoluce.field_declarations fd
    WHERE fd.cooperative_id = c.id
) plot_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE is_buyer_visible = true) AS required_docs_uploaded,
        COUNT(*) AS total_required_docs
    FROM agrosoluce.documents d
    WHERE d.entity_type = 'cooperative' AND d.entity_id = c.id
) doc_stats ON true
LEFT JOIN agrosoluce.certifications cert ON cert.cooperative_id = c.id
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN LATERAL (
    SELECT 
        (
            CASE WHEN farmer_stats.documented_farmers > 0 THEN 20 ELSE 0 END +
            CASE WHEN plot_stats.geo_referenced_plots > 0 THEN 20 ELSE 0 END +
            CASE WHEN doc_stats.required_docs_uploaded > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT cert.id) > 0 THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') > 0 THEN 20 ELSE 0 END
        ) AS readiness_score
) readiness ON true
WHERE c.status = 'approved' -- Only show approved cooperatives to buyers
GROUP BY 
    c.id, c.name, c.country, c.region, c.commodity, c.annual_volume_tons,
    c.compliance_flags, c.status,
    farmer_stats.documented_farmers, farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots, plot_stats.total_plots,
    doc_stats.required_docs_uploaded, doc_stats.total_required_docs,
    readiness.readiness_score;

-- =============================================
-- 10. DASHBOARD SUMMARY VIEWS
-- =============================================

-- Executive overview metrics for dashboard home
CREATE OR REPLACE VIEW agrosoluce.dashboard_executive_overview AS
SELECT 
    c.id AS cooperative_id,
    c.name,
    -- Readiness status
    CASE 
        WHEN readiness.readiness_score >= 80 THEN 'Buyer-Ready'
        WHEN readiness.readiness_score >= 50 THEN 'In Progress'
        ELSE 'Not Ready'
    END AS readiness_status,
    readiness.readiness_score,
    -- Evidence coverage
    farmer_stats.documented_farmers,
    farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots,
    plot_stats.total_plots,
    doc_stats.uploaded_documents,
    doc_stats.required_documents,
    -- Active lots
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') AS active_lots,
    COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active' AND p.evidence_complete = false) AS lots_with_warnings,
    -- Buyer interest
    COUNT(DISTINCT br.id) FILTER (WHERE br.coop_status = 'new') AS new_buyer_requests,
    COUNT(DISTINCT br.id) FILTER (WHERE br.coop_status = 'reviewed') AS reviewed_requests,
    -- Urgent alerts
    COUNT(DISTINCT n.id) FILTER (WHERE n.is_read = false AND n.priority IN ('high', 'urgent')) AS urgent_alerts,
    COUNT(DISTINCT d.id) FILTER (WHERE d.expiry_date IS NOT NULL AND d.expiry_date < CURRENT_DATE + INTERVAL '90 days') AS expiring_documents
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM agrosoluce.farmer_declarations fd 
            WHERE fd.farmer_id = f.id 
            AND fd.declaration_type IN ('child_labor', 'land_use_legitimacy')
        )) AS documented_farmers,
        COUNT(*) AS total_farmers
    FROM agrosoluce.farmers f
    WHERE f.cooperative_id = c.id AND f.is_active = true
) farmer_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) FILTER (WHERE field_location_latitude IS NOT NULL AND field_location_longitude IS NOT NULL) AS geo_referenced_plots,
        COUNT(*) AS total_plots
    FROM agrosoluce.field_declarations fd
    WHERE fd.cooperative_id = c.id
) plot_stats ON true
LEFT JOIN LATERAL (
    SELECT 
        COUNT(*) AS uploaded_documents,
        COUNT(*) FILTER (WHERE is_buyer_visible = true) AS required_documents
    FROM agrosoluce.documents d
    WHERE d.entity_type = 'cooperative' AND d.entity_id = c.id
) doc_stats ON true
LEFT JOIN agrosoluce.products p ON p.cooperative_id = c.id
LEFT JOIN agrosoluce.ag_buyer_requests br ON br.id IN (
    SELECT request_id FROM agrosoluce.ag_request_matches 
    WHERE cooperative_id = c.id
)
LEFT JOIN agrosoluce.notifications n ON n.user_profile_id = c.user_profile_id
LEFT JOIN agrosoluce.documents d ON d.entity_type = 'cooperative' AND d.entity_id = c.id
LEFT JOIN LATERAL (
    SELECT 
        (
            CASE WHEN farmer_stats.documented_farmers > 0 THEN 20 ELSE 0 END +
            CASE WHEN plot_stats.geo_referenced_plots > 0 THEN 20 ELSE 0 END +
            CASE WHEN doc_stats.uploaded_documents > 0 THEN 20 ELSE 0 END +
            CASE WHEN EXISTS (SELECT 1 FROM agrosoluce.certifications WHERE cooperative_id = c.id AND status = 'active') THEN 20 ELSE 0 END +
            CASE WHEN COUNT(DISTINCT p.id) FILTER (WHERE p.lot_status = 'active') > 0 THEN 20 ELSE 0 END
        ) AS readiness_score
) readiness ON true
GROUP BY 
    c.id, c.name,
    farmer_stats.documented_farmers, farmer_stats.total_farmers,
    plot_stats.geo_referenced_plots, plot_stats.total_plots,
    doc_stats.uploaded_documents, doc_stats.required_documents,
    readiness.readiness_score;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on new tables
ALTER TABLE agrosoluce.buyer_request_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.farmer_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.readiness_checklist ENABLE ROW LEVEL SECURITY;

-- Buyer request lots: cooperative members can view lots for their requests
CREATE POLICY "Cooperative members can view their request lots" ON agrosoluce.buyer_request_lots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.ag_buyer_requests br
            JOIN agrosoluce.ag_request_matches arm ON arm.request_id = br.id
            JOIN agrosoluce.cooperatives c ON c.id = arm.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE br.id = buyer_request_lots.request_id
            AND up.user_id = auth.uid()
        )
    );

-- Documents: cooperative members can manage their documents
CREATE POLICY "Cooperative members can view their documents" ON agrosoluce.documents
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        ))
    );

CREATE POLICY "Cooperative members can upload documents" ON agrosoluce.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE id = documents.uploaded_by AND user_id = auth.uid()
        )
    );

-- Farmer declarations: cooperative members can manage declarations for their farmers
CREATE POLICY "Cooperative members can view farmer declarations" ON agrosoluce.farmer_declarations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = auth.uid()
        )
    );

CREATE POLICY "Cooperative members can create farmer declarations" ON agrosoluce.farmer_declarations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = auth.uid()
        )
    );

-- Notifications: users can only view their own notifications
CREATE POLICY "Users can view their notifications" ON agrosoluce.notifications
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their notifications" ON agrosoluce.notifications
    FOR UPDATE USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Readiness checklist: cooperative members can view their checklist
CREATE POLICY "Cooperative members can view their checklist" ON agrosoluce.readiness_checklist
    FOR SELECT USING (
        cooperative_id IN (
            SELECT id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = auth.uid()
        )
    );

-- =============================================
-- TRIGGERS
-- =============================================

-- Update updated_at for new tables
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON agrosoluce.documents
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_farmer_declarations_updated_at BEFORE UPDATE ON agrosoluce.farmer_declarations
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

CREATE TRIGGER update_readiness_checklist_updated_at BEFORE UPDATE ON agrosoluce.readiness_checklist
    FOR EACH ROW EXECUTE FUNCTION agrosoluce.update_updated_at_column();

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.buyer_request_lots TO authenticated;
GRANT ALL ON agrosoluce.documents TO authenticated;
GRANT ALL ON agrosoluce.farmer_declarations TO authenticated;
GRANT ALL ON agrosoluce.notifications TO authenticated;
GRANT ALL ON agrosoluce.readiness_checklist TO authenticated;

GRANT SELECT ON agrosoluce.buyer_facing_summary TO authenticated;
GRANT SELECT ON agrosoluce.buyer_facing_summary TO anon;
GRANT SELECT ON agrosoluce.dashboard_executive_overview TO authenticated;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE agrosoluce.buyer_request_lots IS 'Links buyer requests to specific product lots';
COMMENT ON TABLE agrosoluce.documents IS 'Unified documents table for all evidence types (certifications, policies, plot evidence, etc.)';
COMMENT ON TABLE agrosoluce.farmer_declarations IS 'Specific declarations for child labor and land-use legitimacy';
COMMENT ON TABLE agrosoluce.notifications IS 'Notifications and alerts system for cooperatives';
COMMENT ON TABLE agrosoluce.readiness_checklist IS 'Gap tracking and guidance system for cooperative readiness';
COMMENT ON VIEW agrosoluce.buyer_facing_summary IS 'What buyers see - computed summary of cooperative readiness and evidence';
COMMENT ON VIEW agrosoluce.dashboard_executive_overview IS 'Executive overview metrics for cooperative dashboard home page';

-- =============================================
-- MIGRATION RECORD
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('010_cooperative_dashboard_enhancements', 'Cooperative Dashboard enhancements: profile management, lots, buyer requests, documents, declarations, notifications')
ON CONFLICT (migration_name) DO NOTHING;




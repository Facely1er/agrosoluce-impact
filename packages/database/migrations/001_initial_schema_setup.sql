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


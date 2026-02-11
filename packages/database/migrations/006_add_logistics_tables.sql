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


-- Migration: Create VRAC (Pharmacy Surveillance) Tables
-- This migration creates tables for storing pharmacy surveillance data
-- used for workforce health analysis and antimalarial tracking

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('022_create_vrac_tables', 'Create VRAC pharmacy surveillance tables for health monitoring')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- PHARMACY PROFILES TABLE
-- =============================================

-- Pharmacy profiles table
CREATE TABLE IF NOT EXISTS agrosoluce.pharmacy_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  location TEXT NOT NULL,
  region_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE agrosoluce.pharmacy_profiles IS 'Pharmacy locations and metadata for VRAC surveillance';
COMMENT ON COLUMN agrosoluce.pharmacy_profiles.id IS 'Pharmacy identifier (tanda, prolife, olympique, attobrou)';
COMMENT ON COLUMN agrosoluce.pharmacy_profiles.region IS 'Region code (gontougo, la_me, abidjan)';
COMMENT ON COLUMN agrosoluce.pharmacy_profiles.region_label IS 'Human-readable region label with context';

-- =============================================
-- PRODUCT SALES TABLE
-- =============================================

-- Product sales table
CREATE TABLE IF NOT EXISTS agrosoluce.vrac_product_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id TEXT NOT NULL REFERENCES agrosoluce.pharmacy_profiles(id) ON DELETE CASCADE,
  period_label TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  year INTEGER NOT NULL,
  code TEXT NOT NULL,
  designation TEXT NOT NULL,
  quantity_sold INTEGER NOT NULL,
  stock INTEGER,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vrac_product_sales_quantity_check CHECK (quantity_sold >= 0)
);

COMMENT ON TABLE agrosoluce.vrac_product_sales IS 'Individual product sales records from pharmacy surveillance';
COMMENT ON COLUMN agrosoluce.vrac_product_sales.period_label IS 'Human-readable period label (e.g., Aug–Dec 2025)';
COMMENT ON COLUMN agrosoluce.vrac_product_sales.code IS 'Product code from pharmacy system';
COMMENT ON COLUMN agrosoluce.vrac_product_sales.designation IS 'Product name/description';

-- =============================================
-- PHARMACY PERIOD AGGREGATES TABLE
-- =============================================

-- Pharmacy period aggregates table (for performance)
CREATE TABLE IF NOT EXISTS agrosoluce.vrac_period_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id TEXT NOT NULL REFERENCES agrosoluce.pharmacy_profiles(id) ON DELETE CASCADE,
  period_label TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  year INTEGER NOT NULL,
  total_quantity INTEGER NOT NULL,
  antimalarial_quantity INTEGER NOT NULL,
  antibiotic_quantity INTEGER NOT NULL,
  analgesic_quantity INTEGER NOT NULL,
  antimalarial_share DECIMAL(4,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pharmacy_id, year, period_label),
  CONSTRAINT vrac_period_aggregates_share_check CHECK (antimalarial_share >= 0 AND antimalarial_share <= 1)
);

COMMENT ON TABLE agrosoluce.vrac_period_aggregates IS 'Pre-calculated period aggregates for performance optimization';
COMMENT ON COLUMN agrosoluce.vrac_period_aggregates.antimalarial_share IS 'Antimalarial share as decimal (0-1)';

-- =============================================
-- REGIONAL HEALTH INDEX TABLE
-- =============================================

-- Regional health index table (materialized view alternative)
CREATE TABLE IF NOT EXISTS agrosoluce.vrac_regional_health_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id TEXT NOT NULL REFERENCES agrosoluce.pharmacy_profiles(id) ON DELETE CASCADE,
  period_label TEXT NOT NULL,
  year INTEGER NOT NULL,
  antimalarial_quantity INTEGER NOT NULL,
  total_quantity INTEGER NOT NULL,
  antimalarial_share DECIMAL(4,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pharmacy_id, year, period_label),
  CONSTRAINT vrac_health_index_share_check CHECK (antimalarial_share >= 0 AND antimalarial_share <= 1)
);

COMMENT ON TABLE agrosoluce.vrac_regional_health_index IS 'Regional health metrics based on antimalarial sales';
COMMENT ON COLUMN agrosoluce.vrac_regional_health_index.antimalarial_share IS 'Antimalarial share as decimal (0-1)';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for product sales
CREATE INDEX IF NOT EXISTS idx_vrac_product_sales_pharmacy_year ON agrosoluce.vrac_product_sales(pharmacy_id, year);
CREATE INDEX IF NOT EXISTS idx_vrac_product_sales_period ON agrosoluce.vrac_product_sales(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_vrac_product_sales_code ON agrosoluce.vrac_product_sales(code);

-- Indexes for period aggregates
CREATE INDEX IF NOT EXISTS idx_vrac_period_aggregates_pharmacy_year ON agrosoluce.vrac_period_aggregates(pharmacy_id, year);
CREATE INDEX IF NOT EXISTS idx_vrac_period_aggregates_year ON agrosoluce.vrac_period_aggregates(year);

-- Indexes for health index
CREATE INDEX IF NOT EXISTS idx_vrac_health_index_pharmacy_year ON agrosoluce.vrac_regional_health_index(pharmacy_id, year);
CREATE INDEX IF NOT EXISTS idx_vrac_health_index_year ON agrosoluce.vrac_regional_health_index(year);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE agrosoluce.pharmacy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.vrac_product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.vrac_period_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.vrac_regional_health_index ENABLE ROW LEVEL SECURITY;

-- Public read access policies (data is non-sensitive surveillance data)
CREATE POLICY "Public read access for pharmacy_profiles" 
  ON agrosoluce.pharmacy_profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access for vrac_product_sales" 
  ON agrosoluce.vrac_product_sales 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access for vrac_period_aggregates" 
  ON agrosoluce.vrac_period_aggregates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access for vrac_regional_health_index" 
  ON agrosoluce.vrac_regional_health_index 
  FOR SELECT 
  USING (true);

-- =============================================
-- PHARMACY PROFILES SEED DATA
-- =============================================

-- Insert pharmacy profiles
INSERT INTO agrosoluce.pharmacy_profiles (id, name, region, location, region_label) VALUES
  ('tanda', 'Grande Pharmacie de Tanda', 'gontougo', 'Tanda, Gontougo', 'Gontougo (cocoa)'),
  ('prolife', 'Pharmacie Prolife', 'gontougo', 'Tabagne, Gontougo', 'Gontougo (cocoa)'),
  ('olympique', 'Pharmacie Olympique', 'abidjan', 'Abidjan', 'Abidjan (urban)'),
  ('attobrou', 'Pharmacie Attobrou', 'la_me', 'La Mé', 'La Mé (cocoa)')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- UPDATED_AT TRIGGER FUNCTIONS
-- =============================================

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION agrosoluce.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_pharmacy_profiles_updated_at ON agrosoluce.pharmacy_profiles;
CREATE TRIGGER update_pharmacy_profiles_updated_at
    BEFORE UPDATE ON agrosoluce.pharmacy_profiles
    FOR EACH ROW
    EXECUTE FUNCTION agrosoluce.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vrac_product_sales_updated_at ON agrosoluce.vrac_product_sales;
CREATE TRIGGER update_vrac_product_sales_updated_at
    BEFORE UPDATE ON agrosoluce.vrac_product_sales
    FOR EACH ROW
    EXECUTE FUNCTION agrosoluce.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vrac_period_aggregates_updated_at ON agrosoluce.vrac_period_aggregates;
CREATE TRIGGER update_vrac_period_aggregates_updated_at
    BEFORE UPDATE ON agrosoluce.vrac_period_aggregates
    FOR EACH ROW
    EXECUTE FUNCTION agrosoluce.update_updated_at_column();

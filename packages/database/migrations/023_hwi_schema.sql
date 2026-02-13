-- Migration: Create HWI (Household Welfare Index) Tables and Views
-- This migration creates tables and views for the comprehensive HWI system
-- tracking 7 medication categories for ESG monitoring

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('023_hwi_schema', 'Create Household Welfare Index tables, views, and functions')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- CATEGORY AGGREGATES TABLE
-- =============================================

-- Track all 7 medication categories per period
CREATE TABLE IF NOT EXISTS agrosoluce.vrac_category_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id TEXT NOT NULL REFERENCES agrosoluce.pharmacy_profiles(id) ON DELETE CASCADE,
  period_label TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  share NUMERIC(7,6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pharmacy_id, year, period_label, category),
  CONSTRAINT vrac_category_aggregates_quantity_check CHECK (quantity >= 0),
  CONSTRAINT vrac_category_aggregates_share_check CHECK (share >= 0 AND share <= 1)
);

COMMENT ON TABLE agrosoluce.vrac_category_aggregates IS 'Medication category aggregates for HWI calculation';
COMMENT ON COLUMN agrosoluce.vrac_category_aggregates.category IS 'Category: antimalarial, pediatric_ors_zinc, prenatal_vitamins, contraceptives, micronutrients, arv, antibiotics, other';
COMMENT ON COLUMN agrosoluce.vrac_category_aggregates.share IS 'Share of total quantity (0-1)';

-- =============================================
-- HOUSEHOLD WELFARE INDEX TABLE
-- =============================================

-- Store HWI composite scores
CREATE TABLE IF NOT EXISTS agrosoluce.household_welfare_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id TEXT NOT NULL REFERENCES agrosoluce.pharmacy_profiles(id) ON DELETE CASCADE,
  departement TEXT NOT NULL,
  region TEXT,
  period_label TEXT NOT NULL,
  year INTEGER NOT NULL,
  hwi_score NUMERIC(5,2) NOT NULL,
  workforce_health_score NUMERIC(5,2),
  child_welfare_score NUMERIC(5,2),
  womens_health_score NUMERIC(5,2),
  womens_empowerment_score NUMERIC(5,2),
  nutrition_score NUMERIC(5,2),
  chronic_illness_score NUMERIC(5,2),
  acute_illness_score NUMERIC(5,2),
  alert_level TEXT NOT NULL,
  total_quantity INTEGER NOT NULL,
  category_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pharmacy_id, year, period_label),
  CONSTRAINT hwi_score_check CHECK (hwi_score >= 0 AND hwi_score <= 100),
  CONSTRAINT hwi_alert_level_check CHECK (alert_level IN ('green', 'yellow', 'red', 'black'))
);

COMMENT ON TABLE agrosoluce.household_welfare_index IS 'Household Welfare Index scores and component breakdown';
COMMENT ON COLUMN agrosoluce.household_welfare_index.hwi_score IS 'Composite HWI score (0-100, higher = worse conditions)';
COMMENT ON COLUMN agrosoluce.household_welfare_index.alert_level IS 'Alert classification: green (0-25), yellow (25-50), red (50-75), black (75-100)';
COMMENT ON COLUMN agrosoluce.household_welfare_index.category_breakdown IS 'JSON object with category shares';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for category aggregates
CREATE INDEX IF NOT EXISTS idx_vrac_category_aggregates_pharmacy_year 
  ON agrosoluce.vrac_category_aggregates(pharmacy_id, year);
CREATE INDEX IF NOT EXISTS idx_vrac_category_aggregates_category 
  ON agrosoluce.vrac_category_aggregates(category);
CREATE INDEX IF NOT EXISTS idx_vrac_category_aggregates_year 
  ON agrosoluce.vrac_category_aggregates(year);

-- Indexes for HWI
CREATE INDEX IF NOT EXISTS idx_hwi_pharmacy_year 
  ON agrosoluce.household_welfare_index(pharmacy_id, year);
CREATE INDEX IF NOT EXISTS idx_hwi_alert_level 
  ON agrosoluce.household_welfare_index(alert_level);
CREATE INDEX IF NOT EXISTS idx_hwi_departement 
  ON agrosoluce.household_welfare_index(departement);
CREATE INDEX IF NOT EXISTS idx_hwi_year 
  ON agrosoluce.household_welfare_index(year);
CREATE INDEX IF NOT EXISTS idx_hwi_score 
  ON agrosoluce.household_welfare_index(hwi_score);

-- =============================================
-- VIEWS
-- =============================================

-- View: Latest HWI scores per pharmacy
CREATE OR REPLACE VIEW agrosoluce.v_hwi_latest AS
SELECT DISTINCT ON (pharmacy_id)
  h.*,
  p.name as pharmacy_name,
  p.region as pharmacy_region,
  p.location
FROM agrosoluce.household_welfare_index h
JOIN agrosoluce.pharmacy_profiles p ON h.pharmacy_id = p.id
ORDER BY pharmacy_id, year DESC, period_label DESC;

COMMENT ON VIEW agrosoluce.v_hwi_latest IS 'Most recent HWI scores for each pharmacy';

-- View: Active alerts (non-green)
CREATE OR REPLACE VIEW agrosoluce.v_hwi_active_alerts AS
SELECT 
  h.*,
  p.name as pharmacy_name,
  p.region as pharmacy_region,
  p.location
FROM agrosoluce.household_welfare_index h
JOIN agrosoluce.pharmacy_profiles p ON h.pharmacy_id = p.id
WHERE h.alert_level != 'green'
ORDER BY 
  CASE h.alert_level
    WHEN 'black' THEN 1
    WHEN 'red' THEN 2
    WHEN 'yellow' THEN 3
    ELSE 4
  END,
  h.hwi_score DESC;

COMMENT ON VIEW agrosoluce.v_hwi_active_alerts IS 'All non-green alert level HWI scores, ordered by severity';

-- View: HWI timeseries by departement
CREATE OR REPLACE VIEW agrosoluce.v_hwi_timeseries_by_dept AS
SELECT 
  departement,
  year,
  period_label,
  COUNT(*) as pharmacy_count,
  AVG(hwi_score) as avg_hwi_score,
  MIN(hwi_score) as min_hwi_score,
  MAX(hwi_score) as max_hwi_score,
  AVG(workforce_health_score) as avg_workforce_health,
  AVG(child_welfare_score) as avg_child_welfare,
  AVG(womens_health_score) as avg_womens_health,
  AVG(womens_empowerment_score) as avg_womens_empowerment,
  AVG(nutrition_score) as avg_nutrition,
  AVG(chronic_illness_score) as avg_chronic_illness,
  AVG(acute_illness_score) as avg_acute_illness,
  SUM(total_quantity) as total_quantity_all_pharmacies
FROM agrosoluce.household_welfare_index
GROUP BY departement, year, period_label
ORDER BY year DESC, period_label DESC;

COMMENT ON VIEW agrosoluce.v_hwi_timeseries_by_dept IS 'HWI aggregates by departement and time period';

-- View: Category trends over time
CREATE OR REPLACE VIEW agrosoluce.v_category_trends AS
SELECT 
  ca.category,
  ca.year,
  ca.period_label,
  COUNT(DISTINCT ca.pharmacy_id) as pharmacy_count,
  SUM(ca.quantity) as total_quantity,
  AVG(ca.share) as avg_share,
  MIN(ca.share) as min_share,
  MAX(ca.share) as max_share
FROM agrosoluce.vrac_category_aggregates ca
GROUP BY ca.category, ca.year, ca.period_label
ORDER BY ca.year DESC, ca.period_label DESC, ca.category;

COMMENT ON VIEW agrosoluce.v_category_trends IS 'Category-level trends across all pharmacies';

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function: Get HWI summary for a departement and year
CREATE OR REPLACE FUNCTION agrosoluce.get_hwi_summary(
  dept_name TEXT DEFAULT NULL,
  target_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
  year INTEGER,
  avg_score NUMERIC,
  alert_distribution JSONB,
  component_averages JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.year,
    ROUND(AVG(h.hwi_score), 2) as avg_score,
    jsonb_build_object(
      'green', COUNT(*) FILTER (WHERE h.alert_level = 'green'),
      'yellow', COUNT(*) FILTER (WHERE h.alert_level = 'yellow'),
      'red', COUNT(*) FILTER (WHERE h.alert_level = 'red'),
      'black', COUNT(*) FILTER (WHERE h.alert_level = 'black')
    ) as alert_distribution,
    jsonb_build_object(
      'workforce_health', ROUND(AVG(h.workforce_health_score), 2),
      'child_welfare', ROUND(AVG(h.child_welfare_score), 2),
      'womens_health', ROUND(AVG(h.womens_health_score), 2),
      'womens_empowerment', ROUND(AVG(h.womens_empowerment_score), 2),
      'nutrition', ROUND(AVG(h.nutrition_score), 2),
      'chronic_illness', ROUND(AVG(h.chronic_illness_score), 2),
      'acute_illness', ROUND(AVG(h.acute_illness_score), 2)
    ) as component_averages
  FROM agrosoluce.household_welfare_index h
  WHERE (dept_name IS NULL OR h.departement = dept_name)
    AND (target_year IS NULL OR h.year = target_year)
  GROUP BY h.year
  ORDER BY h.year DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION agrosoluce.get_hwi_summary IS 'Get HWI summary statistics for a departement and/or year';

-- Function: Get alert distribution
CREATE OR REPLACE FUNCTION agrosoluce.get_alert_distribution(
  target_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
  alert_level TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH counts AS (
    SELECT 
      h.alert_level,
      COUNT(*) as count
    FROM agrosoluce.household_welfare_index h
    WHERE target_year IS NULL OR h.year = target_year
    GROUP BY h.alert_level
  ),
  total AS (
    SELECT SUM(count) as total_count FROM counts
  )
  SELECT 
    c.alert_level,
    c.count,
    ROUND((c.count::NUMERIC / t.total_count) * 100, 2) as percentage
  FROM counts c, total t
  ORDER BY 
    CASE c.alert_level
      WHEN 'green' THEN 1
      WHEN 'yellow' THEN 2
      WHEN 'red' THEN 3
      WHEN 'black' THEN 4
    END;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION agrosoluce.get_alert_distribution IS 'Get distribution of alert levels by count and percentage';

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE agrosoluce.vrac_category_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.household_welfare_index ENABLE ROW LEVEL SECURITY;

-- Public read access policies (surveillance data is non-sensitive)
CREATE POLICY "Public read access for vrac_category_aggregates" 
  ON agrosoluce.vrac_category_aggregates 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access for household_welfare_index" 
  ON agrosoluce.household_welfare_index 
  FOR SELECT 
  USING (true);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_vrac_category_aggregates_updated_at ON agrosoluce.vrac_category_aggregates;
CREATE TRIGGER update_vrac_category_aggregates_updated_at
  BEFORE UPDATE ON agrosoluce.vrac_category_aggregates
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_updated_at_column();

DROP TRIGGER IF EXISTS update_household_welfare_index_updated_at ON agrosoluce.household_welfare_index;
CREATE TRIGGER update_household_welfare_index_updated_at
  BEFORE UPDATE ON agrosoluce.household_welfare_index
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_updated_at_column();

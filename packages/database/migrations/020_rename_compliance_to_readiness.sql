-- Migration: Rename Compliance to Readiness Terminology
-- This migration updates database schema to use safer terminology:
-- - compliance_score → readiness_score
-- - cooperative_compliance_status → cooperative_readiness_status
-- Updates all related views, functions, and indexes
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('020_rename_compliance_to_readiness', 'Rename compliance terminology to readiness for child labor monitoring')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- STEP 1: CREATE CHILD_LABOR_ASSESSMENTS TABLE IF IT DOESN'T EXIST
-- =============================================

-- Create the child_labor_assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS agrosoluce.child_labor_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id UUID NOT NULL REFERENCES agrosoluce.cooperatives(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES agrosoluce.user_profiles(id) ON DELETE SET NULL,
  
  -- Assessment Details
  assessment_date DATE NOT NULL,
  assessment_period_start DATE NOT NULL,
  assessment_period_end DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  
  -- School Enrollment Data
  total_children_in_community INTEGER NOT NULL DEFAULT 0,
  children_enrolled_school INTEGER NOT NULL DEFAULT 0,
  school_enrollment_rate NUMERIC(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_children_in_community > 0 
      THEN (children_enrolled_school::NUMERIC / total_children_in_community::NUMERIC) * 100
      ELSE 0
    END
  ) STORED,
  
  -- Labor Verification
  minimum_working_age INTEGER NOT NULL DEFAULT 16,
  total_workers_assessed INTEGER NOT NULL DEFAULT 0,
  underage_workers_found INTEGER NOT NULL DEFAULT 0,
  age_verification_method VARCHAR(50) CHECK (age_verification_method IN ('birth_certificate', 'school_records', 'community_verification', 'other')),
  
  -- Violations
  child_labor_violations INTEGER NOT NULL DEFAULT 0,
  hazardous_work_violations INTEGER NOT NULL DEFAULT 0,
  worst_forms_violations INTEGER NOT NULL DEFAULT 0,
  violation_severity VARCHAR(50) CHECK (violation_severity IN ('none', 'low', 'medium', 'high', 'critical')),
  violation_details JSONB DEFAULT '[]'::jsonb,
  
  -- Readiness Score (renamed from compliance_score)
  -- This is a self-assessment score, not a compliance determination
  readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100),
  
  -- Legacy field for backward compatibility during migration
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  
  -- Supporting Evidence
  evidence_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  photographs TEXT[] DEFAULT ARRAY[]::TEXT[],
  witness_statements JSONB DEFAULT '[]'::jsonb,
  
  -- Assessor Information
  assessor_name VARCHAR(255) NOT NULL,
  assessor_organization VARCHAR(255),
  assessor_certification VARCHAR(255),
  assessor_notes TEXT,
  
  -- Next Assessment
  next_assessment_due DATE,
  assessment_frequency_months INTEGER DEFAULT 6,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STEP 2: MIGRATE EXISTING DATA
-- =============================================

-- If compliance_score exists but readiness_score doesn't, copy the data
DO $$
BEGIN
  -- Check if compliance_score column exists and readiness_score doesn't
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'agrosoluce' 
    AND table_name = 'child_labor_assessments' 
    AND column_name = 'compliance_score'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'agrosoluce' 
    AND table_name = 'child_labor_assessments' 
    AND column_name = 'readiness_score'
  ) THEN
    -- Add readiness_score column
    ALTER TABLE agrosoluce.child_labor_assessments 
    ADD COLUMN readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100);
    
    -- Copy data from compliance_score to readiness_score
    UPDATE agrosoluce.child_labor_assessments 
    SET readiness_score = compliance_score 
    WHERE compliance_score IS NOT NULL;
  END IF;
  
  -- If both columns exist, ensure readiness_score is populated
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'agrosoluce' 
    AND table_name = 'child_labor_assessments' 
    AND column_name = 'readiness_score'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'agrosoluce' 
    AND table_name = 'child_labor_assessments' 
    AND column_name = 'compliance_score'
  ) THEN
    -- Update readiness_score where it's NULL but compliance_score has a value
    UPDATE agrosoluce.child_labor_assessments 
    SET readiness_score = compliance_score 
    WHERE readiness_score IS NULL AND compliance_score IS NOT NULL;
  END IF;
END $$;

-- =============================================
-- STEP 3: CREATE/UPDATE COOPERATIVE_READINESS_STATUS VIEW
-- =============================================

-- Drop the old view/table if it exists
DROP VIEW IF EXISTS agrosoluce.cooperative_compliance_status CASCADE;
DROP TABLE IF EXISTS agrosoluce.cooperative_compliance_status CASCADE;

-- Create the new view with readiness terminology
CREATE OR REPLACE VIEW agrosoluce.cooperative_readiness_status AS
SELECT 
  c.id AS cooperative_id,
  c.name AS cooperative_name,
  c.region,
  c.country,
  c.commodity,
  
  -- Latest assessment data
  a.id AS latest_assessment_id,
  a.assessment_date AS latest_assessment_date,
  a.status AS latest_assessment_status,
  
  -- Readiness metrics (self-assessment, not compliance determination)
  COALESCE(a.readiness_score, a.compliance_score, 0) AS readiness_score,
  a.compliance_score AS legacy_compliance_score, -- Keep for backward compatibility
  
  -- Violation metrics
  COALESCE(a.child_labor_violations, 0) AS child_labor_violations,
  COALESCE(a.hazardous_work_violations, 0) AS hazardous_work_violations,
  COALESCE(a.worst_forms_violations, 0) AS worst_forms_violations,
  a.violation_severity,
  
  -- School enrollment metrics
  a.total_children_in_community,
  a.children_enrolled_school,
  a.school_enrollment_rate,
  
  -- Assessment metadata
  a.assessor_name,
  a.assessor_organization,
  a.next_assessment_due,
  a.assessment_frequency_months,
  
  -- Timestamps
  a.created_at AS assessment_created_at,
  a.updated_at AS assessment_updated_at,
  NOW() AS status_calculated_at
  
FROM agrosoluce.cooperatives c
LEFT JOIN LATERAL (
  SELECT *
  FROM agrosoluce.child_labor_assessments
  WHERE cooperative_id = c.id
  AND status = 'completed'
  ORDER BY assessment_date DESC
  LIMIT 1
) a ON true;

-- Create a materialized view option for better performance (optional, can be refreshed periodically)
-- Uncomment if needed:
-- CREATE MATERIALIZED VIEW IF NOT EXISTS agrosoluce.cooperative_readiness_status_materialized AS
-- SELECT * FROM agrosoluce.cooperative_readiness_status;

-- =============================================
-- STEP 4: CREATE INDEXES
-- =============================================

-- Indexes for child_labor_assessments
CREATE INDEX IF NOT EXISTS idx_child_labor_assessments_cooperative_id 
  ON agrosoluce.child_labor_assessments(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_child_labor_assessments_assessment_date 
  ON agrosoluce.child_labor_assessments(assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_child_labor_assessments_status 
  ON agrosoluce.child_labor_assessments(status);
CREATE INDEX IF NOT EXISTS idx_child_labor_assessments_readiness_score 
  ON agrosoluce.child_labor_assessments(readiness_score DESC);
CREATE INDEX IF NOT EXISTS idx_child_labor_assessments_compliance_score 
  ON agrosoluce.child_labor_assessments(compliance_score DESC); -- Keep for backward compatibility

-- =============================================
-- STEP 5: UPDATE FUNCTIONS
-- =============================================

-- Drop old function if it exists
DROP FUNCTION IF EXISTS agrosoluce.get_compliance_dashboard_stats();

-- Create new function with readiness terminology
CREATE OR REPLACE FUNCTION agrosoluce.get_readiness_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'totalAssessments', COUNT(*),
    'averageReadinessScore', ROUND(AVG(COALESCE(readiness_score, compliance_score, 0))::NUMERIC, 2),
    'totalCooperatives', COUNT(DISTINCT cooperative_id),
    'assessmentsByStatus', jsonb_object_agg(status, count) FILTER (WHERE status IS NOT NULL),
    'readinessDistribution', jsonb_build_object(
      'excellent', COUNT(*) FILTER (WHERE COALESCE(readiness_score, compliance_score, 0) >= 90),
      'good', COUNT(*) FILTER (WHERE COALESCE(readiness_score, compliance_score, 0) >= 75 AND COALESCE(readiness_score, compliance_score, 0) < 90),
      'fair', COUNT(*) FILTER (WHERE COALESCE(readiness_score, compliance_score, 0) >= 60 AND COALESCE(readiness_score, compliance_score, 0) < 75),
      'poor', COUNT(*) FILTER (WHERE COALESCE(readiness_score, compliance_score, 0) < 60)
    ),
    'violationsSummary', jsonb_build_object(
      'totalViolations', SUM(child_labor_violations + hazardous_work_violations + worst_forms_violations),
      'cooperativesWithViolations', COUNT(DISTINCT cooperative_id) FILTER (WHERE (child_labor_violations + hazardous_work_violations + worst_forms_violations) > 0)
    )
  ) INTO result
  FROM (
    SELECT 
      status,
      COUNT(*) as count,
      cooperative_id,
      COALESCE(readiness_score, compliance_score, 0) as score,
      child_labor_violations,
      hazardous_work_violations,
      worst_forms_violations
    FROM agrosoluce.child_labor_assessments
    WHERE status = 'completed'
    GROUP BY status, cooperative_id, readiness_score, compliance_score, child_labor_violations, hazardous_work_violations, worst_forms_violations
  ) subq;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create backward compatibility alias
CREATE OR REPLACE FUNCTION agrosoluce.get_compliance_dashboard_stats()
RETURNS JSONB AS $$
BEGIN
  RETURN agrosoluce.get_readiness_dashboard_stats();
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 6: ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on child_labor_assessments
ALTER TABLE agrosoluce.child_labor_assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view child labor assessments" ON agrosoluce.child_labor_assessments;
DROP POLICY IF EXISTS "Cooperative users can insert child labor assessments" ON agrosoluce.child_labor_assessments;
DROP POLICY IF EXISTS "Cooperative users can update their child labor assessments" ON agrosoluce.child_labor_assessments;

-- Policy: Users can view assessments from their cooperative
CREATE POLICY "Users can view child labor assessments"
  ON agrosoluce.child_labor_assessments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agrosoluce.cooperatives c
      JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
      WHERE c.id = child_labor_assessments.cooperative_id
      AND up.user_id = auth.uid()
    )
    OR
    -- Public can view completed assessments (read-only)
    status = 'completed'
    OR
    -- Admins can view all
    EXISTS (
      SELECT 1 FROM agrosoluce.user_profiles
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

-- Policy: Cooperative users can insert assessments
CREATE POLICY "Cooperative users can insert child labor assessments"
  ON agrosoluce.child_labor_assessments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agrosoluce.cooperatives c
      JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
      WHERE c.id = child_labor_assessments.cooperative_id
      AND up.user_id = auth.uid()
    )
  );

-- Policy: Cooperative users can update their assessments
CREATE POLICY "Cooperative users can update their child labor assessments"
  ON agrosoluce.child_labor_assessments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agrosoluce.cooperatives c
      JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
      WHERE c.id = child_labor_assessments.cooperative_id
      AND up.user_id = auth.uid()
    )
  );

-- =============================================
-- STEP 7: TRIGGERS
-- =============================================

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION agrosoluce.update_child_labor_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_child_labor_assessments_updated_at ON agrosoluce.child_labor_assessments;

CREATE TRIGGER update_child_labor_assessments_updated_at
  BEFORE UPDATE ON agrosoluce.child_labor_assessments
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_child_labor_assessments_updated_at();

-- Trigger to sync compliance_score to readiness_score (for backward compatibility)
CREATE OR REPLACE FUNCTION agrosoluce.sync_readiness_score()
RETURNS TRIGGER AS $$
BEGIN
  -- If readiness_score is NULL but compliance_score has a value, copy it
  IF NEW.readiness_score IS NULL AND NEW.compliance_score IS NOT NULL THEN
    NEW.readiness_score := NEW.compliance_score;
  END IF;
  -- If compliance_score is NULL but readiness_score has a value, copy it (for legacy support)
  IF NEW.compliance_score IS NULL AND NEW.readiness_score IS NOT NULL THEN
    NEW.compliance_score := NEW.readiness_score;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_readiness_score_trigger ON agrosoluce.child_labor_assessments;

CREATE TRIGGER sync_readiness_score_trigger
  BEFORE INSERT OR UPDATE ON agrosoluce.child_labor_assessments
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.sync_readiness_score();

-- =============================================
-- STEP 8: GRANTS
-- =============================================

GRANT SELECT ON agrosoluce.child_labor_assessments TO authenticated;
GRANT SELECT ON agrosoluce.child_labor_assessments TO anon; -- Read-only for anonymous
GRANT INSERT, UPDATE ON agrosoluce.child_labor_assessments TO authenticated;

GRANT SELECT ON agrosoluce.cooperative_readiness_status TO authenticated;
GRANT SELECT ON agrosoluce.cooperative_readiness_status TO anon; -- Read-only for anonymous

-- =============================================
-- STEP 9: COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.child_labor_assessments IS 'Child labor monitoring assessments. readiness_score is a self-assessment metric, not a compliance determination.';
COMMENT ON COLUMN agrosoluce.child_labor_assessments.readiness_score IS 'Self-assessment readiness score (0-100). This is NOT a compliance determination - it reflects documentation and self-reported data quality.';
COMMENT ON COLUMN agrosoluce.child_labor_assessments.compliance_score IS 'Legacy field for backward compatibility. Use readiness_score instead.';
COMMENT ON VIEW agrosoluce.cooperative_readiness_status IS 'View showing latest readiness status for each cooperative. Scores are self-assessments, not compliance determinations.';
COMMENT ON FUNCTION agrosoluce.get_readiness_dashboard_stats() IS 'Returns dashboard statistics using readiness terminology. Scores are self-assessments, not compliance determinations.';

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Note: The compliance_score column is kept for backward compatibility.
-- Applications should migrate to using readiness_score.
-- The trigger sync_readiness_score_trigger keeps both columns in sync.


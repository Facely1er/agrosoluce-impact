-- =====================================================
-- AGROSOLUCE® CHILD LABOR MONITORING MODULE
-- Database Schema for Supabase PostgreSQL
-- =====================================================
-- Version: 1.0
-- Created: December 2024
-- Purpose: Track child labor compliance, remediation, and social impact
-- =====================================================

-- =====================================================
-- 1. ENUMERATIONS
-- =====================================================

-- Verification methods for age confirmation
CREATE TYPE age_verification_method AS ENUM (
  'birth_certificate',
  'national_id',
  'school_records',
  'biometric',
  'visual_estimate',
  'parent_attestation'
);

-- Violation severity levels
CREATE TYPE violation_severity AS ENUM (
  'none',
  'minor',
  'moderate',
  'severe',
  'critical'
);

-- Remediation status tracking
CREATE TYPE remediation_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'verified',
  'failed'
);

-- Assessment status workflow
CREATE TYPE assessment_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'verified',
  'expired',
  'disputed'
);

-- International certification types
CREATE TYPE labor_certification AS ENUM (
  'fair_trade',
  'rainforest_alliance',
  'ilo_140_compliant',
  'child_labor_free',
  'usda_organic',
  'eu_organic',
  'globalgap'
);

-- =====================================================
-- 2. CORE TABLES
-- =====================================================

-- -------------------------------------------------------
-- Child Labor Assessments
-- -------------------------------------------------------
CREATE TABLE child_labor_assessments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES auth.users(id),
  
  -- Assessment Details
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  assessment_period_start DATE NOT NULL,
  assessment_period_end DATE NOT NULL,
  status assessment_status NOT NULL DEFAULT 'scheduled',
  
  -- School Enrollment Data
  total_children_in_community INTEGER NOT NULL DEFAULT 0,
  children_enrolled_school INTEGER NOT NULL DEFAULT 0,
  school_enrollment_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_children_in_community > 0 
      THEN (children_enrolled_school::DECIMAL / total_children_in_community * 100)
      ELSE 0 
    END
  ) STORED,
  
  -- Labor Verification
  minimum_working_age INTEGER NOT NULL DEFAULT 16,
  total_workers_assessed INTEGER NOT NULL DEFAULT 0,
  underage_workers_found INTEGER NOT NULL DEFAULT 0,
  age_verification_method age_verification_method NOT NULL,
  
  -- Violations
  child_labor_violations INTEGER NOT NULL DEFAULT 0,
  hazardous_work_violations INTEGER NOT NULL DEFAULT 0,
  worst_forms_violations INTEGER NOT NULL DEFAULT 0, -- ILO Convention 182
  violation_severity violation_severity NOT NULL DEFAULT 'none',
  violation_details JSONB DEFAULT '[]'::jsonb,
  
  -- Compliance Score (0-100)
  compliance_score DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_children_in_community = 0 THEN 100
      ELSE GREATEST(0, 100 - (
        (child_labor_violations * 10) + 
        (hazardous_work_violations * 15) + 
        (worst_forms_violations * 25)
      ))
    END
  ) STORED,
  
  -- Supporting Evidence
  evidence_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  photographs TEXT[] DEFAULT ARRAY[]::TEXT[],
  witness_statements JSONB DEFAULT '[]'::jsonb,
  
  -- Assessor Information
  assessor_name VARCHAR(200) NOT NULL,
  assessor_organization VARCHAR(200),
  assessor_certification VARCHAR(200),
  assessor_notes TEXT,
  
  -- Next Assessment
  next_assessment_due DATE,
  assessment_frequency_months INTEGER DEFAULT 6,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT valid_children_count CHECK (children_enrolled_school <= total_children_in_community),
  CONSTRAINT valid_workers CHECK (underage_workers_found <= total_workers_assessed),
  CONSTRAINT valid_violations CHECK (
    child_labor_violations >= 0 AND 
    hazardous_work_violations >= 0 AND 
    worst_forms_violations >= 0
  ),
  CONSTRAINT valid_assessment_period CHECK (assessment_period_end >= assessment_period_start)
);

-- -------------------------------------------------------
-- Remediation Actions
-- -------------------------------------------------------
CREATE TABLE remediation_actions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  assessment_id UUID NOT NULL REFERENCES child_labor_assessments(id) ON DELETE CASCADE,
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  
  -- Action Details
  action_type VARCHAR(100) NOT NULL, -- e.g., 'school_enrollment', 'family_support', 'alternative_employment'
  description TEXT NOT NULL,
  target_beneficiaries INTEGER NOT NULL,
  actual_beneficiaries INTEGER DEFAULT 0,
  
  -- Status Tracking
  status remediation_status NOT NULL DEFAULT 'not_started',
  start_date DATE NOT NULL,
  target_completion_date DATE NOT NULL,
  actual_completion_date DATE,
  
  -- Financial Data
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  funding_source VARCHAR(200),
  
  -- Progress Tracking
  progress_percentage INTEGER DEFAULT 0,
  progress_notes JSONB DEFAULT '[]'::jsonb,
  
  -- Outcomes
  children_returned_to_school INTEGER DEFAULT 0,
  families_supported INTEGER DEFAULT 0,
  income_improvement_percentage DECIMAL(5,2),
  alternative_jobs_created INTEGER DEFAULT 0,
  
  -- Supporting Evidence
  evidence_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  progress_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  beneficiary_testimonials JSONB DEFAULT '[]'::jsonb,
  
  -- Responsible Parties
  responsible_person VARCHAR(200) NOT NULL,
  responsible_organization VARCHAR(200),
  partner_organizations TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT valid_beneficiaries CHECK (actual_beneficiaries <= target_beneficiaries),
  CONSTRAINT valid_progress CHECK (progress_percentage BETWEEN 0 AND 100),
  CONSTRAINT valid_dates CHECK (target_completion_date >= start_date),
  CONSTRAINT valid_costs CHECK (
    (estimated_cost IS NULL OR estimated_cost >= 0) AND 
    (actual_cost IS NULL OR actual_cost >= 0)
  )
);

-- -------------------------------------------------------
-- Labor Certifications
-- -------------------------------------------------------
CREATE TABLE labor_certifications (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  
  -- Certification Details
  certification_type labor_certification NOT NULL,
  certification_number VARCHAR(100) UNIQUE,
  issuing_organization VARCHAR(200) NOT NULL,
  
  -- Validity Period
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN GENERATED ALWAYS AS (expiry_date >= CURRENT_DATE) STORED,
  
  -- Audit Information
  last_audit_date DATE,
  next_audit_date DATE,
  audit_score DECIMAL(5,2),
  audit_findings JSONB DEFAULT '[]'::jsonb,
  
  -- Supporting Documents
  certificate_document_url TEXT,
  audit_report_url TEXT,
  supporting_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Conditions & Notes
  certification_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  
  -- Renewal Tracking
  renewal_status VARCHAR(50) DEFAULT 'active', -- active, pending, expired, suspended
  renewal_application_date DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_cert_period CHECK (expiry_date > issue_date),
  CONSTRAINT valid_audit_score CHECK (audit_score IS NULL OR audit_score BETWEEN 0 AND 100)
);

-- -------------------------------------------------------
-- Social Impact Metrics
-- -------------------------------------------------------
CREATE TABLE social_impact_metrics (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  
  -- Measurement Period
  measurement_date DATE NOT NULL,
  measurement_period_start DATE NOT NULL,
  measurement_period_end DATE NOT NULL,
  
  -- Education Impact
  children_enrolled_total INTEGER DEFAULT 0,
  children_enrolled_new INTEGER DEFAULT 0,
  school_attendance_rate DECIMAL(5,2),
  scholarship_recipients INTEGER DEFAULT 0,
  schools_built_or_renovated INTEGER DEFAULT 0,
  
  -- Economic Impact
  family_income_increase_avg DECIMAL(12,2),
  family_income_increase_percentage DECIMAL(5,2),
  families_receiving_assistance INTEGER DEFAULT 0,
  microloans_provided INTEGER DEFAULT 0,
  microloan_total_value DECIMAL(12,2),
  
  -- Employment Impact
  youth_jobs_created INTEGER DEFAULT 0,
  adult_jobs_created INTEGER DEFAULT 0,
  women_employed INTEGER DEFAULT 0,
  vocational_training_participants INTEGER DEFAULT 0,
  
  -- Health & Wellbeing
  families_receiving_healthcare INTEGER DEFAULT 0,
  nutrition_programs_participants INTEGER DEFAULT 0,
  safe_drinking_water_access_families INTEGER DEFAULT 0,
  
  -- Community Development
  community_projects_completed INTEGER DEFAULT 0,
  community_infrastructure_investments DECIMAL(12,2),
  cooperative_member_satisfaction_score DECIMAL(3,2), -- 0-5 scale
  
  -- Comparative Data
  baseline_measurement_id UUID REFERENCES social_impact_metrics(id),
  year_over_year_improvement JSONB DEFAULT '{}'::jsonb,
  
  -- Verification
  verified_by VARCHAR(200),
  verification_date DATE,
  verification_method VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_measurement_period CHECK (measurement_period_end >= measurement_period_start),
  CONSTRAINT valid_percentages CHECK (
    (school_attendance_rate IS NULL OR school_attendance_rate BETWEEN 0 AND 100) AND
    (family_income_increase_percentage IS NULL OR family_income_increase_percentage >= 0)
  ),
  CONSTRAINT valid_satisfaction CHECK (
    cooperative_member_satisfaction_score IS NULL OR 
    cooperative_member_satisfaction_score BETWEEN 0 AND 5
  )
);

-- -------------------------------------------------------
-- Child Labor Incidents (for tracking and investigation)
-- -------------------------------------------------------
CREATE TABLE child_labor_incidents (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  cooperative_id UUID NOT NULL REFERENCES cooperatives(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES child_labor_assessments(id),
  
  -- Incident Details
  incident_date DATE NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  incident_description TEXT NOT NULL,
  severity violation_severity NOT NULL,
  
  -- Affected Individuals
  children_affected INTEGER NOT NULL,
  age_range_min INTEGER,
  age_range_max INTEGER,
  
  -- Location
  incident_location TEXT,
  gps_coordinates POINT,
  
  -- Reporting
  reported_by VARCHAR(200) NOT NULL,
  reporter_organization VARCHAR(200),
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  report_method VARCHAR(100), -- e.g., 'hotline', 'inspection', 'community_report'
  
  -- Investigation
  investigation_status VARCHAR(50) DEFAULT 'pending', -- pending, ongoing, completed, closed
  investigation_start_date DATE,
  investigation_completion_date DATE,
  investigator_name VARCHAR(200),
  investigation_findings TEXT,
  
  -- Resolution
  resolution_status VARCHAR(50) DEFAULT 'unresolved', -- unresolved, resolved, partially_resolved
  resolution_date DATE,
  resolution_details TEXT,
  corrective_actions JSONB DEFAULT '[]'::jsonb,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT true,
  next_follow_up_date DATE,
  follow_up_notes TEXT,
  
  -- Supporting Evidence
  evidence_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  witness_statements JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_age_range CHECK (age_range_max IS NULL OR age_range_min IS NULL OR age_range_max >= age_range_min),
  CONSTRAINT valid_investigation_dates CHECK (
    investigation_completion_date IS NULL OR 
    investigation_start_date IS NULL OR 
    investigation_completion_date >= investigation_start_date
  )
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

-- Child Labor Assessments Indexes
CREATE INDEX idx_assessments_cooperative ON child_labor_assessments(cooperative_id);
CREATE INDEX idx_assessments_date ON child_labor_assessments(assessment_date DESC);
CREATE INDEX idx_assessments_status ON child_labor_assessments(status);
CREATE INDEX idx_assessments_compliance_score ON child_labor_assessments(compliance_score DESC);
CREATE INDEX idx_assessments_next_due ON child_labor_assessments(next_assessment_due) WHERE next_assessment_due IS NOT NULL;

-- Remediation Actions Indexes
CREATE INDEX idx_remediation_cooperative ON remediation_actions(cooperative_id);
CREATE INDEX idx_remediation_assessment ON remediation_actions(assessment_id);
CREATE INDEX idx_remediation_status ON remediation_actions(status);
CREATE INDEX idx_remediation_dates ON remediation_actions(start_date, target_completion_date);

-- Certifications Indexes
CREATE INDEX idx_certifications_cooperative ON labor_certifications(cooperative_id);
CREATE INDEX idx_certifications_type ON labor_certifications(certification_type);
CREATE INDEX idx_certifications_active ON labor_certifications(is_active) WHERE is_active = true;
CREATE INDEX idx_certifications_expiry ON labor_certifications(expiry_date);

-- Social Impact Indexes
CREATE INDEX idx_impact_cooperative ON social_impact_metrics(cooperative_id);
CREATE INDEX idx_impact_date ON social_impact_metrics(measurement_date DESC);
CREATE INDEX idx_impact_baseline ON social_impact_metrics(baseline_measurement_id) WHERE baseline_measurement_id IS NOT NULL;

-- Incidents Indexes
CREATE INDEX idx_incidents_cooperative ON child_labor_incidents(cooperative_id);
CREATE INDEX idx_incidents_date ON child_labor_incidents(incident_date DESC);
CREATE INDEX idx_incidents_severity ON child_labor_incidents(severity);
CREATE INDEX idx_incidents_status ON child_labor_incidents(investigation_status);
CREATE INDEX idx_incidents_gps ON child_labor_incidents USING GIST(gps_coordinates) WHERE gps_coordinates IS NOT NULL;

-- =====================================================
-- 4. ROW-LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE child_labor_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_labor_incidents ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Assessments Policies
-- -------------------------------------------------------

-- Authenticated users can view assessments for cooperatives they have access to
CREATE POLICY "Users can view assessments for their cooperatives"
  ON child_labor_assessments FOR SELECT
  TO authenticated
  USING (
    cooperative_id IN (
      SELECT id FROM cooperatives 
      WHERE id = cooperative_id
      -- Add your organization membership logic here
    )
  );

-- Assessors can insert assessments
CREATE POLICY "Assessors can create assessments"
  ON child_labor_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = assessor_id);

-- Assessors can update their own assessments
CREATE POLICY "Assessors can update their assessments"
  ON child_labor_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = assessor_id);

-- -------------------------------------------------------
-- Remediation Actions Policies
-- -------------------------------------------------------

CREATE POLICY "Users can view remediation actions"
  ON remediation_actions FOR SELECT
  TO authenticated
  USING (
    cooperative_id IN (
      SELECT id FROM cooperatives
    )
  );

CREATE POLICY "Authenticated users can create remediation actions"
  ON remediation_actions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update remediation actions"
  ON remediation_actions FOR UPDATE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- Certifications Policies
-- -------------------------------------------------------

CREATE POLICY "Anyone can view active certifications"
  ON labor_certifications FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage certifications"
  ON labor_certifications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -------------------------------------------------------
-- Social Impact Policies
-- -------------------------------------------------------

CREATE POLICY "Anyone can view social impact metrics"
  ON social_impact_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage impact metrics"
  ON social_impact_metrics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -------------------------------------------------------
-- Incidents Policies
-- -------------------------------------------------------

-- Restrict incident viewing to authenticated users only
CREATE POLICY "Authenticated users can view incidents"
  ON child_labor_incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can report incidents"
  ON child_labor_incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update incidents"
  ON child_labor_incidents FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- 5. TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON child_labor_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_remediation_updated_at
  BEFORE UPDATE ON remediation_actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON labor_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_impact_updated_at
  BEFORE UPDATE ON social_impact_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON child_labor_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. USEFUL VIEWS FOR REPORTING
-- =====================================================

-- View: Current compliance status per cooperative
CREATE OR REPLACE VIEW cooperative_compliance_status AS
SELECT 
  c.id AS cooperative_id,
  c.name AS cooperative_name,
  c.region,
  c.department,
  cla.id AS latest_assessment_id,
  cla.assessment_date,
  cla.compliance_score,
  cla.violation_severity,
  cla.children_enrolled_school,
  cla.school_enrollment_rate,
  cla.child_labor_violations,
  cla.next_assessment_due,
  CASE 
    WHEN cla.compliance_score >= 90 THEN 'Excellent'
    WHEN cla.compliance_score >= 75 THEN 'Good'
    WHEN cla.compliance_score >= 60 THEN 'Fair'
    ELSE 'Poor'
  END AS compliance_rating,
  COUNT(lc.id) AS active_certifications
FROM cooperatives c
LEFT JOIN LATERAL (
  SELECT * FROM child_labor_assessments
  WHERE cooperative_id = c.id
  ORDER BY assessment_date DESC
  LIMIT 1
) cla ON true
LEFT JOIN labor_certifications lc ON lc.cooperative_id = c.id AND lc.is_active = true
GROUP BY c.id, c.name, c.region, c.department, cla.id, cla.assessment_date, 
         cla.compliance_score, cla.violation_severity, cla.children_enrolled_school,
         cla.school_enrollment_rate, cla.child_labor_violations, cla.next_assessment_due;

-- View: Social impact summary
CREATE OR REPLACE VIEW social_impact_summary AS
SELECT 
  cooperative_id,
  SUM(children_enrolled_new) AS total_children_enrolled,
  SUM(youth_jobs_created) AS total_youth_jobs,
  AVG(family_income_increase_percentage) AS avg_income_increase,
  SUM(families_receiving_assistance) AS total_families_helped,
  COUNT(*) AS measurement_count
FROM social_impact_metrics
WHERE measurement_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY cooperative_id;

-- =====================================================
-- 7. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- This section would contain INSERT statements for sample data
-- Uncomment and modify as needed for testing

/*
-- Sample assessment
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  total_children_in_community,
  children_enrolled_school,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  assessor_name,
  next_assessment_due
) VALUES (
  'your-cooperative-uuid-here',
  NOW(),
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE,
  150,
  145,
  16,
  200,
  0,
  'birth_certificate',
  0,
  'Jean-Baptiste Kouassi',
  CURRENT_DATE + INTERVAL '6 months'
);
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
-- This schema provides comprehensive child labor monitoring
-- compatible with ILO Convention 182, Fair Trade standards,
-- and EUDR requirements for Côte d'Ivoire cooperatives.
-- =====================================================

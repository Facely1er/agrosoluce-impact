-- Migration: Add Assessment Tables
-- This migration creates tables for storing farm readiness assessments
-- Uses the 'agrosoluce' schema to avoid conflicts with other projects

-- =============================================
-- MIGRATION METADATA
-- =============================================

-- Insert this migration record
INSERT INTO agrosoluce.migrations (migration_name, description) 
VALUES ('019_add_assessment_tables', 'Add assessment tables for AgroSoluce Farm Assessment Module')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- ASSESSMENT TABLES
-- =============================================

-- Assessment tables
CREATE TABLE IF NOT EXISTS agrosoluce.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id uuid NOT NULL REFERENCES agrosoluce.canonical_cooperative_directory(coop_id) ON DELETE CASCADE,
  assessment_data jsonb NOT NULL,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  section_scores jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  toolkit_ready boolean DEFAULT false,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Assessment responses for detailed tracking
CREATE TABLE IF NOT EXISTS agrosoluce.assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES agrosoluce.assessments(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  response_value text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 3),
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_assessments_cooperative_id ON agrosoluce.assessments(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON agrosoluce.assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessments_toolkit_ready ON agrosoluce.assessments(toolkit_ready);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id ON agrosoluce.assessment_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_question_id ON agrosoluce.assessment_responses(question_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE agrosoluce.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrosoluce.assessment_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migrations)
DROP POLICY IF EXISTS "Anyone can view assessments" ON agrosoluce.assessments;
DROP POLICY IF EXISTS "Authenticated users can insert assessments" ON agrosoluce.assessments;
DROP POLICY IF EXISTS "Authenticated users can update assessments" ON agrosoluce.assessments;
DROP POLICY IF EXISTS "Anyone can view assessment responses" ON agrosoluce.assessment_responses;
DROP POLICY IF EXISTS "Authenticated users can insert assessment responses" ON agrosoluce.assessment_responses;

-- Policy: Anyone can view assessments (public assessment results)
CREATE POLICY "Anyone can view assessments" 
  ON agrosoluce.assessments
  FOR SELECT 
  USING (true);

-- Policy: Authenticated users can insert assessments
CREATE POLICY "Authenticated users can insert assessments" 
  ON agrosoluce.assessments
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update their own assessments
CREATE POLICY "Authenticated users can update assessments" 
  ON agrosoluce.assessments
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy: Anyone can view assessment responses
CREATE POLICY "Anyone can view assessment responses" 
  ON agrosoluce.assessment_responses
  FOR SELECT 
  USING (true);

-- Policy: Authenticated users can insert assessment responses
CREATE POLICY "Authenticated users can insert assessment responses" 
  ON agrosoluce.assessment_responses
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- TRIGGERS
-- =============================================

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION agrosoluce.update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (for idempotent migrations)
DROP TRIGGER IF EXISTS update_assessments_updated_at ON agrosoluce.assessments;

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON agrosoluce.assessments
  FOR EACH ROW
  EXECUTE FUNCTION agrosoluce.update_assessments_updated_at();

-- =============================================
-- GRANTS
-- =============================================

GRANT ALL ON agrosoluce.assessments TO authenticated;
GRANT SELECT ON agrosoluce.assessments TO anon; -- Read-only for anonymous users
GRANT ALL ON agrosoluce.assessment_responses TO authenticated;
GRANT SELECT ON agrosoluce.assessment_responses TO anon; -- Read-only for anonymous users

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE agrosoluce.assessments IS 'Stores farm readiness assessment results for cooperatives';
COMMENT ON TABLE agrosoluce.assessment_responses IS 'Stores individual question responses for each assessment';
COMMENT ON COLUMN agrosoluce.assessments.assessment_data IS 'JSONB containing all assessment responses and metadata';
COMMENT ON COLUMN agrosoluce.assessments.section_scores IS 'JSONB object with section IDs as keys and scores (0-100) as values';
COMMENT ON COLUMN agrosoluce.assessments.recommendations IS 'JSONB array of recommendation objects with priority, category, and action items';


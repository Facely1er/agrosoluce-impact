-- =====================================================
-- SAMPLE CHILD LABOR ASSESSMENT DATA
-- For AgroSoluce Child Labor Monitoring Module
-- =====================================================
-- 
-- This script creates 10 sample assessments with realistic data
-- for Côte d'Ivoire cooperatives.
--
-- Distribution:
-- - 5 excellent (90-100 score)
-- - 3 good (75-89 score)
-- - 2 fair (60-74 score)
--
-- Run this in Supabase SQL Editor after deploying the schema
-- =====================================================

-- First, let's get some cooperative IDs (adjust if needed)
-- This assumes you have cooperatives in your database
-- If not, you'll need to create some cooperatives first

-- Sample Assessment 1: Excellent (Score: 95)
-- Cooperative: Cocoa Excellence Cooperative
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  violation_details,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months,
  evidence_documents,
  photographs,
  witness_statements
)
SELECT 
  id,
  CURRENT_DATE,
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE,
  'completed',
  180,
  175,
  97.2,
  16,
  250,
  0,
  'birth_certificate',
  0,
  0,
  0,
  'none',
  '[]'::jsonb,
  95,
  'Jean-Baptiste Kouassi',
  'ILO - International Labour Organization',
  'Excellent compliance. All children enrolled in school. Strong community support for education.',
  CURRENT_DATE + INTERVAL '6 months',
  6,
  ARRAY[]::text[],
  ARRAY[]::text[],
  '[]'::jsonb
FROM cooperatives
WHERE region = 'Lagunes' OR region = 'Haut-Sassandra'
LIMIT 1;

-- Sample Assessment 2: Excellent (Score: 92)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  violation_details,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 month',
  CURRENT_DATE - INTERVAL '7 months',
  CURRENT_DATE - INTERVAL '1 month',
  'verified',
  150,
  144,
  96.0,
  16,
  200,
  0,
  'national_id',
  0,
  0,
  0,
  'none',
  '[]'::jsonb,
  92,
  'Marie-Claire Adou',
  'Ministry of Employment and Social Protection',
  'Very good compliance. Minor improvements needed in documentation.',
  CURRENT_DATE + INTERVAL '5 months',
  6
FROM cooperatives
WHERE region = 'Vallée du Bandama' OR region = 'Gbêkê'
LIMIT 1;

-- Sample Assessment 3: Excellent (Score: 98)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '2 months',
  CURRENT_DATE - INTERVAL '8 months',
  CURRENT_DATE - INTERVAL '2 months',
  'verified',
  220,
  218,
  99.1,
  16,
  300,
  0,
  'biometric',
  0,
  0,
  0,
  'none',
  98,
  'Dr. Amadou Diallo',
  'Fair Trade International',
  'Outstanding compliance. Model cooperative for child labor-free practices.',
  CURRENT_DATE + INTERVAL '4 months',
  6
FROM cooperatives
WHERE region = 'Indénié-Djuablin' OR region = 'Lacs'
LIMIT 1;

-- Sample Assessment 4: Excellent (Score: 90)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  compliance_score,
  assessor_name,
  assessor_organization,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '3 months',
  CURRENT_DATE - INTERVAL '9 months',
  CURRENT_DATE - INTERVAL '3 months',
  'completed',
  120,
  114,
  95.0,
  16,
  180,
  0,
  'school_records',
  0,
  0,
  0,
  'none',
  90,
  'Kouassi Yao',
  'Rainforest Alliance',
  CURRENT_DATE + INTERVAL '3 months',
  6
FROM cooperatives
WHERE region = 'Gbôklé' OR region = 'Nawa'
LIMIT 1;

-- Sample Assessment 5: Excellent (Score: 94)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  compliance_score,
  assessor_name,
  assessor_organization,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 week',
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE - INTERVAL '1 week',
  'completed',
  200,
  192,
  96.0,
  16,
  280,
  0,
  'birth_certificate',
  0,
  0,
  0,
  'none',
  94,
  'Fatou Diabaté',
  'UTZ Certified',
  CURRENT_DATE + INTERVAL '6 months',
  6
FROM cooperatives
WHERE region = 'Cavally' OR region = 'Guémon'
LIMIT 1;

-- Sample Assessment 6: Good (Score: 82)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  violation_details,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '2 weeks',
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE - INTERVAL '2 weeks',
  'completed',
  160,
  144,
  90.0,
  16,
  220,
  2,
  'visual_estimate',
  2,
  0,
  0,
  'minor',
  '[
    {
      "id": "1",
      "type": "age_verification_issue",
      "description": "Two workers could not provide birth certificates, age verified by school records",
      "severity": "minor",
      "date": "' || (CURRENT_DATE - INTERVAL '1 month')::text || '",
      "childrenAffected": 2,
      "evidence": []
    }
  ]'::jsonb,
  82,
  'Yao Kouamé',
  'Ministry of Employment and Social Protection',
  'Good compliance overall. Need to improve age verification documentation.',
  CURRENT_DATE + INTERVAL '6 months',
  6
FROM cooperatives
WHERE region = 'Marahoué' OR region = 'Béré'
LIMIT 1;

-- Sample Assessment 7: Good (Score: 78)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 month',
  CURRENT_DATE - INTERVAL '7 months',
  CURRENT_DATE - INTERVAL '1 month',
  'completed',
  140,
  126,
  90.0,
  16,
  190,
  1,
  'parent_attestation',
  1,
  0,
  0,
  'minor',
  78,
  'Aminata Traoré',
  'ILO - International Labour Organization',
  'Good progress. School enrollment improving. One case of underage worker found and addressed.',
  CURRENT_DATE + INTERVAL '5 months',
  6
FROM cooperatives
WHERE region = 'Gôh' OR region = 'Iffou'
LIMIT 1;

-- Sample Assessment 8: Good (Score: 85)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  compliance_score,
  assessor_name,
  assessor_organization,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '3 weeks',
  CURRENT_DATE - INTERVAL '6 months',
  CURRENT_DATE - INTERVAL '3 weeks',
  'completed',
  170,
  153,
  90.0,
  16,
  240,
  0,
  'national_id',
  0,
  0,
  0,
  'none',
  85,
  'Koffi N''Guessan',
  'Rainforest Alliance',
  CURRENT_DATE + INTERVAL '5 months',
  6
FROM cooperatives
WHERE region = 'Kabadougou' OR region = 'Folon'
LIMIT 1;

-- Sample Assessment 9: Fair (Score: 68)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  violation_details,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '2 months',
  CURRENT_DATE - INTERVAL '8 months',
  CURRENT_DATE - INTERVAL '2 months',
  'completed',
  130,
  104,
  80.0,
  16,
  180,
  5,
  'visual_estimate',
  5,
  1,
  0,
  'moderate',
  '[
    {
      "id": "1",
      "type": "child_labor",
      "description": "Five children under 16 found working during harvest season",
      "severity": "moderate",
      "date": "' || (CURRENT_DATE - INTERVAL '3 months')::text || '",
      "location": "Harvest fields",
      "childrenAffected": 5,
      "evidence": []
    },
    {
      "id": "2",
      "type": "hazardous_work",
      "description": "One child found using machete for harvesting",
      "severity": "moderate",
      "date": "' || (CURRENT_DATE - INTERVAL '2 months')::text || '",
      "location": "Harvest fields",
      "childrenAffected": 1,
      "evidence": []
    }
  ]'::jsonb,
  68,
  'Dr. Sékou Touré',
  'Ministry of Employment and Social Protection',
  'Needs improvement. Several violations found. Remediation plan required.',
  CURRENT_DATE + INTERVAL '4 months',
  6
FROM cooperatives
WHERE region = 'Poro' OR region = 'Bagoué'
LIMIT 1;

-- Sample Assessment 10: Fair (Score: 65)
INSERT INTO child_labor_assessments (
  cooperative_id,
  assessment_date,
  assessment_period_start,
  assessment_period_end,
  status,
  total_children_in_community,
  children_enrolled_school,
  school_enrollment_rate,
  minimum_working_age,
  total_workers_assessed,
  underage_workers_found,
  age_verification_method,
  child_labor_violations,
  hazardous_work_violations,
  worst_forms_violations,
  violation_severity,
  violation_details,
  compliance_score,
  assessor_name,
  assessor_organization,
  assessor_notes,
  next_assessment_due,
  assessment_frequency_months
)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 month',
  CURRENT_DATE - INTERVAL '7 months',
  CURRENT_DATE - INTERVAL '1 month',
  'completed',
  110,
  88,
  80.0,
  16,
  150,
  4,
  'parent_attestation',
  4,
  2,
  0,
  'moderate',
  '[
    {
      "id": "1",
      "type": "child_labor",
      "description": "Four children under 16 working during peak season",
      "severity": "moderate",
      "date": "' || (CURRENT_DATE - INTERVAL '2 months')::text || '",
      "childrenAffected": 4,
      "evidence": []
    },
    {
      "id": "2",
      "type": "hazardous_work",
      "description": "Two children found performing hazardous tasks",
      "severity": "moderate",
      "date": "' || (CURRENT_DATE - INTERVAL '1 month')::text || '",
      "childrenAffected": 2,
      "evidence": []
    }
  ]'::jsonb,
  65,
  'Mariam Koné',
  'ILO - International Labour Organization',
  'Fair compliance. Multiple violations require immediate remediation. School enrollment below target.',
  CURRENT_DATE + INTERVAL '5 months',
  6
FROM cooperatives
WHERE region = 'Tchologo' OR region = 'Bagoué'
LIMIT 1;

-- =====================================================
-- SAMPLE SOCIAL IMPACT METRICS
-- =====================================================

-- Add social impact metrics for the excellent cooperatives
INSERT INTO social_impact_metrics (
  cooperative_id,
  measurement_date,
  measurement_period_start,
  measurement_period_end,
  children_enrolled_total,
  children_enrolled_new,
  school_attendance_rate,
  scholarship_recipients,
  schools_built_or_renovated,
  family_income_increase_avg,
  family_income_increase_percentage,
  families_receiving_assistance,
  microloans_provided,
  microloan_total_value,
  youth_jobs_created,
  adult_jobs_created,
  women_employed,
  vocational_training_participants,
  families_receiving_healthcare,
  nutrition_programs_participants,
  safe_drinking_water_access_families,
  community_projects_completed,
  community_infrastructure_investments,
  cooperative_member_satisfaction_score,
  year_over_year_improvement
)
SELECT 
  c.id,
  CURRENT_DATE,
  CURRENT_DATE - INTERVAL '1 year',
  CURRENT_DATE,
  175,
  25,
  96.5,
  12,
  1,
  150000,
  18.5,
  45,
  8,
  2400000,
  3,
  15,
  8,
  20,
  30,
  25,
  40,
  2,
  5000000,
  4.5,
  '{"children_enrolled": 15, "school_attendance": 2.5, "income_increase": 3.2}'::jsonb
FROM cooperatives c
INNER JOIN child_labor_assessments a ON c.id = a.cooperative_id
WHERE a.compliance_score >= 90
LIMIT 5;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check the inserted data
SELECT 
  c.name as cooperative_name,
  c.region,
  a.compliance_score,
  a.status,
  a.assessor_name,
  a.assessment_date
FROM child_labor_assessments a
JOIN cooperatives c ON a.cooperative_id = c.id
ORDER BY a.compliance_score DESC;

-- Summary statistics
SELECT 
  COUNT(*) as total_assessments,
  AVG(compliance_score) as avg_score,
  COUNT(CASE WHEN compliance_score >= 90 THEN 1 END) as excellent_count,
  COUNT(CASE WHEN compliance_score >= 75 AND compliance_score < 90 THEN 1 END) as good_count,
  COUNT(CASE WHEN compliance_score >= 60 AND compliance_score < 75 THEN 1 END) as fair_count,
  COUNT(CASE WHEN compliance_score < 60 THEN 1 END) as poor_count
FROM child_labor_assessments;


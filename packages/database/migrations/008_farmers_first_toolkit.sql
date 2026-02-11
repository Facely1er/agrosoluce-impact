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


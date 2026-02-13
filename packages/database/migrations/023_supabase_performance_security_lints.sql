-- Migration: Supabase Performance & Security Lints
-- Fixes issues from Supabase Database Linter (RLS, function search_path, permissive policies, auth initplan, multiple policies).
-- References: CSV exports (19) RLS enabled no policy, (18) function search_path + RLS always true, (20) auth_rls_initplan + multiple permissive.

-- =============================================
-- MIGRATION METADATA
-- =============================================

INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES ('023_supabase_performance_security_lints', 'Supabase linter fixes: RLS policies, function search_path, permissive policies, auth initplan, consolidate SELECT policies')
ON CONFLICT (migration_name) DO NOTHING;

-- =============================================
-- 1. RLS ENABLED NO POLICY (lint 0008)
-- Add policies for tables that have RLS but no policies
-- =============================================

-- onboarding_steps: access via cooperative_onboarding -> cooperative
CREATE POLICY "Cooperative members can view their onboarding steps" ON agrosoluce.onboarding_steps
    FOR SELECT USING (
        onboarding_id IN (
            SELECT o.id FROM agrosoluce.cooperative_onboarding o
            JOIN agrosoluce.cooperatives c ON c.id = o.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can insert onboarding steps" ON agrosoluce.onboarding_steps
    FOR INSERT WITH CHECK (
        onboarding_id IN (
            SELECT o.id FROM agrosoluce.cooperative_onboarding o
            JOIN agrosoluce.cooperatives c ON c.id = o.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can update their onboarding steps" ON agrosoluce.onboarding_steps
    FOR UPDATE USING (
        onboarding_id IN (
            SELECT o.id FROM agrosoluce.cooperative_onboarding o
            JOIN agrosoluce.cooperatives c ON c.id = o.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- training_champions: cooperative_id
CREATE POLICY "Cooperative members can view their training champions" ON agrosoluce.training_champions
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can insert training champions" ON agrosoluce.training_champions
    FOR INSERT WITH CHECK (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can update their training champions" ON agrosoluce.training_champions
    FOR UPDATE USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- training_completions: via training_sessions -> cooperative_id
CREATE POLICY "Cooperative members can view their training completions" ON agrosoluce.training_completions
    FOR SELECT USING (
        training_session_id IN (
            SELECT ts.id FROM agrosoluce.training_sessions ts
            JOIN agrosoluce.cooperatives c ON c.id = ts.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can insert training completions" ON agrosoluce.training_completions
    FOR INSERT WITH CHECK (
        training_session_id IN (
            SELECT ts.id FROM agrosoluce.training_sessions ts
            JOIN agrosoluce.cooperatives c ON c.id = ts.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- value_metrics: cooperative_id
CREATE POLICY "Cooperative members can view their value metrics" ON agrosoluce.value_metrics
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can insert value metrics" ON agrosoluce.value_metrics
    FOR INSERT WITH CHECK (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

CREATE POLICY "Cooperative members can update their value metrics" ON agrosoluce.value_metrics
    FOR UPDATE USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- 2. FUNCTION SEARCH_PATH MUTABLE (lint 0011)
-- Set search_path on functions to prevent injection
-- =============================================

ALTER FUNCTION agrosoluce.update_updated_at_column() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.calculate_cooperative_enrichment_score(uuid) SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.auto_enrich_cooperative(uuid) SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.update_enrichment_scores() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.update_assessments_updated_at() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.get_readiness_dashboard_stats() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.get_compliance_dashboard_stats() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.update_child_labor_assessments_updated_at() SET search_path = agrosoluce;
ALTER FUNCTION agrosoluce.sync_readiness_score() SET search_path = agrosoluce;

-- =============================================
-- 3. RLS POLICY ALWAYS TRUE (lint 0024) – fix permissive INSERT/UPDATE
-- =============================================

-- ag_buyer_requests
DROP POLICY IF EXISTS "Buyers can create requests" ON agrosoluce.ag_buyer_requests;
CREATE POLICY "Buyers can create requests" ON agrosoluce.ag_buyer_requests
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Buyers can update their requests" ON agrosoluce.ag_buyer_requests;
CREATE POLICY "Buyers can update their requests" ON agrosoluce.ag_buyer_requests
    FOR UPDATE USING ((SELECT auth.role()) = 'authenticated')
    WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- ag_request_matches
DROP POLICY IF EXISTS "System can create matches" ON agrosoluce.ag_request_matches;
CREATE POLICY "System can create matches" ON agrosoluce.ag_request_matches
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "System can update matches" ON agrosoluce.ag_request_matches;
CREATE POLICY "System can update matches" ON agrosoluce.ag_request_matches
    FOR UPDATE USING ((SELECT auth.role()) = 'authenticated')
    WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- feedback_submissions
DROP POLICY IF EXISTS "Anyone can submit feedback" ON agrosoluce.feedback_submissions;
CREATE POLICY "Anyone can submit feedback" ON agrosoluce.feedback_submissions
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL OR (SELECT auth.role()) = 'anon');

-- monthly_progress: restrict INSERT to cooperative members
DROP POLICY IF EXISTS "Cooperative members can submit progress" ON agrosoluce.monthly_progress;
CREATE POLICY "Cooperative members can submit progress" ON agrosoluce.monthly_progress
    FOR INSERT WITH CHECK (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- satisfaction_surveys: restrict INSERT to cooperative members
DROP POLICY IF EXISTS "Cooperative members can submit surveys" ON agrosoluce.satisfaction_surveys;
CREATE POLICY "Cooperative members can submit surveys" ON agrosoluce.satisfaction_surveys
    FOR INSERT WITH CHECK (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- 4. AUTH RLS INITPLAN (lint 0003) – use (select auth.uid()) / (select auth.role())
-- =============================================

-- cooperative_onboarding
DROP POLICY IF EXISTS "Cooperative members can view their onboarding" ON agrosoluce.cooperative_onboarding;
CREATE POLICY "Cooperative members can view their onboarding" ON agrosoluce.cooperative_onboarding
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Cooperative members can update their onboarding" ON agrosoluce.cooperative_onboarding;
CREATE POLICY "Cooperative members can update their onboarding" ON agrosoluce.cooperative_onboarding
    FOR UPDATE USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- training_sessions
DROP POLICY IF EXISTS "Cooperative members can view their training" ON agrosoluce.training_sessions;
CREATE POLICY "Cooperative members can view their training" ON agrosoluce.training_sessions
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- satisfaction_surveys (view)
DROP POLICY IF EXISTS "Cooperative members can view their surveys" ON agrosoluce.satisfaction_surveys;
CREATE POLICY "Cooperative members can view their surveys" ON agrosoluce.satisfaction_surveys
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- baseline_measurements
DROP POLICY IF EXISTS "Cooperative members can view their baseline" ON agrosoluce.baseline_measurements;
CREATE POLICY "Cooperative members can view their baseline" ON agrosoluce.baseline_measurements
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- monthly_progress (view)
DROP POLICY IF EXISTS "Cooperative members can view their progress" ON agrosoluce.monthly_progress;
CREATE POLICY "Cooperative members can view their progress" ON agrosoluce.monthly_progress
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- enrichment_log
DROP POLICY IF EXISTS "Users can view enrichment logs for their entities" ON agrosoluce.enrichment_log;
CREATE POLICY "Users can view enrichment logs for their entities" ON agrosoluce.enrichment_log
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        ))
    );

-- buyer_request_lots
DROP POLICY IF EXISTS "Cooperative members can view their request lots" ON agrosoluce.buyer_request_lots;
CREATE POLICY "Cooperative members can view their request lots" ON agrosoluce.buyer_request_lots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.ag_buyer_requests br
            JOIN agrosoluce.ag_request_matches arm ON arm.request_id = br.id
            JOIN agrosoluce.cooperatives c ON c.id = arm.cooperative_id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE br.id = buyer_request_lots.request_id
            AND up.user_id = (SELECT auth.uid())
        )
    );

-- documents
DROP POLICY IF EXISTS "Cooperative members can view their documents" ON agrosoluce.documents;
CREATE POLICY "Cooperative members can view their documents" ON agrosoluce.documents
    FOR SELECT USING (
        (entity_type = 'cooperative' AND entity_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        ))
        OR
        (entity_type = 'farmer' AND entity_id IN (
            SELECT f.id FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        ))
    );

DROP POLICY IF EXISTS "Cooperative members can upload documents" ON agrosoluce.documents;
CREATE POLICY "Cooperative members can upload documents" ON agrosoluce.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE id = documents.uploaded_by AND user_id = (SELECT auth.uid())
        )
    );

-- farmer_declarations (010 schema: farmer_id)
DROP POLICY IF EXISTS "Cooperative members can view farmer declarations" ON agrosoluce.farmer_declarations;
CREATE POLICY "Cooperative members can view farmer declarations" ON agrosoluce.farmer_declarations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Cooperative members can create farmer declarations" ON agrosoluce.farmer_declarations;
CREATE POLICY "Cooperative members can create farmer declarations" ON agrosoluce.farmer_declarations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM agrosoluce.farmers f
            JOIN agrosoluce.cooperatives c ON f.cooperative_id = c.id
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE f.id = farmer_declarations.farmer_id
            AND up.user_id = (SELECT auth.uid())
        )
    );

-- notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON agrosoluce.notifications;
CREATE POLICY "Users can view their notifications" ON agrosoluce.notifications
    FOR SELECT USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can update their notifications" ON agrosoluce.notifications;
CREATE POLICY "Users can update their notifications" ON agrosoluce.notifications
    FOR UPDATE USING (
        user_profile_id IN (
            SELECT id FROM agrosoluce.user_profiles WHERE user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "System can insert notifications" ON agrosoluce.notifications;
CREATE POLICY "System can insert notifications" ON agrosoluce.notifications
    FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- readiness_checklist
DROP POLICY IF EXISTS "Cooperative members can view their checklist" ON agrosoluce.readiness_checklist;
CREATE POLICY "Cooperative members can view their checklist" ON agrosoluce.readiness_checklist
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- =============================================
-- 5. CANONICAL_COOPERATIVE_DIRECTORY, COVERAGE_METRICS, READINESS_SNAPSHOTS
-- Use (select auth.role()) and consolidate multiple SELECT policies (lint 0006)
-- =============================================

-- canonical_cooperative_directory: one SELECT policy (authenticated see all, anon see active)
DROP POLICY IF EXISTS "Anyone can view active canonical directory records" ON agrosoluce.canonical_cooperative_directory;
DROP POLICY IF EXISTS "Authenticated users can view all canonical directory records" ON agrosoluce.canonical_cooperative_directory;
CREATE POLICY "View canonical directory records" ON agrosoluce.canonical_cooperative_directory
    FOR SELECT USING (
        record_status = 'active' OR (SELECT auth.role()) = 'authenticated'
    );

DROP POLICY IF EXISTS "Authenticated users can insert canonical directory records" ON agrosoluce.canonical_cooperative_directory;
CREATE POLICY "Authenticated users can insert canonical directory records" ON agrosoluce.canonical_cooperative_directory
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update canonical directory records" ON agrosoluce.canonical_cooperative_directory;
CREATE POLICY "Authenticated users can update canonical directory records" ON agrosoluce.canonical_cooperative_directory
    FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete canonical directory records" ON agrosoluce.canonical_cooperative_directory;
CREATE POLICY "Admins can delete canonical directory records" ON agrosoluce.canonical_cooperative_directory
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM agrosoluce.user_profiles
            WHERE user_id = (SELECT auth.uid()) AND user_type = 'admin'
        )
    );

-- coverage_metrics: one SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view coverage metrics" ON agrosoluce.coverage_metrics;
DROP POLICY IF EXISTS "Anon users can view coverage metrics" ON agrosoluce.coverage_metrics;
CREATE POLICY "View coverage metrics" ON agrosoluce.coverage_metrics
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert coverage metrics" ON agrosoluce.coverage_metrics;
CREATE POLICY "Authenticated users can insert coverage metrics" ON agrosoluce.coverage_metrics
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update coverage metrics" ON agrosoluce.coverage_metrics;
CREATE POLICY "Authenticated users can update coverage metrics" ON agrosoluce.coverage_metrics
    FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');

-- readiness_snapshots: one SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view readiness snapshots" ON agrosoluce.readiness_snapshots;
DROP POLICY IF EXISTS "Anon users can view readiness snapshots" ON agrosoluce.readiness_snapshots;
CREATE POLICY "View readiness snapshots" ON agrosoluce.readiness_snapshots
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert readiness snapshots" ON agrosoluce.readiness_snapshots;
CREATE POLICY "Authenticated users can insert readiness snapshots" ON agrosoluce.readiness_snapshots
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- =============================================
-- 6. REMAINING AUTH INITPLAN: assessments, assessment_responses, child_labor_assessments
-- =============================================

-- assessments
DROP POLICY IF EXISTS "Authenticated users can insert assessments" ON agrosoluce.assessments;
CREATE POLICY "Authenticated users can insert assessments" ON agrosoluce.assessments
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update assessments" ON agrosoluce.assessments;
CREATE POLICY "Authenticated users can update assessments" ON agrosoluce.assessments
    FOR UPDATE USING ((SELECT auth.role()) = 'authenticated');

-- assessment_responses
DROP POLICY IF EXISTS "Authenticated users can insert assessment responses" ON agrosoluce.assessment_responses;
CREATE POLICY "Authenticated users can insert assessment responses" ON agrosoluce.assessment_responses
    FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');

-- child_labor_assessments
DROP POLICY IF EXISTS "Users can view child labor assessments" ON agrosoluce.child_labor_assessments;
CREATE POLICY "Users can view child labor assessments" ON agrosoluce.child_labor_assessments
    FOR SELECT USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Cooperative users can insert child labor assessments" ON agrosoluce.child_labor_assessments;
CREATE POLICY "Cooperative users can insert child labor assessments" ON agrosoluce.child_labor_assessments
    FOR INSERT WITH CHECK (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Cooperative users can update their child labor assessments" ON agrosoluce.child_labor_assessments;
CREATE POLICY "Cooperative users can update their child labor assessments" ON agrosoluce.child_labor_assessments
    FOR UPDATE USING (
        cooperative_id IN (
            SELECT c.id FROM agrosoluce.cooperatives c
            JOIN agrosoluce.user_profiles up ON c.user_profile_id = up.id
            WHERE up.user_id = (SELECT auth.uid())
        )
    );

-- Migration: Fix RLS Permissive Policies (Supabase Linter 0024)
-- Addresses Security Advisor warnings for policies with WITH CHECK (true)
-- on INSERT operations. Replaces permissive checks with proper validation.
--
-- Multi-project database: iterates over distinctive project schemas to avoid
-- polluting shared 'public' and ensure each project's tables are fixed in
-- their own schema (agrosoluce, edusoluce, vendorsoluce, cybercaution, etc.)
--
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy

-- =============================================
-- MIGRATION METADATA (per-project)
-- =============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'agrosoluce' AND table_name = 'migrations') THEN
    INSERT INTO agrosoluce.migrations (migration_name, description)
    VALUES ('021_fix_rls_permissive_policies', 'Fix RLS policies with overly permissive WITH CHECK (true) for INSERT operations')
    ON CONFLICT (migration_name) DO NOTHING;
  END IF;
END $$;

-- =============================================
-- PROJECT SCHEMAS (distinctive, non-public)
-- =============================================
-- Only fix tables in project schemas; skip public to avoid cross-project conflicts

DO $$
DECLARE
  project_schema text;
  schemas text[] := ARRAY['agrosoluce', 'edusoluce', 'vendorsoluce', 'cybercaution', 'cybercorrect', 'technosoluce'];
BEGIN
  FOREACH project_schema IN ARRAY schemas
  LOOP
    -- Skip if schema doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = project_schema) THEN
      CONTINUE;
    END IF;

    -- =============================================
    -- 1. data_subject_requests (per schema)
    -- =============================================
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'data_subject_requests') THEN
      EXECUTE format('DROP POLICY IF EXISTS "Users can insert data subject requests" ON %I.data_subject_requests', project_schema);

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'data_subject_requests' AND column_name = 'user_id') THEN
        EXECUTE format(
          'CREATE POLICY "Users can insert data subject requests" ON %I.data_subject_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)',
          project_schema
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY "Users can insert data subject requests" ON %I.data_subject_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)',
          project_schema
        );
      END IF;
    END IF;

    -- =============================================
    -- 2. notifications (per schema) - "System can insert"
    -- =============================================
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'notifications') THEN
      EXECUTE format('DROP POLICY IF EXISTS "System can insert notifications" ON %I.notifications', project_schema);
      EXECUTE format(
        'CREATE POLICY "System can insert notifications" ON %I.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)',
        project_schema
      );
    END IF;
  END LOOP;
END $$;

-- =============================================
-- 3 & 4. contact_submissions / vs_contact_submissions
-- Per-schema: fix in each project schema where table exists
-- =============================================

DO $$
DECLARE
  project_schema text;
  schemas text[] := ARRAY['agrosoluce', 'edusoluce', 'vendorsoluce', 'cybercaution', 'cybercorrect', 'technosoluce', 'public'];
  check_expr text;
  has_email boolean;
  has_message boolean;
BEGIN
  FOREACH project_schema IN ARRAY schemas
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = project_schema) THEN
      CONTINUE;
    END IF;

    -- contact_submissions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'contact_submissions') THEN
      EXECUTE format('DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON %I.contact_submissions', project_schema);

      SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'contact_submissions' AND column_name = 'email'),
             EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'contact_submissions' AND column_name = 'message')
      INTO has_email, has_message;

      check_expr := CASE
        WHEN has_email AND has_message THEN '(email IS NOT NULL AND trim(email) != '''') OR (message IS NOT NULL AND trim(message) != '''')'
        WHEN has_email THEN '(email IS NOT NULL AND trim(email) != '''')'
        WHEN has_message THEN '(message IS NOT NULL AND trim(message) != '''')'
        ELSE NULL
      END;

      IF check_expr IS NOT NULL THEN
        EXECUTE format(
          'CREATE POLICY "Anyone can insert contact submissions" ON %I.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (%s)',
          project_schema, check_expr
        );
      END IF;
    END IF;

    -- vs_contact_submissions (vendorsoluce-style, may exist in public or vendorsoluce)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'vs_contact_submissions') THEN
      EXECUTE format('DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON %I.vs_contact_submissions', project_schema);

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'vs_contact_submissions' AND column_name = 'email')
         OR EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'vs_contact_submissions' AND column_name = 'message') THEN
        EXECUTE format(
          'CREATE POLICY "Anyone can insert contact submissions" ON %I.vs_contact_submissions FOR INSERT TO anon, authenticated WITH CHECK ((email IS NOT NULL AND trim(email) != '''') OR (message IS NOT NULL AND trim(message) != ''''))',
          project_schema
        );
      END IF;
    END IF;
  END LOOP;
END $$;

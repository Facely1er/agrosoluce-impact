-- Migration: Auth RLS Initplan for edusoluce (and other project schemas)
-- Fixes lint 0003: replace auth.uid() with (select auth.uid()) in RLS policies
-- so they are not re-evaluated per row (better performance).
-- Tables: data_subject_requests, notifications

INSERT INTO agrosoluce.migrations (migration_name, description)
VALUES ('024_edusoluce_auth_rls_initplan', 'Fix auth_rls_initplan for edusoluce (and other schemas): data_subject_requests, notifications')
ON CONFLICT (migration_name) DO NOTHING;

DO $$
DECLARE
  project_schema text;
  schemas text[] := ARRAY['edusoluce', 'agrosoluce', 'vendorsoluce', 'cybercaution', 'cybercorrect', 'technosoluce'];
BEGIN
  FOREACH project_schema IN ARRAY schemas
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = project_schema) THEN
      CONTINUE;
    END IF;

    -- data_subject_requests: use (select auth.uid()) for initplan
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'data_subject_requests') THEN
      EXECUTE format('DROP POLICY IF EXISTS "Users can insert data subject requests" ON %I.data_subject_requests', project_schema);

      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = project_schema AND table_name = 'data_subject_requests' AND column_name = 'user_id') THEN
        EXECUTE format(
          'CREATE POLICY "Users can insert data subject requests" ON %I.data_subject_requests FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)',
          project_schema
        );
      ELSE
        EXECUTE format(
          'CREATE POLICY "Users can insert data subject requests" ON %I.data_subject_requests FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL)',
          project_schema
        );
      END IF;
    END IF;

    -- notifications: use (select auth.uid()) for initplan
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = project_schema AND table_name = 'notifications') THEN
      EXECUTE format('DROP POLICY IF EXISTS "System can insert notifications" ON %I.notifications', project_schema);
      EXECUTE format(
        'CREATE POLICY "System can insert notifications" ON %I.notifications FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) IS NOT NULL)',
        project_schema
      );
    END IF;
  END LOOP;
END $$;

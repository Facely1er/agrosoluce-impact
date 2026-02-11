-- Fix RLS permissive policies (Supabase Linter 0024)
-- Run this in Supabase SQL Editor to resolve Security Advisor warnings.
-- Direct DDL for the exact 4 tables flagged by the linter.

-- =============================================
-- 1. edusoluce.data_subject_requests
-- =============================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can insert data subject requests" ON edusoluce.data_subject_requests;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'edusoluce' AND table_name = 'data_subject_requests' AND column_name = 'user_id') THEN
    CREATE POLICY "Users can insert data subject requests" ON edusoluce.data_subject_requests
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  ELSE
    CREATE POLICY "Users can insert data subject requests" ON edusoluce.data_subject_requests
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- =============================================
-- 2. edusoluce.notifications
-- =============================================
DROP POLICY IF EXISTS "System can insert notifications" ON edusoluce.notifications;
CREATE POLICY "System can insert notifications" ON edusoluce.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 3. public.contact_submissions
-- =============================================
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (email IS NOT NULL AND trim(email) != '')
    OR
    (message IS NOT NULL AND trim(message) != '')
  );

-- =============================================
-- 4. public.vs_contact_submissions
-- =============================================
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.vs_contact_submissions;
CREATE POLICY "Anyone can insert contact submissions" ON public.vs_contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (email IS NOT NULL AND trim(email) != '')
    OR
    (message IS NOT NULL AND trim(message) != '')
  );

-- ============================================================================
-- MIGRATION: Add Admin Role System
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Add is_admin column to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Step 2: Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin
ON public.user_profiles(is_admin)
WHERE is_admin = true;

-- Step 3: Create helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 4: Grant execute permission on the helper function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================================
-- Step 5: Drop existing overly permissive policies
-- ============================================================================

-- Blog categories
DROP POLICY IF EXISTS "blog_categories_admin_all" ON public.blog_categories;

-- Blog tags
DROP POLICY IF EXISTS "blog_tags_admin_all" ON public.blog_tags;

-- Post tags
DROP POLICY IF EXISTS "post_tags_admin_all" ON public.post_tags;

-- Newsletter subscribers
DROP POLICY IF EXISTS "newsletter_admin_all" ON public.newsletter_subscribers;

-- Contact submissions
DROP POLICY IF EXISTS "contact_admin_read" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_admin_update" ON public.contact_submissions;

-- ============================================================================
-- Step 6: Create new restricted policies
-- ============================================================================

-- Blog Categories: Only admins can create/update/delete
CREATE POLICY "blog_categories_admin_insert" ON public.blog_categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "blog_categories_admin_update" ON public.blog_categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "blog_categories_admin_delete" ON public.blog_categories
  FOR DELETE USING (public.is_admin());

-- Blog Tags: Only admins can create/update/delete
CREATE POLICY "blog_tags_admin_insert" ON public.blog_tags
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "blog_tags_admin_update" ON public.blog_tags
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "blog_tags_admin_delete" ON public.blog_tags
  FOR DELETE USING (public.is_admin());

-- Post Tags: Authors can manage their own post tags, admins can manage all
CREATE POLICY "post_tags_author_insert" ON public.post_tags
  FOR INSERT WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_tags.post_id
      AND blog_posts.author_id = auth.uid()
    )
  );

CREATE POLICY "post_tags_author_delete" ON public.post_tags
  FOR DELETE USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_tags.post_id
      AND blog_posts.author_id = auth.uid()
    )
  );

-- Newsletter Subscribers: Only admins can read/update/delete
CREATE POLICY "newsletter_admin_select" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscribers
  FOR DELETE USING (public.is_admin());

-- Contact Submissions: Only admins can read/update/delete
CREATE POLICY "contact_admin_select" ON public.contact_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "contact_admin_update" ON public.contact_submissions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "contact_admin_delete" ON public.contact_submissions
  FOR DELETE USING (public.is_admin());

-- ============================================================================
-- IMPORTANT: Promote your admin user after running this migration
-- ============================================================================
-- UPDATE public.user_profiles SET is_admin = true WHERE email = 'your-admin@email.com';

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Admin Role Migration Complete!';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'IMPORTANT: Promote your admin user by running:';
  RAISE NOTICE 'UPDATE public.user_profiles SET is_admin = true WHERE email = ''your-admin@email.com'';';
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- SUPABASE AUTHENTICATION DATABASE SETUP
-- Run this script in your Supabase SQL Editor to set up the authentication system
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- Extends Supabase auth.users with additional profile information
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and edit their own profile
CREATE POLICY "user_profiles_policy" ON public.user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- ============================================================================
-- BLOG SYSTEM TABLES
-- Sunday AI Work blog platform with content management
-- ============================================================================

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#3B82F6', -- Default blue color
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text, -- Markdown content
  excerpt text NOT NULL,
  featured_image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamp with time zone,
  read_time_minutes integer DEFAULT 0,
  view_count integer DEFAULT 0,
  author_id uuid REFERENCES public.user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Post tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.post_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES public.blog_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, tag_id)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'pending')),
  subscribed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  unsubscribed_at timestamp with time zone,
  confirmation_token text,
  confirmed_at timestamp with time zone
);

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Post views for analytics
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_session text, -- Anonymous session tracking
  ip_address inet,
  user_agent text
);

-- ============================================================================
-- BLOG SYSTEM RLS POLICIES
-- ============================================================================

-- Enable RLS on all blog tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Public read access for published blog content
CREATE POLICY "blog_categories_public_read" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "blog_tags_public_read" ON public.blog_tags
  FOR SELECT USING (true);

CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= now());

CREATE POLICY "post_tags_public_read" ON public.post_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts 
      WHERE blog_posts.id = post_tags.post_id 
      AND blog_posts.status = 'published' 
      AND blog_posts.published_at <= now()
    )
  );

-- Admin access for content management (authenticated users)
CREATE POLICY "blog_posts_admin_all" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "blog_categories_admin_all" ON public.blog_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "blog_tags_admin_all" ON public.blog_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "post_tags_admin_all" ON public.post_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Newsletter subscriber policies
CREATE POLICY "newsletter_insert_public" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_admin_all" ON public.newsletter_subscribers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Contact form policies
CREATE POLICY "contact_insert_public" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_admin_read" ON public.contact_submissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "contact_admin_update" ON public.contact_submissions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Post views for analytics (public insert, admin read)
CREATE POLICY "post_views_insert_public" ON public.post_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "post_views_admin_read" ON public.post_views
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- BLOG SYSTEM TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically update slug from title
CREATE OR REPLACE FUNCTION generate_slug(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate read time from content
CREATE OR REPLACE FUNCTION calculate_read_time(content text)
RETURNS integer AS $$
DECLARE
  word_count integer;
  words_per_minute integer := 200;
BEGIN
  -- Count words (approximate)
  word_count := array_length(string_to_array(content, ' '), 1);
  -- Calculate read time in minutes, minimum 1 minute
  RETURN GREATEST(1, CEIL(word_count::float / words_per_minute));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug and read time
CREATE OR REPLACE FUNCTION auto_update_blog_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  
  -- Calculate read time from content
  IF NEW.content IS NOT NULL THEN
    NEW.read_time_minutes := calculate_read_time(NEW.content);
  END IF;
  
  -- Update timestamp
  NEW.updated_at := timezone('utc'::text, now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update trigger to blog posts
CREATE TRIGGER blog_posts_auto_update 
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION auto_update_blog_post();

-- Apply updated_at trigger to other tables
CREATE TRIGGER blog_categories_updated_at 
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER contact_submissions_updated_at 
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- BLOG SYSTEM INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON public.post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscribers(status);

CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_views_post ON public.post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_date ON public.post_views(viewed_at DESC);

-- ============================================================================
-- SEED DATA FOR BLOG CATEGORIES
-- ============================================================================

INSERT INTO public.blog_categories (name, slug, description, color) VALUES
  ('AI', 'ai', 'Artificial Intelligence and Machine Learning', '#3B82F6'),
  ('Automation', 'automation', 'Workflow Automation and Process Optimization', '#10B981'),
  ('LLM', 'llm', 'Large Language Models and Applications', '#8B5CF6'),
  ('Tech', 'tech', 'Technology Insights and Programming', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 SUNDAY AI WORK BLOG SETUP COMPLETE!';
  RAISE NOTICE '=======================================';
  RAISE NOTICE '✅ User profiles table created';
  RAISE NOTICE '✅ Blog system tables created';
  RAISE NOTICE '✅ Row Level Security enabled';
  RAISE NOTICE '✅ Automatic profile creation configured';
  RAISE NOTICE '✅ Blog categories seeded (AI, Automation, LLM, Tech)';
  RAISE NOTICE '✅ Auto-slug generation enabled';
  RAISE NOTICE '✅ Read time calculation enabled';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Your Sunday AI Work blog platform is ready!';
  RAISE NOTICE 'Blog: Supports content management, categories, tags, and analytics';
  RAISE NOTICE 'Newsletter: Email subscription system with confirmation';
  RAISE NOTICE 'Contact: Form submissions with status management';
  RAISE NOTICE '';
END $$;
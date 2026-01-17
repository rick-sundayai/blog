// ============================================================================
// BLOG SYSTEM TYPES
// TypeScript definitions for Sunday AI Work blog platform
// ============================================================================

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content?: string // Markdown content
  excerpt: string
  featured_image_url?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  read_time_minutes: number
  view_count: number
  author_id: string
  category_id?: string
  created_at: string
  updated_at: string
  // Relations
  category?: BlogCategory | null
  tags?: BlogTag[]
  author?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
}

export interface PostTag {
  id: string
  post_id: string
  tag_id: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed' | 'pending'
  subscribed_at: string
  unsubscribed_at?: string
  confirmation_token?: string
  confirmed_at?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export interface PostView {
  id: string
  post_id: string
  viewed_at: string
  user_session?: string
  ip_address?: string
  user_agent?: string
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateBlogPostForm {
  title: string
  content: string
  excerpt: string
  featured_image_url?: string
  status: 'draft' | 'published'
  category_id?: string
  tag_ids?: string[]
  slug?: string
  author_id: string
}

export interface UpdateBlogPostForm extends Partial<CreateBlogPostForm> {
  id: string
  published_at?: string
}

export interface CreateCategoryForm {
  name: string
  description?: string
  color?: string
}

export interface CreateTagForm {
  name: string
}

export interface NewsletterSubscriptionForm {
  email: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null | undefined
  tags: BlogTag[]
  author: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
}

// ============================================================================
// QUERY FILTERS
// ============================================================================

export interface BlogPostFilters {
  search?: string
  category?: string
  tag?: string
  status?: BlogPost['status']
  author_id?: string
  limit?: number
  offset?: number
  sort_by?: 'created_at' | 'published_at' | 'view_count' | 'title'
  sort_order?: 'asc' | 'desc'
}

export interface DashboardMetrics {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  newsletter_subscribers: number
  contact_submissions: number
  recent_posts: BlogPost[]
  popular_posts: BlogPost[]
  recent_subscribers: NewsletterSubscriber[]
  recent_contacts: ContactSubmission[]
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
}

export interface BlogSettings {
  site_title: string
  site_description: string
  posts_per_page: number
  allow_comments: boolean
  auto_publish: boolean
  newsletter_enabled: boolean
  analytics_enabled: boolean
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type BlogPostStatus = BlogPost['status']
export type NewsletterStatus = NewsletterSubscriber['status']
export type ContactStatus = ContactSubmission['status']

// Database table names for type-safe queries
export const TABLE_NAMES = {
  BLOG_POSTS: 'blog_posts',
  BLOG_CATEGORIES: 'blog_categories',
  BLOG_TAGS: 'blog_tags',
  POST_TAGS: 'post_tags',
  NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  POST_VIEWS: 'post_views',
  USER_PROFILES: 'user_profiles',
} as const

// Error types for better error handling
export interface BlogError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export class BlogNotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`)
    this.name = 'BlogNotFoundError'
  }
}

export class BlogValidationError extends Error {
  constructor(field: string, message: string) {
    super(`Validation error on ${field}: ${message}`)
    this.name = 'BlogValidationError'
  }
}
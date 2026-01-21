// ============================================================================
// BLOG QUERIES
// React Query hooks for blog operations following supabase-query-patterns
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogPostFilters,
  CreateBlogPostForm,
  UpdateBlogPostForm,
  CreateCategoryForm,
  CreateTagForm,
  BlogPostWithRelations,
  BlogPostsResponse,
  TABLE_NAMES,
} from '@/lib/types/blog'

// ============================================================================
// BLOG POSTS QUERIES
// ============================================================================

/**
 * Fetch published blog posts for public viewing
 */
export function useBlogPosts(filters: BlogPostFilters = {}) {
  return useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: async (): Promise<BlogPostsResponse> => {
      const supabase = createClient()
      const categorySelect = `category:blog_categories!blog_posts_category_id_fkey${filters.category ? '!inner' : ''}(
        id,
        name,
        slug,
        color
      )`

      let query = supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .select(`
          *,
          ${categorySelect},
          author:user_profiles!blog_posts_author_id_fkey(
            user_id,
            full_name,
            email,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
        )
      }

      if (filters.category) {
        query = query.eq('blog_categories.slug', filters.category)
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'published_at'
      const sortOrder = filters.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const limit = filters.limit || 10
      const offset = filters.offset || 0
      query = query.range(offset, offset + limit - 1)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await (query as any)

      if (error) {
        throw new Error(`Failed to fetch blog posts: ${error.message}`)
      }

      return {
        posts: data || [],
        total: count || 0,
        page: Math.floor((offset || 0) / limit) + 1,
        limit,
        hasMore: (data?.length || 0) === limit,
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes for published content
  })
}

/**
 * Fetch a single blog post by slug
 */
export function useBlogPost(slug: string, enabled = true) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async (): Promise<BlogPostWithRelations> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .select(`
          *,
          category:blog_categories!blog_posts_category_id_fkey(
            id,
            name,
            slug,
            description,
            color
          ),
          tags:post_tags!post_tags_post_id_fkey(
            blog_tags!post_tags_tag_id_fkey(
              id,
              name,
              slug
            )
          ),
          author:user_profiles!blog_posts_author_id_fkey(
            user_id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Blog post not found')
        }
        throw new Error(`Failed to fetch blog post: ${error.message}`)
      }

      // Transform tags data structure
      const transformedData = {
        ...data,
        tags: data.tags?.map((tag: { blog_tags: BlogTag }) => tag.blog_tags).filter(Boolean) || [],
      }

      return transformedData
    },
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 15, // 15 minutes for individual posts
  })
}

/**
 * Fetch all blog posts for admin (includes drafts)
 */
export function useAdminBlogPosts(filters: BlogPostFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['admin-blog-posts', filters],
    queryFn: async (): Promise<BlogPost[]> => {
      const supabase = createClient()
      let query = supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .select(`
          *,
          category:blog_categories!blog_posts_category_id_fkey(
            id,
            name,
            slug,
            color
          ),
          author:user_profiles!blog_posts_author_id_fkey(
            user_id,
            full_name,
            email
          )
        `)

      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      // Apply search
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
        )
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'updated_at'
      const sortOrder = filters.sort_order || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch admin blog posts: ${error.message}`)
      }

      return data || []
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes for admin data
  })
}

/**
 * Fetch a single blog post by ID for admin (editing)
 */
export function useAdminBlogPost(id: string) {
  return useQuery({
    queryKey: ['admin-blog-post', id],
    queryFn: async (): Promise<BlogPostWithRelations> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .select(`
          *,
          category:blog_categories!blog_posts_category_id_fkey(
            id,
            name,
            slug,
            description,
            color
          ),
          tags:post_tags!post_tags_post_id_fkey(
            blog_tags!post_tags_tag_id_fkey(
              id,
              name,
              slug
            )
          ),
          author:user_profiles!blog_posts_author_id_fkey(
            user_id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch blog post: ${error.message}`)
      }

      // Transform tags data structure
      const transformedData = {
        ...data,
        tags: data.tags?.map((tag: { blog_tags: BlogTag }) => tag.blog_tags).filter(Boolean) || [],
      }

      return transformedData
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// ============================================================================
// BLOG CATEGORIES QUERIES
// ============================================================================

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async (): Promise<BlogCategory[]> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_CATEGORIES)
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch blog categories: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 30, // 30 minutes for categories
  })
}

// ============================================================================
// BLOG TAGS QUERIES
// ============================================================================

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async (): Promise<BlogTag[]> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_TAGS)
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch blog tags: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 30, // 30 minutes for tags
  })
}

// ============================================================================
// BLOG POST MUTATIONS
// ============================================================================

/**
 * Create a new blog post
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: CreateBlogPostForm): Promise<BlogPost> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .insert([
          {
            ...postData,
            published_at: postData.status === 'published' ? new Date().toISOString() : null,
          },
        ])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create blog post: ${error.message}`)
      }

      return data
    },
    onSuccess: (newPost) => {
      // Invalidate all blog post queries
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] })

      // Add to cache optimistically
      queryClient.setQueryData<BlogPost[]>(['admin-blog-posts'], (old) => {
        if (!old) return [newPost]
        return [newPost, ...old]
      })
    },
    onError: (error) => {
      console.error('Error creating blog post:', error)
    },
  })
}

/**
 * Update an existing blog post
 */
export function useUpdateBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateBlogPostForm): Promise<BlogPost> => {
      const supabase = createClient()

      // Set published_at when changing from draft to published
      const updateData = {
        ...updates,
        ...(updates.status === 'published' && !updates.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      }

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update blog post: ${error.message}`)
      }

      return data
    },
    onSuccess: (updatedPost) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['blog-post', updatedPost.slug] })
      queryClient.invalidateQueries({ queryKey: ['admin-blog-post', updatedPost.id] })

      // Update specific post in cache
      queryClient.setQueryData<BlogPost>(
        ['blog-post', updatedPost.slug],
        updatedPost
      )
      queryClient.setQueryData<BlogPost>(
        ['admin-blog-post', updatedPost.id],
        updatedPost
      )
    },
    onError: (error) => {
      console.error('Error updating blog post:', error)
    },
  })
}

/**
 * Delete a blog post
 */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string): Promise<string> => {
      const supabase = createClient()

      const { error } = await supabase
        .from(TABLE_NAMES.BLOG_POSTS)
        .delete()
        .eq('id', postId)

      if (error) {
        throw new Error(`Failed to delete blog post: ${error.message}`)
      }

      return postId
    },
    onSuccess: (deletedId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] })

      // Remove from cache optimistically
      queryClient.setQueryData<BlogPost[]>(['admin-blog-posts'], (old) => {
        if (!old) return []
        return old.filter(post => post.id !== deletedId)
      })
    },
    onError: (error) => {
      console.error('Error deleting blog post:', error)
    },
  })
}

// ============================================================================
// CATEGORY MUTATIONS
// ============================================================================

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryData: CreateCategoryForm): Promise<BlogCategory> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_CATEGORIES)
        .insert([categoryData])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create category: ${error.message}`)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] })
    },
  })
}

// ============================================================================
// TAG MUTATIONS
// ============================================================================

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tagData: CreateTagForm): Promise<BlogTag> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.BLOG_TAGS)
        .insert([tagData])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create tag: ${error.message}`)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] })
    },
  })
}

// ============================================================================
// ANALYTICS MUTATIONS
// ============================================================================

/**
 * Track a blog post view
 */
export function useTrackPostView() {
  return useMutation({
    mutationFn: async ({ postId, userSession }: { postId: string; userSession?: string }) => {
      const supabase = createClient()

      const { error } = await supabase
        .from(TABLE_NAMES.POST_VIEWS)
        .insert([
          {
            post_id: postId,
            user_session: userSession || crypto.randomUUID(),
          },
        ])

      if (error) {
        console.warn('Failed to track post view:', error.message)
      }
    },
    // Don't throw errors for analytics tracking
    onError: (error) => {
      console.warn('Post view tracking failed:', error)
    },
  })
}
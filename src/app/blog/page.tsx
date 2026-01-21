'use client'

import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { useBlogPosts, useBlogCategories } from '@/lib/queries/blog'
import { useTrackPostView } from '@/lib/queries/blog'
import type { BlogPostFilters } from '@/lib/types/blog'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('')
  
  // Build filters for the query
  const filters: BlogPostFilters = {
    search: searchQuery || undefined,
    category: activeCategory || undefined,
    limit: 12,
    sort_by: 'published_at',
    sort_order: 'desc',
  }

  const { data: categoriesData } = useBlogCategories()
  const { data: postsData, isLoading, error } = useBlogPosts(filters)

  const categories = categoriesData || []

  const handleCategoryChange = (categorySlug: string) => {
    setActiveCategory(categorySlug === 'all' ? '' : categorySlug)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <p className="text-destructive text-lg">
                Failed to load blog posts. Please try again later.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              The <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Thoughts, tutorials, and deep dives into AI, automation, and modern technology.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category.slug === activeCategory
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-6 bg-muted rounded w-20" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && postsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsData.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden card-glow block"
                >
                  {/* Post Image */}
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-muted-foreground/30">
                        {post.category?.name.charAt(0) || 'B'}
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Category and Read Time */}
                    <div className="flex items-center justify-between mb-3">
                      {post.category && (
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: `${post.category.color}20`,
                            color: post.category.color 
                          }}
                        >
                          {post.category.name}
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {post.read_time_minutes} min read
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.view_count || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Date and Read More */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                      </span>
                      <span className="text-primary hover:text-primary/80 font-medium text-sm flex items-center group">
                        Read more
                        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && postsData && postsData.posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No articles found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
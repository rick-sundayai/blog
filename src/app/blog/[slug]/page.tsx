import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Eye, User } from 'lucide-react'
import Header from '@/components/Header'
import ViewTracker from '@/components/ViewTracker'
import { createClient } from '@/lib/supabase/server'
import { TABLE_NAMES } from '@/lib/types/blog'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

// Server-side data fetching for SEO and initial load
async function getBlogPost(slug: string) {
  const supabase = await createClient()

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

  if (error || !data) {
    return null
  }

  // Transform tags data structure
  const transformedData = {
    ...data,
    tags: data.tags?.map((tag: { blog_tags: any }) => tag.blog_tags).filter(Boolean) || [],
  }

  return transformedData
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Sunday AI Work',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Sunday AI Work`,
    description: post.excerpt,
    keywords: [
      post.category?.name || '',
      ...post.tags.map((tag: any) => tag.name),
      'AI',
      'automation',
      'technology',
    ].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author?.full_name || 'Sunday AI Work'],
      images: post.featured_image_url ? [
        {
          url: post.featured_image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Format the published date
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <ViewTracker postId={post.id} />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog */}
          <div className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt,
                image: post.featured_image_url ? [post.featured_image_url] : [],
                datePublished: post.published_at,
                dateModified: post.updated_at || post.published_at,
                author: {
                  '@type': 'Person',
                  name: post.author?.full_name || 'Sunday AI Work',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Sunday AI Work',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://sundayaiwork.com/logo.png', // Update with actual logo URL if available
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://sundayaiwork.com/blog/${slug}`,
                },
              }),
            }}
          />

          {/* Article Header */}
          <header className="mb-12">
            {/* Category */}
            {post.category && (
              <div className="mb-4">
                <span 
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${post.category.color}20`,
                    color: post.category.color 
                  }}
                >
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border py-6">
              {/* Author */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.full_name || 'Sunday AI Work'}</span>
              </div>

              {/* Published Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span suppressHydrationWarning>{publishedDate}</span>
              </div>

              {/* Read Time */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time_minutes} min read</span>
              </div>

              {/* View Count */}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            {post.content ? (
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="text-center py-16 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground text-lg">
                  Content coming soon...
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This article is still being written. Check back later!
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && (
            <div className="border-t border-border pt-12">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  {post.author.avatar_url ? (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground font-bold text-xl">
                      {post.author.full_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {post.author.full_name}
                  </h3>
                  <p className="text-muted-foreground">
                    Creator of Sunday AI Work. Passionate about AI, automation, and building 
                    the future with emerging technologies. Sharing weekend projects and 
                    insights from the intersection of artificial intelligence and practical applications.
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
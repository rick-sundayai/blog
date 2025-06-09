import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Import Post type for type checking in the function
import type { Post } from '@/types';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Ensure params is properly handled
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: `${post.title} | Modern Blog`,
    description: post.content.substring(0, 160),
  };
}

async function getPostBySlug(slug: string) {
  // This would be replaced with a real Supabase query
  // const { data } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('slug', slug)
  //   .eq('status', 'published')
  //   .single();
  // return data;
  
  // For now, return mock data
  const mockPosts = [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables functionality such as server-side rendering and static site generation.

## Why Next.js?

Next.js provides a great developer experience with features like:

- Server-side rendering
- Static site generation
- API routes
- File-based routing
- Built-in CSS and Sass support
- Fast refresh
- TypeScript support
- Image optimization

## Getting Started

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will create a new Next.js app with the default template.

## Project Structure

A typical Next.js project structure looks like this:

\`\`\`
my-app/
  ├── node_modules/
  ├── public/
  ├── src/
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   └── page.tsx
  │   ├── components/
  │   └── styles/
  ├── .eslintrc.json
  ├── next.config.js
  ├── package.json
  ├── README.md
  └── tsconfig.json
\`\`\`

## Conclusion

Next.js is a powerful framework for building React applications with excellent developer experience and performance optimizations.
      `,
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-01T10:00:00Z',
      updated_at: '2025-06-01T10:00:00Z',
      published_at: '2025-06-01T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    },
    {
      id: '2',
      title: 'Working with Supabase',
      slug: 'working-with-supabase',
      content: `
# Working with Supabase

Supabase is an open source Firebase alternative providing all the backend services you need to build a product.

## Features

Supabase offers several key features:

- PostgreSQL Database
- Authentication
- Auto-generated APIs
- Real-time subscriptions
- Storage
- Edge Functions

## Getting Started

To get started with Supabase, you can create a new project on the Supabase dashboard or use the CLI:

\`\`\`bash
npm install -g supabase
supabase init
\`\`\`

## Setting up with Next.js

Install the Supabase client library:

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

Create a client:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
\`\`\`

## Conclusion

Supabase provides a powerful and developer-friendly alternative to Firebase with the added benefits of PostgreSQL.
      `,
      featured_image: 'https://images.unsplash.com/photo-1555066932-e78dd8fb77bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-02T10:00:00Z',
      updated_at: '2025-06-02T10:00:00Z',
      published_at: '2025-06-02T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    },
    {
      id: '3',
      title: 'Automating Workflows with n8n',
      slug: 'automating-workflows-with-n8n',
      content: `
# Automating Workflows with n8n

n8n is a fair-code licensed workflow automation tool that helps you automate tasks across different services.

## Why n8n?

n8n offers several advantages over other automation tools:

- Self-hostable
- Fair-code licensed
- Extensible with custom nodes
- Visual workflow editor
- 200+ integrations

## Getting Started

To get started with n8n, you can install it using npm:

\`\`\`bash
npm install n8n -g
n8n start
\`\`\`

Or use Docker:

\`\`\`bash
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
\`\`\`

## Example Workflow: Blog Post to Social Media

Here's a simple workflow for automatically sharing new blog posts to social media:

1. Trigger: When a new post is published in Supabase
2. Action: Format the content for social media
3. Action: Post to Twitter
4. Action: Post to LinkedIn
5. Action: Send email notification

## Conclusion

n8n is a powerful tool for automating workflows between different services, making it perfect for integrating with your blog.
      `,
      featured_image: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-03T10:00:00Z',
      updated_at: '2025-06-03T10:00:00Z',
      published_at: '2025-06-03T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    }
  ];
  
  return mockPosts.find(post => post.slug === slug);
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Properly destructure the params object
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        ← Back to all posts
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="text-gray-500 mb-8">
        Published on {formatDate(post.published_at || post.created_at)}
      </div>
      
      {post.featured_image && (
        <div className="relative h-64 md:h-96 w-full mb-8">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {/* In a real app, you'd use a markdown renderer like react-markdown */}
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Share this post</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Twitter
          </button>
          <button className="px-4 py-2 bg-blue-800 text-white rounded-md">
            Facebook
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            LinkedIn
          </button>
        </div>
      </div>
    </article>
  );
}

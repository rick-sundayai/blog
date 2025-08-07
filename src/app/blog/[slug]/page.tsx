import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// REMOVE this import as it's the source of the issue when logged in
// import { supabase } from '@/lib/supabase';

// IMPORT the SSR-aware server client factory
import { createClient } from '@/lib/supabase/server';

// Generate metadata for the page
// Type params as Promise as per your environment/Next.js version's behavior
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Await params since it's a Promise in your environment
  const { slug } = await params;

  // Create a *new* SSR server client instance for this request
  const supabase = await createClient();

  // Pass the request-specific client to the fetch function
  const post = await getPostBySlug(supabase, slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Ensure post.content is not null or undefined before calling substring
  const description = post.content ? post.content.substring(0, 160) : 'Read the full blog post.';

  return {
    title: `${post.title} | Modern Blog`,
    description: description, // Use the potentially truncated description
  };
}

// Modify the fetch function to accept the Supabase client instance
async function getPostBySlug(supabaseClient: ReturnType<typeof createClient>, slug: string) {
  // Use the client instance passed into the function
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('slug', slug)
    // The RLS policy already restricts to published OR author.
    // Keeping the published filter here is fine as an extra layer,
    // but the RLS policy is the primary enforcement mechanism.
    .eq('status', 'published')
    .single();

   // Basic error logging
   if (error) {
       console.error('Error fetching post by slug:', error);
       // Depending on the error, you might want to return null or throw
       if (error.code === 'PGRST116') { // No rows found (single() expects one)
           return null; // Return null so notFound() can be called
       }
       // For other database errors, you might let it throw
       throw error;
   }


  return data;
}

// Format date for display
function formatDate(dateString: string | null | undefined) { // Handle potential null/undefined
  if (!dateString) {
    return 'Date unavailable';
  }
  const date = new Date(dateString);
   // Check if date is valid before formatting
   if (isNaN(date.getTime())) {
       return 'Invalid Date';
   }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Default page component
// Type params as Promise as per your environment/Next.js version's behavior
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params since it's a Promise in your environment
  const { slug } = await params;

  // Create a *new* SSR server client instance for this request
  const supabase = await createClient();

  // Pass the request-specific client to the fetch function
  const post = await getPostBySlug(supabase, slug);

  if (!post) {
    notFound();
  }

  // Ensure post.content is not null or undefined before replacing newlines
   const postContentHtml = post.content ? post.content.replace(/\n/g, '<br />') : '';


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
         {/* Use the pre-processed HTML */}
        <div dangerouslySetInnerHTML={{ __html: postContentHtml }} />
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Share this post</h2>
        <div className="flex space-x-4">
           {/* Add actual share links - remember to replace 'YOUR_BLOG_URL' */}
           {/* You might want to get YOUR_BLOG_URL from an environment variable or config */}
           <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`YOUR_BLOG_URL/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Twitter
          </a>
           <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`YOUR_BLOG_URL/blog/${post.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
          >
            Facebook
          </a>
           <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`YOUR_BLOG_URL/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            LinkedIn
          </a>
        </div>
         {/* Remember to replace 'YOUR_BLOG_URL' with your actual domain */}
      </div>
    </article>
  );
}
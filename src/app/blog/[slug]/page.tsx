import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Access slug directly from params object
  const slug = params.slug;
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
  // Get post data from Supabase
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Access slug directly from params object
  const slug = params.slug;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
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

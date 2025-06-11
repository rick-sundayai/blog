// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types";
import PostCard from "@/components/PostCard";

export default async function Home() {
  const supabase = await createClient();
  
  let featuredPosts: Post[] = [];
  let recentPosts: Post[] = [];
  
  try {
    // Fetch latest posts directly from Supabase
    const { data: latestPosts, error } = await supabase
      .from('posts')
      .select('*') // Simplified query to avoid join issues
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6);
      
    if (error) throw error;
    
    // Fall back to using the postService if we can't get posts directly
    if (!latestPosts || latestPosts.length === 0) {
      // Show empty state instead of error
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No posts found</h2>
          <p>Check back soon for new content!</p>
        </div>
      );
    }
    
    const posts = latestPosts as Post[];
    featuredPosts = posts.slice(0, Math.min(2, posts.length));
    recentPosts = posts.slice(Math.min(2, posts.length));
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Provide a graceful fallback UI
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Unable to load posts</h2>
        <p>Please try again later</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gray-900">Tech.</span>{" "}
          <span className="text-gray-900">Travel.</span>{" "}
          <span className="text-blue-500">Experience.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Exploring the digital landscape and the physical world, one story at a time. 
          Join me on this journey of discovery and innovation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/tech" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
          >
            Tech Stories
          </Link>
          <Link 
            href="/travel" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            Travel Adventures
          </Link>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
        <div className="space-y-12">
          {featuredPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} variant="featured" />
          ))}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Articles</h2>
          <div className="flex space-x-2">
            <Link 
              href="/"
              className="px-3 py-1 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              All
            </Link>
            <Link 
              href="/category/tech"
              className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100"
            >
              Tech
            </Link>
            <Link 
              href="/category/travel"
              className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100"
            >
              Travel
            </Link>
            <Link 
              href="/category/experience"
              className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100"
            >
              Experience
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
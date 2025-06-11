// src/app/category/[slug]/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const supabase = await createClient();
  
  // Fetch posts by category
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', slug)
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching posts by category:', error);
    return <div>Error loading posts</div>;
  }
  
  if (!posts || posts.length === 0) {
    return notFound();
  }
  
  // Format the category name for display
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-8">{categoryName} Articles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      
      <div className="text-center mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

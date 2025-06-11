import { Metadata } from 'next';
import PostList from '@/components/blog/PostList';
import { Post } from '@/types';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Blog | Modern Blog',
  description: 'Read our latest articles and tutorials',
};

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our latest articles, tutorials, and insights
        </p>
      </div>
      
      {/* Filter and search options could go here */}
      
      <PostList posts={posts as Post[]} />
    </div>
  );
}
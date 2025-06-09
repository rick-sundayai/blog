import { Metadata } from 'next';
import PostList from '@/components/blog/PostList';
import { Post } from '@/types';

export const metadata: Metadata = {
  title: 'Blog | Modern Blog',
  description: 'Read our latest articles and tutorials',
};

async function getPosts() {
  // This would be replaced with a real Supabase query
  // const { data } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('status', 'published')
  //   .order('published_at', { ascending: false });
  // return data || [];
  
  // For now, return mock data
  return [
    {
      id: '1',
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: 'Next.js is a React framework that enables functionality such as server-side rendering and static site generation.',
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
      content: 'Supabase is an open source Firebase alternative providing all the backend services you need to build a product.',
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
      content: 'n8n is a fair-code licensed workflow automation tool that helps you automate tasks across different services.',
      featured_image: 'https://images.unsplash.com/photo-1555066931-bf19f8fd1085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-03T10:00:00Z',
      updated_at: '2025-06-03T10:00:00Z',
      published_at: '2025-06-03T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    },
    {
      id: '4',
      title: 'Deploying to Google Cloud',
      slug: 'deploying-to-google-cloud',
      content: 'Google Cloud Platform offers a range of hosting options for your Next.js applications, from serverless to Kubernetes.',
      featured_image: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-04T10:00:00Z',
      updated_at: '2025-06-04T10:00:00Z',
      published_at: '2025-06-04T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    },
    {
      id: '5',
      title: 'Building a Blog with Next.js and Supabase',
      slug: 'building-a-blog-with-nextjs-and-supabase',
      content: 'Learn how to create a full-featured blog using Next.js for the frontend and Supabase for the backend.',
      featured_image: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-06-05T10:00:00Z',
      updated_at: '2025-06-05T10:00:00Z',
      published_at: '2025-06-05T10:00:00Z',
      status: 'published',
      author_id: 'user1'
    }
  ];
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

import { Metadata } from 'next';
import CategoryPage from '@/components/blog/CategoryPage';
import { getMockPostsByCategory } from '@/services/postService';

export const metadata: Metadata = {
  title: 'Tech Articles | Tech Trails Tales',
  description: 'Explore the latest in technology, AI, web development, and digital innovation.',
};

export default async function TechCategoryPage() {
  // In a real implementation, we would use getPostsByCategory
  // const posts = await getPostsByCategory('tech');
  
  // For now, use mock data
  const posts = await getMockPostsByCategory('tech');
  
  return (
    <CategoryPage 
      title="Tech" 
      description="Exploring the digital landscape, from AI and machine learning to web development and emerging technologies."
      posts={posts}
    />
  );
}

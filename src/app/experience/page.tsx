import { Metadata } from 'next';
import CategoryPage from '@/components/blog/CategoryPage';
import { getMockPostsByCategory } from '@/services/postService';

export const metadata: Metadata = {
  title: 'Experience Articles | Tech Trails Tales',
  description: 'Personal stories, insights, and reflections on the intersection of technology and travel.',
};

export default async function ExperienceCategoryPage() {
  // In a real implementation, we would use getPostsByCategory
  // const posts = await getPostsByCategory('experience');
  
  // For now, use mock data
  const posts = await getMockPostsByCategory('experience');
  
  return (
    <CategoryPage 
      title="Experience" 
      description="Personal stories and insights at the intersection of technology and travel, where digital and physical worlds meet."
      posts={posts}
    />
  );
}

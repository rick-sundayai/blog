import { Metadata } from 'next';
import CategoryPage from '@/components/blog/CategoryPage';
import { getMockPostsByCategory } from '@/services/postService';

export const metadata: Metadata = {
  title: 'Travel Articles | Tech Trails Tales',
  description: 'Discover travel destinations, tips, and stories from around the world.',
};

export default async function TravelCategoryPage() {
  // In a real implementation, we would use getPostsByCategory
  // const posts = await getPostsByCategory('travel');
  
  // For now, use mock data
  const posts = await getMockPostsByCategory('travel');
  
  return (
    <CategoryPage 
      title="Travel" 
      description="Journey through diverse destinations, cultures, and experiences from around the globe."
      posts={posts}
    />
  );
}

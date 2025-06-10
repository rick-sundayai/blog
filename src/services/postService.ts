// src/services/postService.ts
import { createClient } from '@/lib/supabase/server';
import { Post } from '@/types';

export async function getPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:users(full_name, avatar_url)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
    
  if (error) throw error;
  return data as Post[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:users(full_name, avatar_url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data as Post | null;
}

export async function getPostsByCategory(categorySlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:users(full_name, avatar_url), categories!post_categories(id, name, slug)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false });
    
  if (error) throw error;
  return data as Post[];
}

export async function getLatestPosts(limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:users(full_name, avatar_url)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data as Post[];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data;
}

// For now, until we have real data, let's add a mock function
export async function getMockPostsByCategory(category: string, limit = 10) {
  // This is a temporary function until we have real data in Supabase
  const allPosts = [
    {
      id: '1',
      title: 'The Future of AI in Everyday Tech',
      slug: 'future-of-ai-in-everyday-tech',
      content: 'How artificial intelligence is becoming an invisible part of the technology we use every day.',
      excerpt: 'How artificial intelligence is becoming an invisible part of the technology we use every day.',
      featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-25T10:00:00Z',
      updated_at: '2025-05-25T10:00:00Z',
      published_at: '2025-05-25T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'tech'
    },
    {
      id: '2',
      title: 'Hidden Gems in Kyoto: Beyond the Tourist Trail',
      slug: 'hidden-gems-in-kyoto',
      content: 'Discovering the lesser-known treasures of Japan\'s historic former capital.',
      excerpt: 'Discovering the lesser-known treasures of Japan\'s historic former capital.',
      featured_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-20T10:00:00Z',
      updated_at: '2025-05-20T10:00:00Z',
      published_at: '2025-05-20T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'travel'
    },
    {
      id: '3',
      title: 'How I Built a Smart Home System from Scratch',
      slug: 'smart-home-system-from-scratch',
      content: 'A step-by-step guide to creating your own integrated smart home ecosystem.',
      excerpt: 'A step-by-step guide to creating your own integrated smart home ecosystem.',
      featured_image: 'https://images.unsplash.com/photo-1558002038-1055e2dae1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-15T10:00:00Z',
      updated_at: '2025-05-15T10:00:00Z',
      published_at: '2025-05-15T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'tech'
    },
    {
      id: '4',
      title: 'Digital Nomad Life: One Month in Bali',
      slug: 'digital-nomad-life-bali',
      content: 'My experience working remotely from the Island of the Gods.',
      excerpt: 'My experience working remotely from the Island of the Gods.',
      featured_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-10T10:00:00Z',
      updated_at: '2025-05-10T10:00:00Z',
      published_at: '2025-05-10T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'travel'
    },
    {
      id: '5',
      title: 'The Art of Slow Travel: Embracing Local Culture',
      slug: 'art-of-slow-travel',
      content: 'How slowing down your travel pace can lead to more authentic experiences.',
      excerpt: 'How slowing down your travel pace can lead to more authentic experiences.',
      featured_image: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-05T10:00:00Z',
      updated_at: '2025-05-05T10:00:00Z',
      published_at: '2025-05-05T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'experience'
    },
    {
      id: '6',
      title: 'Web3 and the Future of Digital Ownership',
      slug: 'web3-digital-ownership',
      content: 'Exploring how blockchain technology is changing our concept of ownership in the digital realm.',
      excerpt: 'Exploring how blockchain technology is changing our concept of ownership in the digital realm.',
      featured_image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-05-01T10:00:00Z',
      updated_at: '2025-05-01T10:00:00Z',
      published_at: '2025-05-01T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'tech'
    },
    {
      id: '7',
      title: 'Finding Balance: Tech Detox While Traveling',
      slug: 'tech-detox-while-traveling',
      content: 'How to disconnect from technology and reconnect with yourself during your travels.',
      excerpt: 'How to disconnect from technology and reconnect with yourself during your travels.',
      featured_image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      created_at: '2025-04-25T10:00:00Z',
      updated_at: '2025-04-25T10:00:00Z',
      published_at: '2025-04-25T10:00:00Z',
      status: 'published',
      author_id: 'user1',
      author: { full_name: 'John Doe', avatar_url: null },
      category: 'experience'
    }
  ];
  
  return allPosts
    .filter(post => post.category.toLowerCase() === category.toLowerCase())
    .slice(0, limit) as Post[];
}
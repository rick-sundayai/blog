export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  author?: User;
  created_at: string;
  updated_at: string;
  published_at?: string;
  status: 'draft' | 'published';
  category?: string;
  categories?: Category[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PostCategory = {
  id: string;
  post_id: string;
  category_id: string;
};

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Post } from '@/types';
import { createClient } from '@/lib/supabase/client';

// Define the schema for post validation
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  featured_image: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: Post;
  isEditing?: boolean;
}

export const PostForm = ({ post, isEditing = false }: PostFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    status: post?.status || 'draft',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-'),
      }));
    }
  }, [formData.title, isEditing, formData.slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = postSchema.parse(formData);

      // Prepare post data
      const postData = {
        ...validatedData,
        updated_at: new Date().toISOString(),
        published_at: validatedData.status === 'published' ? new Date().toISOString() : null,
      };

      const supabase = createClient();
      
      if (isEditing && post) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase.from('posts').insert({
          ...postData,
          created_at: new Date().toISOString(),
          author_id: 'user_id', // Replace with actual user ID from auth context
        });

        if (error) throw error;
      }

      // Redirect to admin posts page
      router.push('/admin/posts');
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error submitting post:', error);
        setErrors({ form: 'Failed to save post. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{errors.form}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.title ? 'border-red-500' : ''
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.slug ? 'border-red-500' : ''
          }`}
        />
        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
      </div>

      <div>
        <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700">
          Featured Image URL
        </label>
        <input
          type="text"
          id="featured_image"
          name="featured_image"
          value={formData.featured_image || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          value={formData.content}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.content ? 'border-red-500' : ''
          }`}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

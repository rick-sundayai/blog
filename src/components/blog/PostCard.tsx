'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Create an excerpt from the content
  const createExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.featured_image && (
        <div className="relative h-48 w-full">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-gray-900 hover:text-indigo-600">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
        </p>
        <div className="text-gray-700 mb-4">
          {createExcerpt(post.content)}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;

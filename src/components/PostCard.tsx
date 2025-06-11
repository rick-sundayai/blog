// src/components/PostCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  variant?: "compact" | "compact-minimal" | "featured";
}

export default function PostCard({ post, variant = "compact" }: PostCardProps) {
  // Calculate estimated read time (1 min per 1000 chars)
  const readTime = Math.max(1, Math.ceil(post.content.length / 1000));
  
  // Format the date
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get excerpt from content if not provided
  const excerpt = post.excerpt || (post.content.length > 150
    ? `${post.content.substring(0, 150)}...`
    : post.content);
  
  if (variant === "featured") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={post.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">
            <Link href={`/blog/${post.slug}`} className="text-gray-900 hover:text-blue-600">
              {post.title}
            </Link>
          </h3>
          <p className="text-gray-700 mb-4">
            {excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{readTime} min read</span>
            {post.category && (
              <>
                <span className="mx-2">•</span>
                <Link 
                  href={`/category/${post.category}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </Link>
              </>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    );
  }
  
  // Default compact card
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={post.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="text-gray-900 hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{readTime} min read</span>
        </div>
        {variant !== "compact-minimal" && (
          <p className="text-gray-700 mb-4">
            {excerpt}
          </p>
        )}
        {post.category && (
          <div className="mb-4">
            <Link 
              href={`/category/${post.category}`}
              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
            >
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Link>
          </div>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

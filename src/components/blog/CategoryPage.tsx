'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';

interface CategoryPageProps {
  title: string;
  description: string;
  posts: Post[];
}

export default function CategoryPage({ title, description, posts }: CategoryPageProps) {
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  // Function to determine category badge class
  const getCategoryBadgeClass = (category?: string) => {
    if (!category) return 'category-tech';
    
    switch(category.toLowerCase()) {
      case 'tech': return 'category-tech';
      case 'travel': return 'category-travel';
      case 'experience': return 'category-experience';
      default: return 'category-tech';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={featuredPost.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <div>
              <div className="mb-3">
                <span className={`category-badge ${getCategoryBadgeClass(featuredPost.category)}`}>
                  {featuredPost.category || title}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <Link href={`/blog/${featuredPost.slug}`} className="text-gray-900 dark:text-white hover:text-primary">
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {featuredPost.excerpt || (featuredPost.content.length > 200
                  ? `${featuredPost.content.substring(0, 200)}...`
                  : featuredPost.content)}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                {featuredPost.author && (
                  <>
                    <span className="font-medium">{featuredPost.author.full_name}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span>{new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
                <span className="mx-2">•</span>
                <span>{Math.ceil(featuredPost.content.length / 1000)} min read</span>
              </div>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                Read More <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Other Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherPosts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'}
                alt={post.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className={`category-badge ${getCategoryBadgeClass(post.category)}`}>
                  {post.category || title}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                <Link href={`/blog/${post.slug}`} className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary">
                  {post.title}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                {post.author && (
                  <>
                    <span className="font-medium">{post.author.full_name}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
                <span className="mx-2">•</span>
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.excerpt || (post.content.length > 100
                  ? `${post.content.substring(0, 100)}...`
                  : post.content)}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                Read More <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

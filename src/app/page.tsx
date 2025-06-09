// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/services/postService";
import { Post } from "@/types";

export default async function Home() {
  const latestPosts = await getLatestPosts(6);
  const featuredPosts = latestPosts.slice(0, 2);
  const recentPosts = latestPosts.slice(2);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gray-900">Tech.</span>{" "}
          <span className="text-gray-900">Travel.</span>{" "}
          <span className="text-blue-500">Experience.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Exploring the digital landscape and the physical world, one story at a time. 
          Join me on this journey of discovery and innovation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/tech" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700"
          >
            Tech Stories
          </Link>
          <Link 
            href="/travel" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            Travel Adventures
          </Link>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
        <div className="space-y-12">
          {featuredPosts.map((post) => (
            <div key={post.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                  {post.excerpt || (post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content)}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Articles</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-full bg-gray-900 text-white text-sm">All</button>
            <button className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100">Tech</button>
            <button className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100">Travel</button>
            <button className="px-3 py-1 rounded-full bg-white text-gray-700 text-sm hover:bg-gray-100">Experience</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden">
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
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
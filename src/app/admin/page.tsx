'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // In a real app, you'd fetch these stats from Supabase
        // const { data: posts } = await supabase.from('posts').select('status');
        
        // For now, use mock data
        const mockPosts = [
          { status: 'published' },
          { status: 'published' },
          { status: 'published' },
          { status: 'draft' },
          { status: 'draft' },
        ];
        
        const totalPosts = mockPosts.length;
        const publishedPosts = mockPosts.filter(post => post.status === 'published').length;
        const draftPosts = mockPosts.filter(post => post.status === 'draft').length;
        
        setStats({
          totalPosts,
          publishedPosts,
          draftPosts,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your blog content and settings</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Posts</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalPosts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900">Published Posts</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.publishedPosts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900">Draft Posts</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.draftPosts}</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Post
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Manage Posts
          </Link>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => alert('This would open the n8n workflow editor')}
          >
            Manage Workflows
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => alert('This would open the Supabase dashboard')}
          >
            Database Settings
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Created Post
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &quot;Getting Started with Next.js&quot;
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  June 1, 2025
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Updated Post
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &quot;Working with Supabase&quot;
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  June 2, 2025
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Published Post
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  &quot;Automating Workflows with n8n&quot;
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  June 3, 2025
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

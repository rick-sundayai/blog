'use client';

import Link from 'next/link';

export default function QuickActions() {
  return (
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
  );
}

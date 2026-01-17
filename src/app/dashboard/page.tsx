'use client'

import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Eye } from 'lucide-react'
import { useAdminBlogPosts } from '@/lib/queries/blog'

export default function DashboardPage() {
  const { user, profile, signOut, loading } = useAuth()

  const { data: posts, isLoading: postsLoading } = useAdminBlogPosts(
    { author_id: user?.id },
    !!user
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null // Middleware will redirect
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const totalViews = posts?.reduce((acc, post) => acc + (post.view_count || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-text">Dashboard</h1>
              <p className="text-gray-400">Welcome to your dashboard</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* User Info Card */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-text">{user.email}</p>
              </div>
              
              {profile && (
                <>
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-text">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Joined</label>
                    <p className="text-text" suppressHydrationWarning>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-background rounded-lg transition-colors duration-200">
                Update Profile
              </button>
              <a 
                href="/dashboard/create-post"
                className="block w-full text-left px-3 py-2 text-primary hover:bg-background rounded-lg transition-colors duration-200"
              >
                Create New Post
              </a>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-background rounded-lg transition-colors duration-200">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-background rounded-lg transition-colors duration-200">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Account Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-primary">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Verified</span>
                <span className="text-primary">
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Login</span>
                <span className="text-text" suppressHydrationWarning>
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Posts</span>
                <span className="text-text">{posts?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Post Views</span>
                <span className="text-primary font-medium">{totalViews}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Posts Section */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text">My Posts</h2>
            <span className="text-sm text-muted-foreground">{posts?.length || 0} total</span>
          </div>

          {postsLoading ? (
             <div className="flex justify-center py-8">
               <LoadingSpinner />
             </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-background border border-border rounded-lg p-4 group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        <span>{post.view_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-text mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    <a href={`/dashboard/edit-post/${post.id}`} className="hover:underline">
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <a href={`/dashboard/edit-post/${post.id}`} className="text-sm text-primary hover:underline">
                      Edit
                    </a>
                    {post.status === 'published' && (
                      <>
                        <span className="text-gray-600">|</span>
                        <a href={`/blog/${post.slug}`} className="text-sm text-gray-500 hover:text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          View Live
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
               <p className="mb-4">You haven't created any posts yet.</p>
               <a 
                href="/dashboard/create-post"
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors duration-200"
              >
                Create your first post
              </a>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-surface rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-text mb-2">
            Welcome {profile?.first_name || 'User'}! 👋
          </h2>
          <p className="text-gray-400">
            This is your dashboard where you can manage your account and access all features. 
            This template provides a solid foundation for building authenticated applications 
            with Next.js 15 and Supabase.
          </p>
        </div>
      </main>
    </div>
  )
}
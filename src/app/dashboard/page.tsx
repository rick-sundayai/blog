'use client'

import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { user, profile, signOut, loading } = useAuth()

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <p className="text-text">
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
                <span className="text-text">
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
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
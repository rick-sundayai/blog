'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  fallbackUrl?: string
}

export default function AdminGuard({
  children,
  fallbackUrl = '/dashboard'
}: AdminGuardProps) {
  const { isAdmin, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.push(fallbackUrl)
    }
  }, [loading, user, isAdmin, router, fallbackUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}

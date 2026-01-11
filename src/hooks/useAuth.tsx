'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService } from '@/lib/auth/auth-service'
import type { AuthContextType, User, UserProfile, LoginForm, RegisterForm, ResetPasswordForm } from '@/lib/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const result = await authService.getCurrentUser()
      if (result) {
        setUser(result.user)
        setProfile(result.profile)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        setUser(user)
        const profile = await authService.getUserProfile(user.id)
        setProfile(profile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (credentials: LoginForm) => {
    const result = await authService.signIn(credentials)
    if (result.success && result.user) {
      setUser(result.user)
      const profile = await authService.getUserProfile(result.user.id)
      setProfile(profile)
    }
    return result
  }

  const signUp = async (credentials: RegisterForm) => {
    const result = await authService.signUp(credentials)
    return result
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
  }

  const resetPassword = async (data: ResetPasswordForm) => {
    return authService.resetPassword(data)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
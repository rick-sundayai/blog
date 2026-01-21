// Authentication Types
export interface User {
  id: string
  email?: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  created_at: string
  updated_at?: string
  app_metadata?: {
    provider?: string
    [key: string]: unknown
  }
  user_metadata?: {
    [key: string]: unknown
  }
}

export interface UserProfile {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface LoginForm {
  email: string
  password: string
}


export interface ResetPasswordForm {
  email: string
}

export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signIn: (credentials: LoginForm) => Promise<{ success: boolean; error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (data: ResetPasswordForm) => Promise<{ success: boolean; error: string | null }>
}
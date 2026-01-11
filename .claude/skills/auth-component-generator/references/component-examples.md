# Authentication Component Examples

## LoginForm Pattern
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    try {
      const validated = loginSchema.parse(data)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-background font-medium py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? <LoadingSpinner /> : 'Sign In'}
      </button>
    </form>
  )
}
```

## Error Handling Pattern
```tsx
const handleError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.errors[0].message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message as string
  }
  return 'An unexpected error occurred'
}
```

## Styling Classes Reference
- Primary button: `bg-primary text-background font-medium py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50`
- Input field: `w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary`
- Card/Container: `bg-surface border border-border rounded-lg p-6`
- Error message: `bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg`
- Success message: `bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg`
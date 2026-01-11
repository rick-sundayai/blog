---
name: auth-component-generator
description: Generate authentication-related components following the project's Next.js + Supabase patterns and conventions
tools: [Read, Write, Edit]
---

# Authentication Component Generator

This skill helps generate authentication-related components that follow the established patterns in this Next.js + Supabase authentication template.

## Instructions

When creating authentication components:

1. **Follow Project Conventions**:
   - Use TypeScript with proper typing from `src/lib/types/auth.ts`
   - Import Supabase client from `src/lib/supabase/client.ts`
   - Use the established dark theme styling with Tailwind CSS
   - Follow the naming conventions: PascalCase for components
   - Place components in appropriate directories under `src/components/`

2. **Authentication Patterns**:
   - Always use the `useAuth` hook from `src/hooks/useAuth.tsx` for user state
   - Handle loading states with the existing `LoadingSpinner` component
   - Use proper error handling patterns shown in existing auth forms
   - Follow the redirect patterns established in middleware

3. **Styling Guidelines**:
   - Use the established color scheme:
     - Background: `bg-background` (#191D24)
     - Surface: `bg-surface` (#2D3748)
     - Primary: `bg-primary` (#34D399)
     - Border: `border-border` (#4A5568)
     - Text: `text-text` (#F5F5F5)
   - Use consistent spacing and layout patterns from existing components
   - Ensure mobile responsiveness

4. **Security Considerations**:
   - Never expose sensitive data in client-side code
   - Always validate user input using Zod schemas
   - Use proper CSRF protection patterns
   - Follow Row Level Security (RLS) patterns for data access

## Component Templates

### Basic Auth Form Structure
```tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function AuthComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Component logic here
  
  if (loading) return <LoadingSpinner />
  
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Component content */}
    </div>
  )
}
```

### Form Validation Pattern
```tsx
import { z } from 'zod'

const schema = z.object({
  // Define validation rules
})

type FormData = z.infer<typeof schema>
```

## Usage Examples

- **Profile Settings Component**: "Create a user profile settings component that allows users to update their first name, last name, and avatar"
- **Password Change Form**: "Generate a password change component with current password verification"
- **Account Deletion Component**: "Create a component for account deletion with proper confirmation flow"
- **Email Verification Resend**: "Build a component to resend email verification with rate limiting"

## File Placement Guidelines

- **Auth Components**: `src/components/auth/`
- **UI Components**: `src/components/ui/`
- **Pages**: `src/app/[route]/page.tsx`
- **API Routes**: `src/app/api/[route]/route.ts`
- **Types**: Add to `src/lib/types/auth.ts`
- **Utilities**: `src/lib/auth/`

## Testing Considerations

- Ensure components work with both authenticated and unauthenticated states
- Test form validation with various input combinations
- Verify proper error handling for network failures
- Test responsive design on mobile devices
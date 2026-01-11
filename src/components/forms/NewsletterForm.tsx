'use client'

import { useState } from 'react'
import { useNewsletterSubscription } from '@/lib/queries/newsletter'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const subscription = useNewsletterSubscription()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return

    try {
      await subscription.mutateAsync({ email: email.trim() })
      setIsSubmitted(true)
      setEmail('')
    } catch (error) {
      // Error handling is managed by the mutation
      console.error('Newsletter subscription error:', error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-sm text-sm">
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-primary">
          ✓ Thanks for subscribing! You&apos;ll hear from us soon.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={subscription.isPending}
        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground disabled:opacity-50"
      />
      <button 
        type="submit"
        disabled={subscription.isPending || !email.trim()}
        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {subscription.isPending ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {subscription.isError && (
        <div className="absolute mt-12 text-xs text-destructive">
          {subscription.error?.message || 'Failed to subscribe'}
        </div>
      )}
    </form>
  )
}
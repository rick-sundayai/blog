// ============================================================================
// NEWSLETTER QUERIES
// React Query hooks for newsletter subscription management
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  NewsletterSubscriber,
  NewsletterSubscriptionForm,
  TABLE_NAMES,
} from '@/lib/types/blog'

// ============================================================================
// NEWSLETTER SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to newsletter
 */
export function useNewsletterSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subscriptionData: NewsletterSubscriptionForm): Promise<NewsletterSubscriber> => {
      const supabase = createClient()

      // Check if email is already subscribed
      const { data: existing } = await supabase
        .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
        .select('*')
        .eq('email', subscriptionData.email)
        .single()

      if (existing) {
        if (existing.status === 'active') {
          throw new Error('You are already subscribed to our newsletter!')
        }
        
        if (existing.status === 'unsubscribed') {
          // Reactivate subscription
          const { data, error } = await supabase
            .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
            .update({
              status: 'active',
              subscribed_at: new Date().toISOString(),
              unsubscribed_at: null,
            })
            .eq('email', subscriptionData.email)
            .select()
            .single()

          if (error) {
            throw new Error(`Failed to reactivate subscription: ${error.message}`)
          }

          return data
        }
      }

      // Create new subscription
      const { data, error } = await supabase
        .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
        .insert([
          {
            email: subscriptionData.email,
            status: 'active', // In production, you might want 'pending' until confirmed
            subscribed_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString(), // Auto-confirm for now
          },
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This email is already subscribed!')
        }
        throw new Error(`Failed to subscribe: ${error.message}`)
      }

      return data
    },
    onSuccess: (newSubscriber) => {
      // Invalidate admin newsletter queries
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] })
      
      // Add to cache optimistically for admin view
      queryClient.setQueryData<NewsletterSubscriber[]>(['newsletter-subscribers'], (old) => {
        if (!old) return [newSubscriber]
        return [newSubscriber, ...old]
      })
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error)
    },
  })
}

/**
 * Unsubscribe from newsletter
 */
export function useNewsletterUnsubscribe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      const supabase = createClient()

      const { error } = await supabase
        .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email)

      if (error) {
        throw new Error(`Failed to unsubscribe: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] })
    },
  })
}

// ============================================================================
// ADMIN NEWSLETTER QUERIES
// ============================================================================

/**
 * Get all newsletter subscribers (admin only)
 */
export function useNewsletterSubscribers(status?: NewsletterSubscriber['status']) {
  return useQuery({
    queryKey: ['newsletter-subscribers', status],
    queryFn: async (): Promise<NewsletterSubscriber[]> => {
      const supabase = createClient()

      let query = supabase
        .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
        .select('*')
        .order('subscribed_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch newsletter subscribers: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Get newsletter statistics
 */
export function useNewsletterStats() {
  return useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: async () => {
      const supabase = createClient()

      const [
        { count: totalSubscribers },
        { count: activeSubscribers },
        { count: unsubscribed },
      ] = await Promise.all([
        supabase
          .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
          .select('*', { count: 'exact', head: true }),
        supabase
          .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from(TABLE_NAMES.NEWSLETTER_SUBSCRIBERS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unsubscribed'),
      ])

      return {
        total: totalSubscribers || 0,
        active: activeSubscribers || 0,
        unsubscribed: unsubscribed || 0,
        growth_rate: 0, // TODO: Calculate based on time periods
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
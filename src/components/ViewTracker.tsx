'use client'

import { useEffect, useRef } from 'react'
import { useTrackPostView } from '@/lib/queries/blog'

interface ViewTrackerProps {
  postId: string
}

const VIEW_COOLDOWN_MS = 30 * 60 * 1000 // 30 minutes between views of same post
const STORAGE_KEY = 'post_views_tracked'

/**
 * Check if we should track this view (rate limiting)
 */
function shouldTrackView(postId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const viewedPosts: Record<string, number> = stored ? JSON.parse(stored) : {}

    const lastViewed = viewedPosts[postId]
    const now = Date.now()

    if (lastViewed && now - lastViewed < VIEW_COOLDOWN_MS) {
      return false // Still in cooldown period
    }

    // Update the timestamp
    viewedPosts[postId] = now

    // Clean up old entries (older than 24 hours)
    const dayAgo = now - 24 * 60 * 60 * 1000
    for (const [id, timestamp] of Object.entries(viewedPosts)) {
      if (timestamp < dayAgo) {
        delete viewedPosts[id]
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedPosts))
    return true
  } catch {
    // If localStorage fails, allow the view but don't spam
    return true
  }
}

/**
 * Client-side component that tracks a post view when it is mounted.
 * Includes rate limiting to prevent spam/abuse.
 */
export default function ViewTracker({ postId }: ViewTrackerProps) {
  const trackView = useTrackPostView()
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per mount and respect rate limits
    if (!tracked.current && postId && shouldTrackView(postId)) {
      trackView.mutate({ postId })
      tracked.current = true
    }
  }, [postId, trackView])

  return null
}

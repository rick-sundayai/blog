'use client'

import { useEffect, useRef } from 'react'
import { useTrackPostView } from '@/lib/queries/blog'

interface ViewTrackerProps {
  postId: string
}

/**
 * Client-side component that tracks a post view when it is mounted.
 * This ensures that views are tracked regardless of how the user reached the page
 * (direct navigation, link from home, etc.)
 */
export default function ViewTracker({ postId }: ViewTrackerProps) {
  const trackView = useTrackPostView()
  const tracked = useRef(false)

  useEffect(() => {
    // Only track once per mount to avoid double counting in dev or during strict mode double-invocations
    if (!tracked.current && postId) {
      trackView.mutate({ postId })
      tracked.current = true
    }
  }, [postId, trackView])

  return null // This component doesn't render anything
}

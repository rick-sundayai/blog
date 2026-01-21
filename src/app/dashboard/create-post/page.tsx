"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { CreateBlogPostForm } from "@/lib/types/blog"
import BlogPostForm from "@/components/dashboard/BlogPostForm"
import LoadingOverlay from "@/components/dashboard/LoadingOverlay"

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = async (data: Omit<CreateBlogPostForm, "author_id">) => {
    if (!user) {
      alert("You must be logged in to create a post")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Trigger n8n generation
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          author_id: user.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to trigger blog generation")
      }
      
      const result = await response.json()
      console.log("n8n generation result:", result)

      // 2. Redirect to the edit page for the new post
      // Robustly handle different response formats from n8n (sometimes it returns an array [ { ... } ])
      const responseData = Array.isArray(result) ? result[0] : result
      const postId = responseData?.id || responseData?.postId || (responseData?.url ? responseData.url.split('/').pop() : null)
      
      if (postId) {
        router.push(`/dashboard/edit-post/${postId}`)
      } else {
        console.error("No post ID returned from generation service:", result)
        throw new Error("Blog post was generated but we couldn't find the ID to redirect you. Please check your dashboard.")
      }
    } catch (err) {
      const error = err as Error
      console.error("Failed to create post:", error)
      setError(error)
      throw error // Let the form handle the error display
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay message="Generating your blog post with AI..." />}
      <BlogPostForm
        title="Create New Blog Post"
        description="Enter the content below. Our AI will automatically generate the title, excerpt, category, and featured image for your draft."
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isError={!!error}
        error={error}
        submitLabel="Create Draft with AI"
        isMinimal={true}
      />
    </>
  )
}

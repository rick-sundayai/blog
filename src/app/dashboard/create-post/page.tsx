"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { CreateBlogPostForm } from "@/lib/types/blog"
import BlogPostForm from "@/components/dashboard/BlogPostForm"

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
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          author_id: user.id,
          user_id: user.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to trigger blog generation")
      }
      
      router.push("/dashboard")
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
  )
}

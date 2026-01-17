"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { CreateBlogPostForm } from "@/lib/types/blog"
import { useCreateBlogPost } from "@/lib/queries/blog"
import BlogPostForm from "@/components/dashboard/BlogPostForm"
import LoadingOverlay from "@/components/dashboard/LoadingOverlay"

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const createPost = useCreateBlogPost()
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
      
      const generatedData = await response.json()
      console.log("Saving generated post to database:", generatedData)

      // 2. Save the generated data to Supabase
      // Note: We merging the original content with generated fields
      const newPost = await createPost.mutateAsync({
        title: generatedData.title || data.title || "Generated Blog Post",
        content: generatedData.content || data.content,
        excerpt: generatedData.excerpt || data.excerpt || "",
        featured_image_url: generatedData.featured_image_url || data.featured_image_url || "",
        status: "draft",
        author_id: user.id,
        category_id: generatedData.category_id || data.category_id,
        // n8n might not return a slug, the create mutation handles it
      })
      
      // 3. Redirect to the edit page for the new post
      router.push(`/dashboard/edit-post/${newPost.id}`)
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

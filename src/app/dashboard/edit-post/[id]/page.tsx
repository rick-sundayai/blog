"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAdminBlogPost, useUpdateBlogPost } from "@/lib/queries/blog"
import { CreateBlogPostForm } from "@/lib/types/blog"
import BlogPostForm from "@/components/dashboard/BlogPostForm"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  // Ensure id is a string, handle array case if necessary (though [id] usually gives string)
  // Ensure id is a string, handle array case if necessary (though [id] usually gives string)
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) || ""
  
  const { user } = useAuth()
  
  const { data: post, isLoading: postLoading, error: postError } = useAdminBlogPost(id)
  const updatePostMutation = useUpdateBlogPost()

  if (postLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Post</h1>
        <p className="text-gray-400 mb-6">
          {postError ? (postError as Error).message : "Post not found"}
        </p>
        <button 
          onClick={() => router.back()}
          className="bg-primary px-4 py-2 rounded text-white"
        >
          Go Back
        </button>
      </div>
    )
  }

  const handleSubmit = async (data: Omit<CreateBlogPostForm, "author_id">) => {
    if (!user) return

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        ...data,
        author_id: user.id
      })
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to update post:", error)
      throw error
    }
  }

  const initialData: Partial<CreateBlogPostForm> = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    category_id: post.category_id,
    featured_image_url: post.featured_image_url,
    status: post.status as "draft" | "published",
  }

  return (
    <BlogPostForm
      title="Edit Blog Post"
      description={`Editing "${post.title}"`}
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={updatePostMutation.isPending}
      isError={updatePostMutation.isError}
      error={updatePostMutation.error as Error}
      submitLabel="Update Post"
      isEditMode={true}
      postId={post.id}
    />
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBlogCategories } from "@/lib/queries/blog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { CreateBlogPostForm } from "@/lib/types/blog"
import { Sparkles, Loader2 } from "lucide-react"

interface BlogPostFormProps {
  initialData?: Partial<CreateBlogPostForm>
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  isError: boolean
  error: Error | null
  submitLabel: string
  title: string
  description: string
  isEditMode?: boolean
  isMinimal?: boolean
}

export default function BlogPostForm({
  initialData,
  onSubmit,
  isLoading,
  isError,
  error,
  submitLabel,
  title,
  description,
  isEditMode = false,
  isMinimal = false
}: BlogPostFormProps) {
  const router = useRouter()
  const { data: categories } = useBlogCategories()

  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<Omit<CreateBlogPostForm, "author_id">>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category_id: "",
    featured_image_url: "",
    status: "draft",
  })
  
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure values are not null/undefined for controlled inputs
        title: initialData.title || prev.title,
        slug: initialData.slug || prev.slug,
        content: initialData.content || prev.content,
        excerpt: initialData.excerpt || prev.excerpt,
        category_id: initialData.category_id || prev.category_id,
        featured_image_url: initialData.featured_image_url || prev.featured_image_url,
        status: initialData.status || prev.status,
      }))
    }
  }, [initialData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!formData.title && !isMinimal) {
      alert("Please enter a title first")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        content: data.content || prev.content,
        excerpt: data.excerpt || prev.excerpt,
        featured_image_url: data.featured_image_url || prev.featured_image_url,
        category_id: data.category_id || prev.category_id,
      }))
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content. Please try again."
      alert(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submissionData = { ...formData }
    // Clean up empty fields to null for database compatibility (especially UUIDs)
    Object.keys(submissionData).forEach(key => {
      const k = key as keyof typeof submissionData;
      if (submissionData[k] === "") {
        (submissionData as any)[k] = null;
      }
    });
    
    await onSubmit(submissionData)
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isMinimal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <div className="flex gap-2">
                    <Input
                      id="title"
                      name="title"
                      placeholder="Article Title"
                      value={formData.title}
                      onChange={handleChange}
                      required={!isMinimal}
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleGenerate}
                      disabled={isGenerating || !formData.title}
                      title="Generate content with AI"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <div className="relative">
                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id || ""}
                      onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      <option value="" disabled>Select category</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {!isMinimal && isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="article-url-slug"
                  value={formData.slug || ""}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty to auto-generate from title</p>
              </div>
            )}

            {!isMinimal && (
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  placeholder="Brief summary of the article..."
                  className="h-20"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required={!isMinimal}
                />
              </div>
            )}
            
            {!isMinimal && (
              <div className="space-y-2">
                <Label htmlFor="featured_image_url">Featured Image URL</Label>
                <Input
                  id="featured_image_url"
                  name="featured_image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.featured_image_url || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="# Introduction..."
                className="min-h-[400px] font-mono text-sm"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>
            
            {!isMinimal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isError && (
              <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-md">
                Error: {error instanceof Error ? error.message : "Failed to save post"}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isMinimal ? "Generating..." : "Saving...") : submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


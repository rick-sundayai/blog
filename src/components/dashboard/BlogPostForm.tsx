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
import { Sparkles, Loader2, Eye, Edit3, Wand2 } from "lucide-react"
import { markdownToSafeHtml } from "@/lib/utils/sanitize"
import { cn } from "@/lib/utils"

interface BlogPostFormProps {
  initialData?: Partial<CreateBlogPostForm>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  isError: boolean
  error: Error | null
  submitLabel: string
  title: string
  description: string
  isEditMode?: boolean
  isMinimal?: boolean
  postId?: string // ID of the post being edited (for refinement)
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
  isMinimal = false,
  postId
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

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [refinementInstructions, setRefinementInstructions] = useState("")
  const [showRefinement, setShowRefinement] = useState(false)
  
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

  const handleRefine = async () => {
    if (!refinementInstructions.trim()) {
      alert("Please enter refinement instructions")
      return
    }

    setIsRefining(true)
    try {
      const response = await fetch("/api/refine-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId, // Include the post ID for updating existing posts
          content: formData.content,
          instructions: refinementInstructions,
          title: formData.title,
          excerpt: formData.excerpt,
          category_id: formData.category_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refine content")
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
      
      setRefinementInstructions("")
      setShowRefinement(false)
      setActiveTab("edit") // Switch back to edit to see changes
    } catch (error) {
      console.error("Error refining content:", error)
      alert(error instanceof Error ? error.message : "Failed to refine content")
    } finally {
      setIsRefining(false)
    }
  }

  useEffect(() => {
    if (activeTab === "preview") {
      const updatePreview = async () => {
        setIsPreviewLoading(true)
        try {
          const html = await markdownToSafeHtml(formData.content || "")
          setPreviewHtml(html)
        } catch (error) {
          console.error("Failed to generate preview:", error)
          setPreviewHtml("<p class='text-red-500'>Error generating preview</p>")
        } finally {
          setIsPreviewLoading(false)
        }
      }
      updatePreview()
    }
  }, [activeTab, formData.content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submissionData = { ...formData }
    // Clean up empty fields to null for database compatibility (especially UUIDs)
    Object.keys(submissionData).forEach(key => {
      const k = key as keyof typeof submissionData;
      if (submissionData[k] === "") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (submissionData as any)[k] = null;
      }
    });
    
    await onSubmit(submissionData)
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {description}
              </CardDescription>
            </div>
            {!isMinimal && (
              <div className="flex bg-muted p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeTab === "edit" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeTab === "preview" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "edit" ? (
              <>
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

                {!isMinimal && (
                  <div className="border-t border-border/50 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Wand2 className="h-4 w-4 text-indigo-400" />
                          AI Refiner
                        </h3>
                        <p className="text-xs text-muted-foreground italic">
                          Need to adjust the tone, format, or content? Let the AI handle it.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "gap-2 transition-colors",
                          showRefinement && "bg-indigo-500/10 border-indigo-500/50"
                        )}
                        onClick={() => setShowRefinement(!showRefinement)}
                      >
                        {showRefinement ? "Cancel" : "Refine with AI"}
                      </Button>
                    </div>

                    {showRefinement && (
                      <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="refinementInstructions" className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                          Instructions for AI
                        </Label>
                        <Textarea
                          id="refinementInstructions"
                          placeholder="e.g., 'Make it more professional', 'Add a conclusion', 'Rewrite the intro'..."
                          value={refinementInstructions}
                          onChange={(e) => setRefinementInstructions(e.target.value)}
                          className="bg-background border-indigo-500/30 focus-visible:ring-indigo-500 min-h-[80px] text-sm"
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            disabled={isRefining || !refinementInstructions.trim()}
                            onClick={handleRefine}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                          >
                            {isRefining ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Sparkles className="h-3 w-3" />
                            )}
                            Apply Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-invert prose-lg max-w-none min-h-[500px] border border-border p-8 rounded-lg bg-background/50 shadow-inner overflow-y-auto">
                  {isPreviewLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                      <p className="text-sm font-medium">Rendering your masterpiece...</p>
                    </div>
                  ) : (
                    <article>
                      <header className="mb-8 border-b border-border pb-8">
                        <h1 className="text-4xl font-bold mb-4">{formData.title || "Untitled Post"}</h1>
                        {formData.excerpt && (
                          <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4">
                            {formData.excerpt}
                          </p>
                        )}
                      </header>

                      {formData.featured_image_url && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                          <img
                            src={formData.featured_image_url}
                            alt={formData.title}
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                      )}

                      <div 
                        className="leading-relaxed blog-content-preview"
                        dangerouslySetInnerHTML={{ __html: previewHtml || "<p class='text-muted-foreground'>Draft content will appear here.</p>" }}
                      />
                    </article>
                  )}
                </div>
              </div>
            )}

            {isError && (
              <div className="text-sm text-red-500 font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 block" />
                  {error instanceof Error ? error.message : "Failed to save post"}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isGenerating || isRefining}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isMinimal ? "Generating..." : "Saving..."}
                  </>
                ) : submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


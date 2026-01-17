"use client"

import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = "Processing..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card border shadow-2xl animate-in fade-in zoom-in duration-300">
        <LoadingSpinner size="lg" className="text-indigo-500" />
        <p className="text-lg font-medium text-foreground animate-pulse">
          {message}
        </p>
        <p className="text-sm text-muted-foreground italic text-center max-w-[250px]">
          Our AI is working its magic to generate your content.
        </p>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-3 w-3 border",
    md: "h-4 w-4 border-2",
    lg: "h-6 w-6 border-2",
  }

  return (
    <div
      className={cn(
        "border-primary animate-spin rounded-full border-t-transparent",
        sizeClasses[size],
        className
      )}
      aria-label="Loading..."
    />
  )
}

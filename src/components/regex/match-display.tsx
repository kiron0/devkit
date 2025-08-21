"use client"

import type { RegexTestResult } from "@/types/regex"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/common/empty-state"
import { LoadingSpinner } from "@/components/common/loading-spinner"

interface MatchDisplayProps {
  result: RegexTestResult
  isProcessing?: boolean
  className?: string
  showEmptyIcon?: boolean
}

export function MatchDisplay({
  result,
  isProcessing = false,
  className,
  showEmptyIcon = true,
}: MatchDisplayProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 overflow-auto rounded-md border p-3 font-mono text-xs sm:text-sm",
        className
      )}
    >
      {isProcessing ? (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : result.error ? (
        <div className="text-destructive">
          <strong>Error:</strong> {result.error}
        </div>
      ) : result.matches.length === 0 ? (
        <EmptyState
          icon={showEmptyIcon ? "❌" : undefined}
          title="No matches found"
          className={className}
        />
      ) : (
        <div
          className="leading-relaxed break-words whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: result.highlightedText }}
        />
      )}
    </div>
  )
}

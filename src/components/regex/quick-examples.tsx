"use client"

import { Zap } from "lucide-react"

import type { RegexExample } from "@/types/regex"
import { REGEX_EXAMPLES } from "@/lib/regex-engine"
import { Button } from "@/components/ui/button"

interface QuickExamplesProps {
  onLoadExample: (example: RegexExample) => void
  maxExamples?: number
  layout?: "horizontal" | "grid"
  className?: string
}

export function QuickExamples({
  onLoadExample,
  maxExamples = 6,
  layout = "horizontal",
  className,
}: QuickExamplesProps) {
  const examples = REGEX_EXAMPLES.slice(0, maxExamples)

  const layoutClasses = {
    horizontal: "flex flex-wrap gap-2",
    grid: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <label className="text-sm font-medium">Quick Examples</label>
      </div>
      <div className={layoutClasses[layout]}>
        {examples.map((example) => (
          <Button
            key={example.name}
            variant="outline"
            size={layout === "grid" ? "default" : "sm"}
            onClick={() => onLoadExample(example)}
            className={
              layout === "grid" ? "h-auto p-3 text-left" : "h-8 text-xs"
            }
          >
            {layout === "grid" ? (
              <div>
                <div className="text-xs font-medium">{example.name}</div>
                <div className="text-muted-foreground text-xs">
                  {example.description}
                </div>
              </div>
            ) : (
              example.name
            )}
          </Button>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Click any example to load it into the tester
      </p>
    </div>
  )
}

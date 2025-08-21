"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/common"

interface TestStringInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  rows?: number
  className?: string
  showCopyButton?: boolean
  textareaClassName?: string
}

export function TestStringInput({
  value,
  onChange,
  placeholder = "Enter text to test...",
  label = "Test String",
  rows = 5,
  className,
  showCopyButton = true,
  textareaClassName,
}: TestStringInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showCopyButton && value.trim() && (
          <CopyButton text={value} size="sm" />
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("font-mono text-sm sm:text-base", textareaClassName)}
        rows={rows}
      />
    </div>
  )
}

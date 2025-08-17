"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/common/copy-button"

interface TestStringInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  rows?: number
  className?: string
  showCopyButton?: boolean
}

export function TestStringInput({
  value,
  onChange,
  placeholder = "Enter text to test...",
  label = "Test String",
  rows = 5,
  className,
  showCopyButton = true,
}: TestStringInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
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
        className="resize-none font-mono text-sm sm:text-base"
        rows={rows}
      />
    </div>
  )
}

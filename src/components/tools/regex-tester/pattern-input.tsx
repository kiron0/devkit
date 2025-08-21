"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton } from "@/components/common"

interface PatternInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  showCopyButton?: boolean
}

export function PatternInput({
  value,
  onChange,
  placeholder = "Enter regex pattern...",
  label = "Regex Pattern",
  className,
  showCopyButton = true,
}: PatternInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showCopyButton && value.trim() && (
          <CopyButton text={value} size="sm" />
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-sm sm:text-base"
      />
    </div>
  )
}

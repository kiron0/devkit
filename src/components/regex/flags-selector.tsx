"use client"

import type { RegexFlags } from "@/types/regex"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const flagDefinitions = [
  {
    key: "global" as keyof RegexFlags,
    label: "g",
    description: "Find all matches, not just the first",
  },
  {
    key: "ignoreCase" as keyof RegexFlags,
    label: "i",
    description: "Case-insensitive matching",
  },
  {
    key: "multiline" as keyof RegexFlags,
    label: "m",
    description: "^ and $ match line breaks",
  },
  {
    key: "dotAll" as keyof RegexFlags,
    label: "s",
    description: ". matches newlines",
  },
  {
    key: "unicode" as keyof RegexFlags,
    label: "u",
    description: "Unicode support",
  },
  {
    key: "sticky" as keyof RegexFlags,
    label: "y",
    description: "Match at exact position",
  },
]

interface FlagsSelectorProps {
  flags: RegexFlags
  onChange: (flag: keyof RegexFlags, value: boolean) => void
  className?: string
}

export function FlagsSelector({
  flags,
  onChange,
  className,
}: FlagsSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium">Flags</Label>
      <div className="grid grid-cols-2 gap-3">
        {flagDefinitions.map(({ key, label, description }) => (
          <div key={key} className="flex items-start space-x-2">
            <Checkbox
              id={`flag-${key}`}
              checked={flags[key]}
              onCheckedChange={(checked) => onChange(key, checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={`flag-${key}`}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-1.5 py-0.5 font-mono text-xs"
                  >
                    {label}
                  </Badge>
                  <span className="text-xs">
                    {label === "g" ? "global" : key}
                  </span>
                </div>
              </Label>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

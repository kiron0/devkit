import { Badge } from "@/components/ui/badge"

interface ValidationBadgeProps {
  isValid: boolean | null
  validText?: string
  invalidText?: string
  className?: string
}

export function ValidationBadge({
  isValid,
  validText = "✓ Valid",
  invalidText = "✗ Invalid",
  className = "",
}: ValidationBadgeProps) {
  if (isValid === null) return null

  return (
    <Badge
      variant={isValid ? "default" : "destructive"}
      className={`text-xs ${className}`}
    >
      {isValid ? validText : invalidText}
    </Badge>
  )
}

"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "lg" | "icon" | "default" | null | undefined
  showText?: boolean
}

export function CopyButton({
  text,
  className,
  variant = "outline",
  size = "sm",
  showText = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      disabled={!text.trim()}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {showText && (copied ? "Copied!" : "Copy")}
    </Button>
  )
}

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ToolControlsProps {
  children: ReactNode
  className?: string
}

export function ToolControls({ children, className = "" }: ToolControlsProps) {
  return (
    <div className={cn("mb-6 flex flex-wrap gap-2", className)}>{children}</div>
  )
}

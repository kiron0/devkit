import { ReactNode } from "react"

interface ToolControlsProps {
  children: ReactNode
  className?: string
}

export function ToolControls({ children, className = "" }: ToolControlsProps) {
  return (
    <div className={`mb-6 flex flex-wrap gap-2 ${className}`}>{children}</div>
  )
}

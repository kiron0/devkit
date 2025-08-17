import { ReactNode } from "react"

interface ToolLayoutProps {
  children: ReactNode
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

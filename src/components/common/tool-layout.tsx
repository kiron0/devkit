import { ReactNode } from "react"

interface ToolLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="space-y-2 py-6 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {description}
        </p>
      </div>
      <div className="container mx-auto px-4 py-4 md:py-6">{children}</div>
    </div>
  )
}

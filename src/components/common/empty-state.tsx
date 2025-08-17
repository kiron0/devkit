"use client"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[120px] items-center justify-center text-center",
        className
      )}
    >
      <div className="space-y-2">
        {icon && <div className="text-2xl">{icon}</div>}
        <div className="text-muted-foreground text-sm font-medium">{title}</div>
        {description && (
          <div className="text-muted-foreground text-xs">{description}</div>
        )}
        {children}
      </div>
    </div>
  )
}

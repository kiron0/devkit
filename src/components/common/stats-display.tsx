"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatItem {
  label: string
  value: string | number
  variant?: "default" | "secondary" | "outline" | "destructive"
}

interface StatsDisplayProps {
  stats: StatItem[]
  className?: string
}

export function StatsDisplay({ stats, className }: StatsDisplayProps) {
  if (stats.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-3 text-sm", className)}>
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-1">
          <Badge variant={stat.variant || "secondary"} className="text-xs">
            {stat.value}
          </Badge>
          <span className="text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

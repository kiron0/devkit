"use client"

import type { RegexTestResult } from "@/types/regex"
import { StatsDisplay } from "@/components/common/stats-display"

interface MatchStatsProps {
  result: RegexTestResult
  showResults?: boolean
  className?: string
}

export function MatchStats({
  result,
  showResults = true,
  className,
}: MatchStatsProps) {
  if (!showResults || result.matches.length === 0) {
    return null
  }

  const stats = [
    {
      label: "matches",
      value: result.stats.matchCount,
      variant: "secondary" as const,
    },
    {
      label: "time",
      value: `${result.stats.executionTime.toFixed(1)}ms`,
      variant: "outline" as const,
    },
  ]

  // Add groups count if any matches have groups
  const groupsCount = result.matches.reduce(
    (count, match) => count + (match.groups ? match.groups.length : 0),
    0
  )

  if (groupsCount > 0) {
    stats.push({
      label: "groups",
      value: groupsCount.toString(),
      variant: "outline" as const,
    })
  }

  return <StatsDisplay stats={stats} className={className} />
}

import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

type RenderUntilProps = {
  loading?: boolean
  children: React.ReactNode
  /** optional custom fallback */
  fallback?: React.ReactNode
  /** optional skeleton className when using default fallback */
  skeletonClassName?: string
}

export function RenderUntil({
  loading = false,
  children,
  fallback,
  skeletonClassName = "h-4 w-full",
}: RenderUntilProps) {
  if (loading) {
    return <>{fallback ?? <Skeleton className={skeletonClassName} />}</>
  }

  return <>{children}</>
}

export default RenderUntil

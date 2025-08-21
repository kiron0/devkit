import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">404 Not Found!</h1>
      <p>The page you found, doesn&apos;t exist..!</p>
      <Link
        href="/"
        className={buttonVariants({ variant: "outline", className: "mt-4" })}
      >
        <ChevronLeft className="h-4 w-4" />
        Go to Home
      </Link>
    </div>
  )
}

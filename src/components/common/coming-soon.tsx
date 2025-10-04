"use client"

import * as React from "react"
import Link from "next/link"
import { ToolCase } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export const ComingSoon = () => {
  const [dots, setDots] = React.useState("")

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev: string) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-150px)] flex-col items-center justify-center gap-8 px-4 py-10 md:py-6">
      <div className="relative">
        <div className="from-primary/90 to-primary/50 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-2xl">
          <svg
            className="h-12 w-12 animate-pulse text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>

        <div className="absolute -top-2 -right-2 h-4 w-4 animate-bounce rounded-full bg-yellow-400" />
        <div
          className="absolute -bottom-1 -left-1 h-3 w-3 animate-bounce rounded-full bg-pink-400"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-1/2 -left-3 h-2 w-2 animate-bounce rounded-full bg-green-400"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-primary text-4xl font-bold">Coming Soon</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We&apos;re working hard to bring you this amazing tool
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stay tuned for updates{dots}
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-primary/10 mb-3 flex h-8 w-8 items-center justify-center rounded-lg">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
            Fast & Reliable
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Lightning-fast performance
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-primary/10 mb-3 flex h-8 w-8 items-center justify-center rounded-lg">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
            Easy to Use
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Intuitive interface
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-primary/10 mb-3 flex h-8 w-8 items-center justify-center rounded-lg">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
            Secure
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Privacy-focused design
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/tools"
          className={buttonVariants({
            size: "lg",
            className:
              "h-12 transform shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl has-[>svg]:px-6",
          })}
        >
          <ToolCase className="h-4 w-4" />
          Explore other tools
        </Link>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/20 absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full opacity-20 mix-blend-multiply blur-xl filter" />
        <div
          className="bg-primary/15 absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full opacity-20 mix-blend-multiply blur-xl filter"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="bg-primary/10 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full opacity-20 mix-blend-multiply blur-xl filter"
          style={{ animationDelay: "4s" }}
        />
      </div>
    </div>
  )
}

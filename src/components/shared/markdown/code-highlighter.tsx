"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"

import { cn } from "@/lib/utils"

interface CodeHighlighterProps {
  children: string
  language?: string
  className?: string
}

export function CodeHighlighter({
  children,
  language = "text",
  className,
}: CodeHighlighterProps) {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme || "light"

  const style = React.useMemo(() => {
    return currentTheme === "dark" ? oneDark : oneLight
  }, [currentTheme])

  return (
    <div className={cn("markdown-preview rounded-lg border", className)}>
      <div className="overflow-auto p-4">
        <SyntaxHighlighter
          language={language}
          style={style}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            borderRadius: "0",
            minWidth: "100%",
            maxWidth: "100%",
            overflow: "auto",
          }}
          showLineNumbers={false}
          wrapLines={false}
          wrapLongLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

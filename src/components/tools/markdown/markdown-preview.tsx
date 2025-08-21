import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

import { CodeHighlighter } from "./code-highlighter"

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({
  content,
  className = "",
}: MarkdownPreviewProps) {
  return (
    <div
      className={cn(
        "markdown-preview prose prose-sm prose-gray dark:prose-invert w-full max-w-none break-all",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : "text"
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className={cn(
                    "bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono text-sm",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <CodeHighlighter language={language}>
                {String(children).replace(/\n$/, "")}
              </CodeHighlighter>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

"use client"

import { useState } from "react"
import { FileText, RotateCcw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

import { MarkdownPreview } from "./markdown-preview"

export function MarkdownTool() {
  const [input, setInput] = useState<string>("# Markdown\n\nType here...")

  const handleSampleData = () => {
    const sampleMarkdown = `# Welcome to DevTools Hub

## Features

- **Real-time Preview**: See your markdown as you type
- **Syntax Highlighting**: Beautiful code blocks
- **Responsive Design**: Works on all devices

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Preview | ✅ | High |
| Export | 🚧 | Medium |
| Themes | 📋 | Low |

> **Note**: This is a sample markdown document to help you get started.

---

*Happy coding!* 🚀`
    setInput(sampleMarkdown)
  }

  const clear = () => {
    setInput("")
  }

  const stats = [
    {
      label: "Characters",
      value: input.length.toString(),
      icon: "📝",
    },
    {
      label: "Lines",
      value: input.split("\n").length.toString(),
      icon: "📄",
    },
    {
      label: "Words",
      value: input.split(/\s+/).filter(Boolean).length.toString(),
      icon: "🔤",
    },
  ]

  const features = getCommonFeatures(["REAL_TIME", "COPY_READY", "PRIVACY"])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={clear} variant="outline" disabled={!input}>
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Markdown</CardTitle>
              <CopyButton text={input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="max-h-[360px] min-h-[360px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Preview (basic)</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-h-[360px] min-h-[360px] overflow-y-auto pt-0">
            <MarkdownPreview content={input} />
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

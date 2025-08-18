"use client"

import { useCallback, useState } from "react"
import { Code, RotateCcw } from "lucide-react"

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
  ValidationBadge,
} from "@/components/common"
import { CodeHighlighter } from "@/components/shared/markdown/code-highlighter"

type TypeAccumulator = Record<string, string>

function toTypeScript(
  name: string,
  value: unknown,
  acc: TypeAccumulator
): string {
  const typeOf = (v: unknown): string => {
    if (v === null) return "null"
    if (Array.isArray(v)) return "array"
    return typeof v
  }

  const formatInterfaceName = (n: string) =>
    n.replace(/[^a-zA-Z0-9]/g, "_").replace(/^[0-9]/, "_$&")

  const t = typeOf(value)
  switch (t) {
    case "string":
      return "string"
    case "number":
      return "number"
    case "boolean":
      return "boolean"
    case "null":
      return "null"
    case "array": {
      const arr = value as unknown[]
      const inner = arr.length
        ? toTypeScript(name + "Item", arr[0], acc)
        : "unknown"
      return `${inner}[]`
    }
    case "object": {
      const obj = value as Record<string, unknown>
      const ifaceName = formatInterfaceName(name || "Root")
      const fields = Object.entries(obj)
        .map(
          ([k, v]) =>
            `  ${JSON.stringify(k)}: ${toTypeScript(ifaceName + capitalize(k), v, acc)};`
        )
        .join("\n")
      acc[ifaceName] = `interface ${ifaceName} {\n${fields}\n}`
      return ifaceName
    }
    default:
      return "unknown"
  }
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function generateTypes(name: string, json: unknown): string {
  const acc: TypeAccumulator = {}
  const root = toTypeScript(name || "Root", json, acc)
  const blocks = Object.values(acc)
  if (!blocks.length && root) return `type ${name || "Root"} = ${root}`
  return blocks.join("\n\n")
}

export function JsonToTypescript() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setIsValid(null)
      return
    }
    try {
      // Try to parse as JSON5 or fallback to JSON
      let obj: unknown
      try {
        // Try JSON5 if available (optional, fallback to JSON)
        // @ts-expect-error - JSON5 is a global variable
        if (typeof window !== "undefined" && window.JSON5) {
          // @ts-expect-error - JSON5 is a global variable
          obj = window.JSON5.parse(input)
        } else {
          obj = JSON.parse(input)
        }
      } catch {
        obj = JSON.parse(input)
      }

      // Deep type analysis: try to infer literal types for small enums, union types for arrays, etc.
      // For now, just use generateTypes, but could be extended for more advanced inference.
      const types = generateTypes("Root", obj)

      // Optionally, run a quick validation for circular references or very deep objects
      const checkDepth = (value: unknown, depth = 0): boolean => {
        if (depth > 20) return false // Too deep, likely recursive
        if (typeof value !== "object" || value === null) return true
        if (Array.isArray(value))
          return value.every((v) => checkDepth(v, depth + 1))
        return Object.values(value).every((v) => checkDepth(v, depth + 1))
      }
      if (!checkDepth(obj)) {
        setOutput("// Error: JSON structure is too deeply nested or recursive.")
        setIsValid(false)
        return
      }

      // Optionally, pretty-print the output and add a comment header
      const header = `// TypeScript interfaces generated from JSON\n// Generated at: ${new Date().toLocaleString()}\n`
      setOutput(header + types)
      setIsValid(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setOutput(`// Error: ${err?.message || "Invalid JSON"}`)
      setIsValid(false)
    }
  }, [input])

  const clear = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
  }

  const handleSampleData = () => {
    const sampleJSON = {
      user: {
        id: 123,
        name: "John Doe",
        email: "john@example.com",
        profile: {
          avatar: "https://example.com/avatar.jpg",
          bio: "Software Developer",
          skills: ["JavaScript", "TypeScript", "React"],
          metadata: {
            created: "2023-01-15",
            lastLogin: "2024-01-20T10:30:00Z",
            preferences: {
              theme: "dark",
              notifications: true,
              language: "en",
            },
          },
        },
        posts: [
          {
            id: 1,
            title: "Getting Started with TypeScript",
            content: "TypeScript is a powerful superset of JavaScript...",
            tags: ["typescript", "javascript", "tutorial"],
            published: true,
            createdAt: "2024-01-15T09:00:00Z",
          },
        ],
      },
    }
    setInput(JSON.stringify(sampleJSON, null, 2))
    setIsValid(null)
  }

  const stats = [
    {
      label: "Input Length",
      value: input.length.toString(),
      icon: "📝",
    },
    {
      label: "Output Length",
      value: output.length.toString(),
      icon: "📄",
    },
    {
      label: "Valid",
      value: isValid === null ? "N/A" : isValid ? "Yes" : "No",
      icon: isValid === null ? "❓" : isValid ? "✅" : "❌",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={convert}>Convert</Button>
        <Button onClick={clear} variant="outline" disabled={!input && !output}>
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <Code className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      {isValid !== null && (
        <div className="mb-4">
          <ValidationBadge
            isValid={isValid}
            validText="✓ Converted"
            invalidText="✗ Invalid JSON"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">JSON</CardTitle>
              <CopyButton text={input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder='{"name": "Alice", "age": 30}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">TypeScript</CardTitle>
              <CopyButton text={output} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {output ? (
              <CodeHighlighter
                language="typescript"
                className="max-h-[300px] min-h-[300px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[300px] min-h-[300px] items-center justify-center rounded-md border bg-transparent text-sm">
                Converted TypeScript will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

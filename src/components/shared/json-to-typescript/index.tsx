"use client"

import { useCallback, useState } from "react"
import { Code, RotateCcw, Upload, Zap } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { useToolControls } from "@/hooks/use-tool-controls"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  FileInfoCard,
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
            `  ${k}: ${toTypeScript(ifaceName + capitalize(k), v, acc)};`
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
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
    type: string
  } | null>(null)

  const { handleFileUpload: handleFileUploadBase } = useToolControls({
    hasData: !!input || !!output,
  })

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUploadBase(event, (content: string, filename: string) => {
        setInput(content)
        setFileInfo({
          name: filename,
          size: event.target.files?.[0]?.size || 0,
          type: event.target.files?.[0]?.type || "text/plain",
        })
        setIsValid(null)
        setOutput("")
      })
    },
    [handleFileUploadBase]
  )

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setIsValid(null)
      return
    }
    try {
      let obj: unknown
      try {
        obj = JSON.parse(input)
      } catch {
        obj = JSON.parse(input)
      }

      const types = generateTypes("Root", obj)

      const checkDepth = (value: unknown, depth = 0): boolean => {
        if (depth > 20) return false
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

      setOutput(types)
      setIsValid(true)
    } catch (err: unknown) {
      setOutput(
        `// Error: ${err instanceof Error ? err.message : "Invalid JSON"}`
      )
      setIsValid(false)
    }
  }, [input])

  const clear = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setFileInfo(null)
  }

  const formatJSON = useCallback(() => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setInput(formatted)
      setIsValid(null)
    } catch (err: unknown) {
      console.error(err)
    }
  }, [input])

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

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
    "FILE_SUPPORT",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={convert} disabled={!input.trim()}>
          Convert
        </Button>
        <Button
          onClick={formatJSON}
          variant="outline"
          disabled={!input.trim() || isValid === false}
        >
          <Zap className="h-4 w-4" />
          Format
        </Button>
        <Button onClick={clear} variant="outline" disabled={!input && !output}>
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <Code className="h-4 w-4" />
          Sample
        </Button>
        <Label className="inline-flex">
          <Button variant="outline" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Upload JSON
            </span>
          </Button>
          <input
            type="file"
            accept=".json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Label>
      </ToolControls>

      {/* File Info */}
      {fileInfo && (
        <FileInfoCard
          fileInfo={fileInfo}
          onRemove={() => setFileInfo(null)}
          className="mb-4"
        />
      )}

      {isValid !== null && (
        <div className="mb-4">
          <ValidationBadge
            isValid={isValid}
            validText="✓ Converted"
            invalidText="✗ Invalid JSON"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

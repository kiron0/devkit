"use client"

import { useCallback, useState } from "react"
import { Download, FileText, RotateCcw, Upload, Zap } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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

interface JSONError {
  message: string
  line?: number
  column?: number
}

export function JSONFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<JSONError | null>(null)
  const [isMinified, setIsMinified] = useState(false)
  const { toast } = useToast()

  const formatJSON = useCallback(
    (jsonString: string, minify: boolean = false) => {
      if (!jsonString.trim()) {
        setOutput("")
        setIsValid(null)
        setError(null)
        return
      }

      try {
        const parsed = JSON.parse(jsonString)
        const formatted = minify
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, 2)

        setOutput(formatted)
        setIsValid(true)
        setError(null)
        setIsMinified(minify)
      } catch (err) {
        setIsValid(false)
        setOutput("")

        if (err instanceof SyntaxError) {
          const match = err.message.match(/at position (\d+)/)
          const position = match ? parseInt(match[1]) : 0

          // Calculate line and column from position
          const lines = jsonString.substring(0, position).split("\n")
          const line = lines.length
          const column = lines[lines.length - 1].length + 1

          setError({
            message: err.message,
            line,
            column,
          })
        } else {
          setError({
            message: "Invalid JSON format",
          })
        }
      }
    },
    []
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    formatJSON(value, isMinified)
  }

  const handleMinify = () => {
    if (input.trim()) {
      formatJSON(input, true)
    }
  }

  const handleFormat = () => {
    if (input.trim()) {
      formatJSON(input, false)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setError(null)
    setIsMinified(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
        formatJSON(content, isMinified)
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!output) return

    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `formatted-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "JSON file has been downloaded",
    })
  }

  const handleSampleData = () => {
    const sampleJSON = {
      name: "DevTools Hub",
      version: "1.0.0",
      description: "Professional development tools suite",
      features: [
        "JSON Formatter",
        "Regex Tester",
        "Base64 Encoder",
        "Password Generator",
      ],
      config: {
        theme: "auto",
        autoSave: true,
        performance: {
          debounceMs: 300,
          maxFileSize: "10MB",
        },
      },
      stats: {
        users: 10000,
        tools: 9,
        uptime: 99.9,
      },
    }

    const jsonString = JSON.stringify(sampleJSON, null, 2)
    setInput(jsonString)
    formatJSON(jsonString, isMinified)
  }

  const stats = [
    {
      label: "Characters",
      value: input.length.toLocaleString(),
      icon: "📝",
    },
    {
      label: "Lines",
      value: input.split("\n").length.toLocaleString(),
      icon: "📄",
    },
    {
      label: "Size",
      value: `${(new Blob([input]).size / 1024).toFixed(1)} KB`,
      icon: "💾",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "FILE_SUPPORT",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      {/* Controls */}
      <ToolControls>
        <Button onClick={handleFormat} disabled={!input.trim()}>
          <Zap className="h-4 w-4" />
          Format
        </Button>
        <Button
          onClick={handleMinify}
          variant="outline"
          disabled={!input.trim()}
        >
          <FileText className="h-4 w-4" />
          Minify
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!input.trim()}
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample Data
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
        {output && (
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </ToolControls>

      {/* Stats */}
      {input && (
        <div className="mb-6">
          <StatsDisplay stats={stats} />
        </div>
      )}

      {/* Status Badge */}
      {isValid !== null && (
        <div className="mb-4 flex items-center gap-2">
          <ValidationBadge
            isValid={isValid}
            validText="✓ Valid JSON"
            invalidText="✗ Invalid JSON"
          />
          {isValid && isMinified && <Badge variant="secondary">Minified</Badge>}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 dark:text-red-400">
              JSON Parse Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
            {error.line && error.column && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-500">
                Line {error.line}, Column {error.column}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Input JSON</CardTitle>
              <CopyButton text={input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="max-h-[400px] min-h-[400px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Formatted JSON</CardTitle>
              <CopyButton text={output} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {output ? (
              <CodeHighlighter
                language="json"
                className="max-h-[400px] min-h-[400px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[400px] min-h-[400px] items-center justify-center rounded-md border bg-transparent text-sm">
                Formatted JSON will appear here...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

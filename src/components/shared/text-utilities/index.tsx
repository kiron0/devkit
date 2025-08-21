"use client"

import { useCallback, useState } from "react"
import { Config } from "@/config"
import { FileText, RotateCcw, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
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
} from "@/components/common"

interface TextAnalysis {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  averageWordsPerSentence: number
  readingTime: number
}

export function TextUtilities() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [selectedOperation, setSelectedOperation] = useState("analyze")
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [comparisonText, setComparisonText] = useState("")
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
    type: string
  } | null>(null)

  const analyzeText = useCallback((text: string): TextAnalysis => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim()
      ? text.split(/[.!?]+/).filter((s) => s.trim()).length
      : 0
    const paragraphs = text.trim()
      ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0
    const lines = text.split(/\n/).length
    const averageWordsPerSentence =
      sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0
    const readingTime = Math.ceil(words / 200) // Assuming 200 words per minute

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      averageWordsPerSentence,
      readingTime,
    }
  }, [])

  const performOperation = useCallback(
    (text: string, operation: string): string => {
      switch (operation) {
        case "uppercase":
          return text.toUpperCase()
        case "lowercase":
          return text.toLowerCase()
        case "title":
          return text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
        case "sentence":
          return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        case "camel":
          return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
              return index === 0 ? word.toLowerCase() : word.toUpperCase()
            })
            .replace(/\s+/g, "")
        case "pascal":
          return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
              return word.toUpperCase()
            })
            .replace(/\s+/g, "")
        case "snake":
          return text.toLowerCase().replace(/\s+/g, "_")
        case "kebab":
          return text.toLowerCase().replace(/\s+/g, "-")
        case "reverse":
          return text.split("").reverse().join("")
        case "reverse-words":
          return text.split(" ").reverse().join(" ")
        case "remove-spaces":
          return text.replace(/\s+/g, "")
        case "remove-newlines":
          return text.replace(/\n/g, " ").replace(/\s+/g, " ")
        case "remove-duplicates":
          return [...new Set(text.split(/\s+/))].join(" ")
        case "sort-lines":
          return text.split("\n").sort().join("\n")
        case "sort-words":
          return text.split(/\s+/).sort().join(" ")
        case "word-wrap":
          return text.replace(/(.{80})/g, "$1\n")
        default:
          return text
      }
    },
    []
  )

  const handleInputChange = (value: string) => {
    setInputText(value)
    setAnalysis(analyzeText(value))

    if (selectedOperation !== "analyze" && selectedOperation !== "compare") {
      setOutputText(performOperation(value, selectedOperation))
    }
  }

  const handleOperationChange = (operation: string) => {
    setSelectedOperation(operation)

    if (operation === "analyze") {
      setOutputText("")
      setAnalysis(analyzeText(inputText))
    } else if (operation === "compare") {
      setOutputText("")
    } else {
      setOutputText(performOperation(inputText, operation))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText(content)
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
        })
        handleInputChange(content)
      }
      reader.readAsText(file)
    }
  }

  const handleSampleData = () => {
    const sampleText = `${Config.title}: Professional Development Tools

Welcome to ${Config.title}, your comprehensive suite of development tools. Our platform offers a wide range of utilities designed to streamline your development workflow.

Key Features:
- JSON Formatter and Validator
- Base64 Encoder/Decoder
- Password Generator
- Hash Generator
- Color Converter
- UUID Generator
- URL Encoder/Decoder
- Text Utilities

Each tool is built with modern web technologies and provides real-time processing, beautiful interfaces, and comprehensive functionality. Whether you're a seasoned developer or just starting out, ${Config.title} has the tools you need to be productive.

Join thousands of developers who trust ${Config.title} for their daily development tasks!`

    setInputText(sampleText)
    handleInputChange(sampleText)
  }

  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setAnalysis(null)
    setComparisonText("")
    setFileInfo(null)
  }

  const getTextDifferences = useCallback((text1: string, text2: string) => {
    const words1 = text1.split(/\s+/)
    const words2 = text2.split(/\s+/)

    const maxLength = Math.max(words1.length, words2.length)
    const differences = []

    for (let i = 0; i < maxLength; i++) {
      const word1 = words1[i] || ""
      const word2 = words2[i] || ""

      if (word1 !== word2) {
        differences.push({
          position: i,
          original: word1,
          comparison: word2,
        })
      }
    }

    return differences
  }, [])

  const operations = [
    {
      id: "analyze",
      name: "Analyze",
      description: "Text analysis and statistics",
    },
    { id: "compare", name: "Compare", description: "Compare two texts" },
    { id: "uppercase", name: "UPPERCASE", description: "Convert to uppercase" },
    { id: "lowercase", name: "lowercase", description: "Convert to lowercase" },
    { id: "title", name: "Title Case", description: "Convert to title case" },
    {
      id: "sentence",
      name: "Sentence case",
      description: "Convert to sentence case",
    },
    { id: "camel", name: "camelCase", description: "Convert to camelCase" },
    { id: "pascal", name: "PascalCase", description: "Convert to PascalCase" },
    { id: "snake", name: "snake_case", description: "Convert to snake_case" },
    { id: "kebab", name: "kebab-case", description: "Convert to kebab-case" },
    { id: "reverse", name: "Reverse", description: "Reverse character order" },
    {
      id: "reverse-words",
      name: "Reverse Words",
      description: "Reverse word order",
    },
    {
      id: "remove-spaces",
      name: "Remove Spaces",
      description: "Remove all spaces",
    },
    {
      id: "remove-newlines",
      name: "Remove Newlines",
      description: "Remove line breaks",
    },
    {
      id: "remove-duplicates",
      name: "Remove Duplicates",
      description: "Remove duplicate words",
    },
    {
      id: "sort-lines",
      name: "Sort Lines",
      description: "Sort lines alphabetically",
    },
    {
      id: "sort-words",
      name: "Sort Words",
      description: "Sort words alphabetically",
    },
    {
      id: "word-wrap",
      name: "Word Wrap",
      description: "Wrap at 80 characters",
    },
  ]

  const differences =
    selectedOperation === "compare" && inputText && comparisonText
      ? getTextDifferences(inputText, comparisonText)
      : []

  const features = [
    {
      icon: "📊",
      title: "Text Analysis",
      description: "Comprehensive statistics and metrics",
    },
    {
      icon: "🔄",
      title: "Case Conversion",
      description: "Multiple case formats and styles",
    },
    {
      icon: "🔍",
      title: "Text Comparison",
      description: "Find differences between texts",
    },
    {
      icon: "⚡",
      title: "Real-time",
      description: "Instant processing and results",
    },
  ]

  return (
    <ToolLayout>
      {/* Controls */}
      <ToolControls>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample Text
        </Button>

        <Label className="inline-flex">
          <Button variant="outline" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Upload File
            </span>
          </Button>
          <input
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Label>

        <Button onClick={handleClear} variant="outline" disabled={!inputText}>
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
      </ToolControls>

      {/* File Info */}
      {fileInfo && (
        <FileInfoCard
          fileInfo={fileInfo}
          onRemove={() => setFileInfo(null)}
          className="mb-4"
        />
      )}

      {/* Operation Selector */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Text Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {operations.map((operation) => (
              <button
                key={operation.id}
                onClick={() => handleOperationChange(operation.id)}
                className={cn(
                  "rounded-lg border p-2 text-center transition-colors",
                  selectedOperation === operation.id
                    ? "border-primary bg-primary text-primary-foreground dark:bg-primary/50"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <div className="text-sm font-medium">{operation.name}</div>
                <div className="text-xs">{operation.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Input Text</CardTitle>
              <CopyButton text={inputText} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="Enter or paste your text here..."
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Output/Analysis */}
        <div className="space-y-6">
          {selectedOperation === "analyze" && analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Text Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.characters.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Characters
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.charactersNoSpaces.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Characters (no spaces)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.words.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">Words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.sentences.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Sentences
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.paragraphs.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Paragraphs
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.lines.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">Lines</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">
                        Average words per sentence:
                      </span>
                      <span className="font-mono text-sm">
                        {analysis.averageWordsPerSentence}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estimated reading time:</span>
                      <span className="font-mono text-sm">
                        {analysis.readingTime} min
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedOperation === "compare" && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Comparison Text</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    placeholder="Enter text to compare with..."
                    value={comparisonText}
                    onChange={(e) => setComparisonText(e.target.value)}
                    className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {differences.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Differences ({differences.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {differences.map((diff, index) => (
                        <div
                          key={index}
                          className="bg-muted/50 rounded border p-2"
                        >
                          <div className="text-muted-foreground mb-1 text-xs">
                            Position {diff.position + 1}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="rounded bg-red-100 px-1 font-mono dark:bg-red-900/30">
                              {diff.original || "(empty)"}
                            </span>
                            <span>→</span>
                            <span className="rounded bg-green-100 px-1 font-mono dark:bg-green-900/30">
                              {diff.comparison || "(empty)"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {selectedOperation !== "analyze" &&
            selectedOperation !== "compare" && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {
                        operations.find((op) => op.id === selectedOperation)
                          ?.name
                      }{" "}
                      Result
                    </CardTitle>
                    <CopyButton text={outputText} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    placeholder="Transformed text will appear here..."
                    value={outputText}
                    readOnly
                    className="bg-muted/50 max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
                  />
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

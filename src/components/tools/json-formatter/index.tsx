"use client"

import React, { useEffect, useState } from "react"
import {
  CheckCircle,
  Code,
  Copy,
  Download,
  Upload,
  XCircle,
} from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface FormattingOptions {
  indentSize: number
  sortKeys: boolean
  removeComments: boolean
  compact: boolean
}

// Define types for XML attributes and elements
interface XMLAttributes {
  [key: string]: string | null
}

interface XMLNode {
  "@attributes"?: XMLAttributes
  [key: string]: unknown
}

// Flexible type for parsed data that can handle the various data structures
type FlexibleData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null

export function JsonFormatter() {
  const [inputData, setInputData] = useState("")
  const [outputData, setOutputData] = useState("")
  const [inputFormat, setInputFormat] = useState("json")
  const [outputFormat, setOutputFormat] = useState("json")
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null)
  const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(
    {
      indentSize: 2,
      sortKeys: false,
      removeComments: false,
      compact: false,
    }
  )
  const [activeTab, setActiveTab] = useState("formatter")

  const validateJSON = (data: string): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      const parsed = JSON.parse(data)

      // Check for common issues
      if (typeof parsed === "object" && parsed !== null) {
        if (Object.keys(parsed).length === 0) {
          warnings.push("Empty object detected")
        }

        // Check for potential circular references
        const seen = new WeakSet()
        const checkCircular = (obj: unknown, path: string[] = []): boolean => {
          if (obj && typeof obj === "object") {
            if (seen.has(obj as object)) {
              warnings.push(`Potential circular reference at ${path.join(".")}`)
              return true
            }
            seen.add(obj as object)

            for (const key in obj as Record<string, unknown>) {
              if ((obj as Record<string, unknown>).hasOwnProperty(key)) {
                if (
                  checkCircular((obj as Record<string, unknown>)[key], [
                    ...path,
                    key,
                  ])
                ) {
                  return true
                }
              }
            }
            seen.delete(obj as object)
          }
          return false
        }

        checkCircular(parsed)
      }

      return { isValid: true, errors, warnings }
    } catch (error) {
      return {
        isValid: false,
        errors: [
          `JSON parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        warnings,
      }
    }
  }

  const validateXML = (data: string): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic XML validation
    if (!data.includes("<") || !data.includes(">")) {
      errors.push("Invalid XML: Missing XML tags")
    }

    // Check for unclosed tags
    const openTags = data.match(/<[^/][^>]*>/g) || []
    const closeTags = data.match(/<\/[^>]*>/g) || []

    if (openTags.length !== closeTags.length) {
      warnings.push("Mismatched tags detected")
    }

    // Check for proper XML declaration
    if (!data.trim().startsWith("<?xml") && !data.trim().startsWith("<")) {
      warnings.push("Missing XML declaration")
    }

    return { isValid: errors.length === 0, errors, warnings }
  }

  const parseXML = (xmlString: string): FlexibleData => {
    // Simple XML to JSON parser (for basic cases)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, "text/xml")

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("XML parsing failed")
    }

    return xmlToJson(xmlDoc.documentElement)
  }

  const xmlToJson = (xml: Element): FlexibleData => {
    let obj: XMLNode | string = {}

    if (xml.nodeType === 1) {
      // element node
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {}
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j)
          if (attribute) {
            if (obj["@attributes"]) {
              ;(obj["@attributes"] as XMLAttributes)[attribute.nodeName] =
                attribute.nodeValue
            }
          }
        }
      }
    } else if (xml.nodeType === 3) {
      // text node
      obj = xml.nodeValue?.trim() || ""
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i)
        const nodeName = item.nodeName

        if (item.nodeType === 3) {
          // text node
          const text = item.nodeValue?.trim()
          if (text) {
            obj = text
          }
        } else if (item.nodeType === 1) {
          // element node
          if (
            typeof obj === "object" &&
            obj !== null &&
            typeof (obj as XMLNode)[nodeName] === "undefined"
          ) {
            ;(obj as XMLNode)[nodeName] = xmlToJson(item as Element)
          } else if (typeof obj === "object" && obj !== null) {
            if (
              typeof ((obj as XMLNode)[nodeName] as unknown[]).push ===
              "undefined"
            ) {
              ;(obj as XMLNode)[nodeName] = [(obj as XMLNode)[nodeName]]
            }
            ;((obj as XMLNode)[nodeName] as unknown[]).push(
              xmlToJson(item as Element)
            )
          }
        }
      }
    }

    return obj
  }

  const formatJSON = (
    data: FlexibleData,
    options: FormattingOptions
  ): string => {
    let processedData = data

    if (options.sortKeys) {
      processedData = sortObjectKeys(processedData)
    }

    if (options.removeComments) {
      processedData = removeComments(processedData)
    }

    const indent = options.compact ? 0 : options.indentSize
    return JSON.stringify(processedData, null, indent)
  }

  const formatXML = (
    data: FlexibleData,
    options: FormattingOptions
  ): string => {
    // Convert JSON back to XML (simplified)
    return jsonToXml(data, options.indentSize, options.compact)
  }

  const jsonToXml = (
    obj: FlexibleData,
    indent: number = 2,
    compact: boolean = false
  ): string => {
    const spaces = compact ? "" : " ".repeat(indent)
    const newline = compact ? "" : "\n"

    if (typeof obj === "string") {
      return obj
    }

    if (typeof obj === "number" || typeof obj === "boolean") {
      return obj.toString()
    }

    if (obj === null) {
      return ""
    }

    if (Array.isArray(obj)) {
      return obj
        .map((item) => jsonToXml(item as FlexibleData, indent, compact))
        .join(newline)
    }

    let xml = ""
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === "@attributes") {
            continue
          }

          const value = obj[key]
          const attributes = (obj as XMLNode)["@attributes"]
            ? Object.entries((obj as XMLNode)["@attributes"] as XMLAttributes)
                .map(([attr, val]) => `${attr}="${val}"`)
                .join(" ")
            : ""

          const attrStr = attributes ? ` ${attributes}` : ""

          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            xml += `${spaces}<${key}${attrStr}>${newline}`
            xml += jsonToXml(value as FlexibleData, indent + 2, compact)
            xml += `${newline}${spaces}</${key}>${newline}`
          } else if (Array.isArray(value)) {
            value.forEach((item) => {
              xml += `${spaces}<${key}${attrStr}>`
              xml += jsonToXml(item as FlexibleData, indent + 2, compact)
              xml += `</${key}>${newline}`
            })
          } else {
            xml += `${spaces}<${key}${attrStr}>`
            xml += jsonToXml(value as FlexibleData, indent + 2, compact)
            xml += `</${key}>${newline}`
          }
        }
      }
    }

    return xml
  }

  const sortObjectKeys = (obj: FlexibleData): FlexibleData => {
    if (obj === null || typeof obj !== "object") {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => sortObjectKeys(item as FlexibleData))
    }

    const sorted: Record<string, unknown> = {}
    Object.keys(obj as Record<string, unknown>)
      .sort()
      .forEach((key) => {
        sorted[key] = sortObjectKeys(
          (obj as Record<string, unknown>)[key] as FlexibleData
        )
      })

    return sorted
  }

  const removeComments = (obj: FlexibleData): FlexibleData => {
    if (obj === null || typeof obj !== "object") {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => removeComments(item as FlexibleData))
    }

    const cleaned: Record<string, unknown> = {}
    Object.keys(obj as Record<string, unknown>).forEach((key) => {
      if (!key.startsWith("//") && !key.startsWith("/*")) {
        cleaned[key] = removeComments(
          (obj as Record<string, unknown>)[key] as FlexibleData
        )
      }
    })

    return cleaned
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputData)
      toast({
        title: "Copied!",
        description: "Formatted data has been copied to clipboard",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadOutput = () => {
    const blob = new Blob([outputData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `formatted-response.${outputFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputData(content)
      }
      reader.readAsText(file)
    }
  }

  const getValidationIcon = () => {
    if (!validationResult) return null

    if (validationResult.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getValidationColor = () => {
    if (!validationResult) return "bg-gray-100 text-gray-800"

    if (validationResult.isValid) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  useEffect(() => {
    const formatData = () => {
      if (!inputData.trim()) {
        setOutputData("")
        setValidationResult(null)
        return
      }

      try {
        let parsedData: FlexibleData | undefined
        let validation: ValidationResult

        // Parse input based on format
        if (inputFormat === "json") {
          try {
            parsedData = JSON.parse(inputData)
            validation = validateJSON(inputData)
          } catch (error) {
            validation = {
              isValid: false,
              errors: [
                `Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
              ],
              warnings: [],
            }
          }
        } else if (inputFormat === "xml") {
          try {
            parsedData = parseXML(inputData)
            validation = validateXML(inputData)
          } catch (error) {
            validation = {
              isValid: false,
              errors: [
                `Invalid XML: ${error instanceof Error ? error.message : "Unknown error"}`,
              ],
              warnings: [],
            }
          }
        } else {
          validation = {
            isValid: false,
            errors: ["Unsupported input format"],
            warnings: [],
          }
        }

        setValidationResult(validation)

        if (validation.isValid && parsedData !== undefined) {
          // Format output based on target format
          if (outputFormat === "json") {
            const formatted = formatJSON(parsedData, formattingOptions)
            setOutputData(formatted)
          } else if (outputFormat === "xml") {
            const formatted = formatXML(parsedData, formattingOptions)
            setOutputData(formatted)
          }
        } else {
          setOutputData("")
        }
      } catch (error) {
        setValidationResult({
          isValid: false,
          errors: [
            `Formatting error: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
          warnings: [],
        })
        setOutputData("")
      }
    }

    if (inputData) {
      formatData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData, inputFormat, outputFormat, formattingOptions])

  const features = [
    {
      title: "Multi-format Support",
      description: "Supports JSON and XML formats for input and output.",
      icon: "📄",
    },
    {
      title: "Validation",
      description: "Validates JSON/XML data for common issues.",
      icon: "✅",
    },
    {
      title: "Formatting Options",
      description:
        "Customize indentation, key sorting, comment removal, and compact mode.",
      icon: "⚙️",
    },
    {
      title: "Syntax Highlighting",
      description: "Enhanced readability with syntax highlighting.",
      icon: "🎨",
    },
    {
      title: "File Upload",
      description: "Upload files directly for processing.",
      icon: "📂",
    },
  ]

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, and convert JSON/XML with syntax highlighting"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="formatter">Formatter</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="formatter" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Input Section */}
              <Card className="relative">
                <div className="absolute top-6 right-6">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json,.xml,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    <Upload />
                    <span className="sr-only md:not-sr-only">Upload File</span>
                  </label>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Input Data
                  </CardTitle>
                  <CardDescription>
                    Paste your API response data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="w-full space-y-2">
                      <Label>Input Format</Label>
                      <Select
                        value={inputFormat}
                        onValueChange={setInputFormat}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full space-y-2">
                      <Label>Output Format</Label>
                      <Select
                        value={outputFormat}
                        onValueChange={setOutputFormat}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder={`Paste your ${inputFormat.toUpperCase()} data here...`}
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Formatted Output
                  </CardTitle>
                  <CardDescription>
                    Your formatted and validated data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getValidationIcon()}
                      <Badge className={getValidationColor()}>
                        {validationResult?.isValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyOutput}
                        size="sm"
                        disabled={!outputData}
                      >
                        <Copy />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadOutput}
                        size="sm"
                        disabled={!outputData}
                      >
                        <Download />
                        Download
                      </Button>
                    </div>
                  </div>

                  {outputData ? (
                    <CodeHighlighter
                      language={outputFormat === "json" ? "json" : "xml"}
                      className="max-h-[300px] min-h-[300px] overflow-y-auto"
                    >
                      {outputData}
                    </CodeHighlighter>
                  ) : (
                    <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[300px] min-h-[300px] items-center justify-center rounded-md border bg-transparent text-sm">
                      Converted data will appear here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Formatting Options */}
            <Card>
              <CardHeader>
                <CardTitle>Formatting Options</CardTitle>
                <CardDescription>Customize the output format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Indent Size</Label>
                    <Select
                      value={formattingOptions.indentSize.toString()}
                      onValueChange={(value) =>
                        setFormattingOptions((prev) => ({
                          ...prev,
                          indentSize: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 spaces</SelectItem>
                        <SelectItem value="4">4 spaces</SelectItem>
                        <SelectItem value="8">8 spaces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort Keys</Label>
                    <Select
                      value={formattingOptions.sortKeys.toString()}
                      onValueChange={(value) =>
                        setFormattingOptions((prev) => ({
                          ...prev,
                          sortKeys: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Remove Comments</Label>
                    <Select
                      value={formattingOptions.removeComments.toString()}
                      onValueChange={(value) =>
                        setFormattingOptions((prev) => ({
                          ...prev,
                          removeComments: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Compact</Label>
                    <Select
                      value={formattingOptions.compact.toString()}
                      onValueChange={(value) =>
                        setFormattingOptions((prev) => ({
                          ...prev,
                          compact: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">No</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
                <CardDescription>
                  Detailed validation information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {validationResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getValidationIcon()}
                      <span className="font-medium">
                        {validationResult.isValid
                          ? "Data is valid"
                          : "Data has errors"}
                      </span>
                    </div>

                    {validationResult.errors.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-red-600">Errors:</Label>
                        <ul className="list-inside list-disc space-y-1">
                          {validationResult.errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-600">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {validationResult.warnings.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-yellow-600">Warnings:</Label>
                        <ul className="list-inside list-disc space-y-1">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-yellow-600">
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {validationResult.isValid &&
                      validationResult.errors.length === 0 &&
                      validationResult.warnings.length === 0 && (
                        <div className="text-sm text-green-600">
                          ✓ No issues found. Your data is properly formatted.
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    Enter data to see validation results
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

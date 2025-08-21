"use client"

import { useCallback, useState } from "react"
import { CodeAction, Language, sampleCode } from "@/utils"
import {
  css as cssBeautify,
  html as htmlBeautify,
  js as jsBeautify,
} from "js-beautify"
import { Code2, Download, RotateCcw, Upload, Zap } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  FileInfoCard,
  ToolControls,
  ToolLayout,
  ValidationBadge,
} from "@/components/common"
import { CodeHighlighter } from "@/components/tools/markdown/code-highlighter"

export function CodeBeautifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState<Language>("javascript")
  const [action, setAction] = useState<CodeAction>("beautify")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<{ message: string } | null>(null)
  const [indentSize, setIndentSize] = useState(2)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
    type: string
  } | null>(null)

  const processCode = useCallback(
    (code: string, lang: Language, actionType: CodeAction, indent: number) => {
      if (!code.trim()) {
        setOutput("")
        setIsValid(null)
        setError(null)
        return
      }

      try {
        let processed: string | undefined

        if (actionType === "beautify") {
          switch (lang) {
            case "javascript":
              processed = beautifyJavaScript(code, indent)
              break
            case "css":
              processed = beautifyCSS(code, indent)
              break
            case "html":
              processed = beautifyHTML(code, indent)
              break
            default:
              processed = code
          }
        } else {
          // Minify
          switch (lang) {
            case "javascript":
              processed = minifyJavaScript(code)
              break
            case "css":
              processed = minifyCSS(code)
              break
            case "html":
              processed = minifyHTML(code)
              break
            default:
              processed = code
          }
        }

        // Ensure we have output
        if (!processed || processed.trim() === "") {
          throw new Error(`No output generated for ${lang} ${actionType}`)
        }

        setOutput(processed)
        setIsValid(true)
        setError(null)
      } catch (err) {
        console.error(`Error processing ${lang} code:`, err)
        setIsValid(false)
        setOutput("")
        setError({
          message:
            err instanceof Error
              ? err.message
              : `Failed to ${actionType} ${lang} code`,
        })
      }
    },
    []
  )

  const beautifyJavaScript = (
    code: string,
    indent: number
  ): string | undefined => {
    return jsBeautify(code, {
      indent_size: indent,
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      brace_style: "collapse",
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false,
    })
  }

  const beautifyCSS = (code: string, indent: number): string | undefined => {
    return cssBeautify(code, {
      indent_size: indent,
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      newline_between_rules: true,
      end_with_newline: false,
      indent_empty_lines: false,
    })
  }

  const beautifyHTML = (code: string, indent: number): string | undefined => {
    try {
      return htmlBeautify(code, {
        indent_size: indent,
        indent_char: " ",
        max_preserve_newlines: 5,
        preserve_newlines: true,
        indent_inner_html: true,
        wrap_line_length: 120,
        wrap_attributes: "force-expand-multiline",
        wrap_attributes_indent_size: indent,
        end_with_newline: true,
        indent_empty_lines: false,
        unformatted: ["code", "pre", "em", "strong", "span"],
        content_unformatted: ["pre"],
        extra_liners: ["head", "body", "/html"],
        indent_scripts: "normal",
      })
    } catch (err) {
      console.warn(
        "js-beautify failed, using fallback HTML beautification:",
        err
      )
    }
  }

  // Minify functions
  const minifyJavaScript = (code: string): string => {
    return (
      code
        // Remove single-line comments
        .replace(/\/\/.*$/gm, "")
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Remove unnecessary whitespace
        .replace(/\s+/g, " ")
        // Remove whitespace around operators and punctuation
        .replace(/\s*([{}();,=+\-*/])\s*/g, "$1")
        // Remove trailing semicolons where safe
        .replace(/;\s*}/g, "}")
        // Remove unnecessary spaces
        .replace(/,\s+/g, ",")
        .replace(/:\s+/g, ":")
        .replace(/\s+{/g, "{")
        .replace(/}\s+/g, "}")
        .trim()
    )
  }

  const minifyCSS = (code: string): string => {
    return (
      code
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Remove unnecessary whitespace
        .replace(/\s+/g, " ")
        // Remove whitespace around braces, semicolons, and colons
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*,\s*/g, ",")
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, "}")
        // Remove last semicolon in declaration block
        .replace(/;(\s*})/g, "$1")
        .trim()
    )
  }

  const minifyHTML = (code: string): string => {
    return (
      code
        // Remove HTML comments
        .replace(/<!--[\s\S]*?-->/g, "")
        // Remove unnecessary whitespace between tags
        .replace(/>\s+</g, "><")
        // Remove whitespace at the beginning and end of lines
        .replace(/^\s+|\s+$/gm, "")
        // Collapse multiple spaces into one
        .replace(/\s+/g, " ")
        // Remove whitespace around = in attributes
        .replace(/\s*=\s*/g, "=")
        // Remove quotes around single-word attribute values (when safe)
        .replace(/=["']([a-zA-Z0-9-_]+)["']/g, "=$1")
        .trim()
    )
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    processCode(value, language, action, indentSize)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    const code = sampleCode[newLanguage]

    setInput(code)
    processCode(code, newLanguage, action, indentSize)
  }

  const handleIndentChange = (newIndent: string) => {
    const indent = parseInt(newIndent)
    setIndentSize(indent)
    if (input.trim()) {
      processCode(input, language, action, indent)
    }
  }

  const handleActionChange = (newAction: CodeAction) => {
    setAction(newAction)
    if (input.trim()) {
      processCode(input, language, newAction, indentSize)
    }
  }

  const handleProcess = () => {
    if (input.trim()) {
      processCode(input, language, action, indentSize)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setError(null)
    setFileInfo(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
        })
        processCode(content, language, action, indentSize)
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!output) return

    const extension =
      language === "javascript" ? "js" : language === "css" ? "css" : "html"
    const blob = new Blob([output], { type: `text/${extension}` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${action === "beautify" ? "beautified" : "minified"}-${Date.now()}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: `${action === "beautify" ? "Beautified" : "Minified"} ${language.toUpperCase()} file has been downloaded`,
    })
  }

  const handleSampleData = () => {
    const code = sampleCode[language]

    setInput(code)
    processCode(code, language, action, indentSize)
  }

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "FILE_SUPPORT",
    "PRIVACY",
    "CUSTOMIZABLE",
  ])

  return (
    <ToolLayout
      title="Code Beautifier"
      description="Beautify and minify your code"
    >
      <ToolControls>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>

          <Select value={action} onValueChange={handleActionChange}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beautify">Beautify</SelectItem>
              <SelectItem value="minify">Minify</SelectItem>
            </SelectContent>
          </Select>

          {action === "beautify" && (
            <Select
              value={indentSize.toString()}
              onValueChange={handleIndentChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <Button onClick={handleProcess} disabled={!input.trim()}>
          <Zap className="h-4 w-4" />
          {action === "beautify" ? "Beautify" : "Minify"}
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
          <Code2 className="h-4 w-4" />
          Sample Code
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
            accept=".js,.css,.html,.txt"
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

      {fileInfo && (
        <FileInfoCard
          fileInfo={fileInfo}
          onRemove={() => setFileInfo(null)}
          className="mb-4"
        />
      )}

      {/* Status Badge */}
      {isValid !== null && (
        <div className="mb-4 flex items-center gap-2">
          <ValidationBadge
            isValid={isValid}
            validText={`✓ ${action === "beautify" ? "Beautified" : "Minified"}`}
            invalidText={`✗ ${action === "beautify" ? "Beautification" : "Minification"} Failed`}
          />
          <Badge variant="secondary">{language.toUpperCase()}</Badge>
          {action === "beautify" && (
            <Badge variant="outline">{indentSize} spaces</Badge>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 dark:text-red-400">
              {action === "beautify" ? "Beautification" : "Minification"} Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Input Code</CardTitle>
              <CopyButton text={input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder={`Paste your ${language.toUpperCase()} code here...`}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {action === "beautify" ? "Beautified" : "Minified"} Code
              </CardTitle>
              <CopyButton text={output} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {output ? (
              <CodeHighlighter
                language={language}
                className="max-h-[300px] min-h-[300px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[300px] min-h-[300px] items-center justify-center rounded-md border bg-transparent text-sm">
                Beautified code will appear here...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

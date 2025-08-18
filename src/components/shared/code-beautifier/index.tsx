"use client"

import { useCallback, useState } from "react"
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
  StatsDisplay,
  ToolControls,
  ToolLayout,
  ValidationBadge,
} from "@/components/common"
import { CodeHighlighter } from "@/components/shared/markdown/code-highlighter"

type Language = "javascript" | "css" | "html"
type Action = "beautify" | "minify"

export function CodeBeautifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState<Language>("javascript")
  const [action, setAction] = useState<Action>("beautify")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<{ message: string } | null>(null)
  const [indentSize, setIndentSize] = useState(2)

  const processCode = useCallback(
    (code: string, lang: Language, actionType: Action, indent: number) => {
      if (!code.trim()) {
        setOutput("")
        setIsValid(null)
        setError(null)
        return
      }

      try {
        let processed = ""

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

        setOutput(processed)
        setIsValid(true)
        setError(null)
      } catch (err) {
        setIsValid(false)
        setOutput("")
        setError({
          message:
            err instanceof Error ? err.message : `Failed to ${actionType} code`,
        })
      }
    },
    []
  )

  const beautifyJavaScript = (code: string, indent: number): string => {
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

  const beautifyCSS = (code: string, indent: number): string => {
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

  const beautifyHTML = (code: string, indent: number): string => {
    return htmlBeautify(code, {
      indent_size: indent,
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      indent_inner_html: true,
      wrap_line_length: 0,
      wrap_attributes: "auto",
      wrap_attributes_indent_size: indent,
      end_with_newline: false,
      indent_empty_lines: false,
    })
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
    if (input.trim()) {
      processCode(input, newLanguage, action, indentSize)
    }
  }

  const handleIndentChange = (newIndent: string) => {
    const indent = parseInt(newIndent)
    setIndentSize(indent)
    if (input.trim()) {
      processCode(input, language, action, indent)
    }
  }

  const handleActionChange = (newAction: Action) => {
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
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
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
    let sampleCode = ""

    switch (language) {
      case "javascript":
        sampleCode = `function calculateSum(a,b){if(a&&b){return a+b;}return 0;}const numbers=[1,2,3,4,5];const result=numbers.reduce((sum,num)=>sum+num,0);console.log('Sum:',result);class Calculator{constructor(initial=0){this.value=initial;}add(x){this.value+=x;return this;}multiply(x){this.value*=x;return this;}getResult(){return this.value;}}const calc=new Calculator(10).add(5).multiply(2);`
        break
      case "css":
        sampleCode = `.container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background-color:#f5f5f5;}.button{padding:12px 24px;border:none;border-radius:6px;background-color:#007bff;color:white;cursor:pointer;transition:background-color 0.3s ease;}`
        break
      case "html":
        sampleCode = `<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Hello World</h1><p>This is a sample HTML document</p><button class="btn">Click me</button></body></html>`
        break
    }

    setInput(sampleCode)
    processCode(sampleCode, language, action, indentSize)
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
    "CUSTOMIZABLE",
  ])

  return (
    <ToolLayout>
      {/* Controls */}
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
      <div className="grid gap-6 lg:grid-cols-2">
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
              className="max-h-[400px] min-h-[400px] resize-none font-mono text-sm"
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
                className="max-h-[400px] min-h-[400px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[400px] min-h-[400px] items-center justify-center rounded-md border bg-transparent text-sm">
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

"use client"

import { useCallback, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  RotateCcw,
  Upload,
} from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  FileInfoCard,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

export function Base64Tool() {
  const [textInput, setTextInput] = useState("")
  const [base64Input, setBase64Input] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
    type: string
  } | null>(null)
  const { toast } = useToast()

  const encodeToBase64 = useCallback(
    (text: string) => {
      try {
        return btoa(unescape(encodeURIComponent(text)))
      } catch {
        toast({
          title: "Encoding Error",
          description: "Failed to encode text to Base64",
          variant: "destructive",
        })
        return ""
      }
    },
    [toast]
  )

  const decodeFromBase64 = useCallback(
    (base64: string) => {
      try {
        return decodeURIComponent(escape(atob(base64.replace(/\s/g, ""))))
      } catch {
        toast({
          title: "Decoding Error",
          description: "Invalid Base64 string",
          variant: "destructive",
        })
        return ""
      }
    },
    [toast]
  )

  const handleTextChange = (value: string) => {
    setTextInput(value)
    if (mode === "encode") {
      setBase64Input(encodeToBase64(value))
    }
  }

  const handleBase64Change = (value: string) => {
    setBase64Input(value)
    if (mode === "decode") {
      setTextInput(decodeFromBase64(value))
    }
  }

  const switchMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)

    if (newMode === "encode" && textInput) {
      setBase64Input(encodeToBase64(textInput))
    } else if (newMode === "decode" && base64Input) {
      setTextInput(decodeFromBase64(base64Input))
    }
  }

  const handleClear = () => {
    setTextInput("")
    setBase64Input("")
    setFileInfo(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      })

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const base64 = result.split(",")[1] // Remove data URL prefix
        setBase64Input(base64)
        setTextInput(`[File: ${file.name}]`)
        setMode("decode")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadAsFile = () => {
    if (!base64Input) return

    try {
      const byteCharacters = atob(base64Input.replace(/\s/g, ""))
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray])

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileInfo?.name || `decoded-file-${Date.now()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded",
        description: "File has been downloaded",
      })
    } catch {
      toast({
        title: "Download Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    }
  }

  const handleSampleData = () => {
    const sampleText =
      "Hello, DevTools Hub! 🚀\n\nThis is a sample text with:\n- Unicode characters: café, naïve, résumé\n- Emojis: 😊 🎉 💻\n- Special chars: @#$%^&*()\n\nPerfect for Base64 encoding!"
    setTextInput(sampleText)
    setBase64Input(encodeToBase64(sampleText))
    setMode("encode")
  }

  const stats = [
    {
      label: "Input Size",
      value:
        mode === "encode"
          ? `${textInput.length} chars`
          : `${base64Input.length} chars`,
      icon: "📝",
    },
    {
      label: "Output Size",
      value:
        mode === "encode"
          ? `${base64Input.length} chars`
          : `${textInput.length} chars`,
      icon: "📄",
    },
    {
      label: "Size Change",
      value:
        mode === "encode"
          ? `+${textInput ? Math.round(((base64Input.length - textInput.length) / textInput.length) * 100) : 0}%`
          : `${base64Input ? Math.round(((textInput.length - base64Input.length) / base64Input.length) * 100) : 0}%`,
      icon: "📊",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "FILE_SUPPORT",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      {/* Mode Toggle & Controls */}
      <ToolControls>
        <div className="flex items-center rounded-lg border p-1">
          <Button
            variant={mode === "encode" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("encode")}
          >
            <ArrowUp className="h-4 w-4" />
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            <ArrowDown className="h-4 w-4" />
            Decode
          </Button>
        </div>

        <Button onClick={switchMode} variant="outline">
          <RotateCcw className="h-4 w-4" />
          Switch Mode
        </Button>

        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!textInput && !base64Input}
        >
          Clear All
        </Button>

        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample Data
        </Button>

        <Label className="inline-flex">
          <Button variant="outline" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Upload File
            </span>
          </Button>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </Label>

        {base64Input && mode === "decode" && (
          <Button onClick={handleDownloadAsFile} variant="outline">
            <Download className="h-4 w-4" />
            Download File
          </Button>
        )}
      </ToolControls>

      {/* Mode Badge */}
      <div className="mb-4">
        <Badge variant={mode === "encode" ? "default" : "secondary"}>
          {mode === "encode" ? "🔒 Encoding Mode" : "🔓 Decoding Mode"}
        </Badge>
      </div>

      {/* File Info */}
      {fileInfo && (
        <FileInfoCard
          fileInfo={fileInfo}
          onRemove={() => setFileInfo(null)}
          className="mb-6"
        />
      )}

      {/* Stats */}
      {(textInput || base64Input) && (
        <div className="mb-6">
          <StatsDisplay stats={stats} />
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Input */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {mode === "encode"
                  ? "Plain Text (Input)"
                  : "Plain Text (Output)"}
              </CardTitle>
              <CopyButton text={textInput} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Decoded text will appear here..."
              }
              value={textInput}
              onChange={(e) => handleTextChange(e.target.value)}
              readOnly={mode === "decode"}
              className={cn(
                "max-h-[400px] min-h-[400px] resize-none font-mono text-sm",
                mode === "decode" ? "bg-muted/50" : ""
              )}
            />
          </CardContent>
        </Card>

        {/* Base64 Output */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {mode === "encode" ? "Base64 (Output)" : "Base64 (Input)"}
              </CardTitle>
              <CopyButton text={base64Input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder={
                mode === "encode"
                  ? "Base64 encoded text will appear here..."
                  : "Paste Base64 string to decode..."
              }
              value={base64Input}
              onChange={(e) => handleBase64Change(e.target.value)}
              readOnly={mode === "encode"}
              className={cn(
                "max-h-[400px] min-h-[400px] font-mono text-sm break-all",
                mode === "encode" ? "bg-muted/50" : ""
              )}
            />
          </CardContent>
        </Card>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

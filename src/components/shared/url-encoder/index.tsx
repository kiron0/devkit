"use client"

import { useCallback, useState } from "react"
import { Link as LinkIcon, RotateCcw, Zap } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

interface QueryParam {
  key: string
  value: string
}

export function URLEncoder() {
  const [inputUrl, setInputUrl] = useState("")
  const [encodedUrl, setEncodedUrl] = useState("")
  const [decodedUrl, setDecodedUrl] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [queryParams, setQueryParams] = useState<QueryParam[]>([])
  const [queryBuilder, setQueryBuilder] = useState<QueryParam[]>([
    { key: "", value: "" },
  ])
  const { toast } = useToast()

  const encodeURL = useCallback(
    (url: string) => {
      try {
        return encodeURIComponent(url)
      } catch {
        toast({
          title: "Encoding Error",
          description: "Failed to encode URL",
          variant: "destructive",
        })
        return ""
      }
    },
    [toast]
  )

  const decodeURL = useCallback(
    (url: string) => {
      try {
        return decodeURIComponent(url)
      } catch {
        toast({
          title: "Decoding Error",
          description: "Invalid URL encoding",
          variant: "destructive",
        })
        return ""
      }
    },
    [toast]
  )

  const parseQueryParams = useCallback((url: string) => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
      const params: QueryParam[] = []
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })
      return params
    } catch {
      return []
    }
  }, [])

  const buildQueryString = useCallback((params: QueryParam[]) => {
    return params
      .filter((param) => param.key.trim() && param.value.trim())
      .map(
        (param) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&")
  }, [])

  const handleInputChange = (value: string) => {
    setInputUrl(value)

    if (mode === "encode") {
      setEncodedUrl(encodeURL(value))
      setDecodedUrl("")
    } else {
      setDecodedUrl(decodeURL(value))
      setEncodedUrl("")
    }

    // Parse query parameters if it looks like a URL
    const params = parseQueryParams(value)
    setQueryParams(params)
  }

  const switchMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)

    if (newMode === "encode" && decodedUrl) {
      setInputUrl(decodedUrl)
      setEncodedUrl(encodeURL(decodedUrl))
      setDecodedUrl("")
    } else if (newMode === "decode" && encodedUrl) {
      setInputUrl(encodedUrl)
      setDecodedUrl(decodeURL(encodedUrl))
      setEncodedUrl("")
    }
  }

  const handleClear = () => {
    setInputUrl("")
    setEncodedUrl("")
    setDecodedUrl("")
    setQueryParams([])
    setQueryBuilder([{ key: "", value: "" }])
  }

  const handleSampleData = () => {
    const sampleUrl =
      "https://example.com/search?q=hello world&category=web dev&lang=en&sort=date"
    setInputUrl(sampleUrl)

    if (mode === "encode") {
      setEncodedUrl(encodeURL(sampleUrl))
    } else {
      setDecodedUrl(decodeURL(sampleUrl))
    }

    setQueryParams(parseQueryParams(sampleUrl))
  }

  const addQueryParam = () => {
    setQueryBuilder([...queryBuilder, { key: "", value: "" }])
  }

  const removeQueryParam = (index: number) => {
    const newParams = queryBuilder.filter((_, i) => i !== index)
    setQueryBuilder(newParams.length > 0 ? newParams : [{ key: "", value: "" }])
  }

  const updateQueryParam = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newParams = [...queryBuilder]
    newParams[index][field] = value
    setQueryBuilder(newParams)
  }

  const generateUrlFromParams = () => {
    const baseUrl = "https://example.com/api"
    const queryString = buildQueryString(queryBuilder)
    const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl

    setInputUrl(fullUrl)
    handleInputChange(fullUrl)

    toast({
      title: "URL Generated",
      description: "URL created from query parameters",
    })
  }

  const stats = [
    {
      label: "Characters",
      value: inputUrl.length.toLocaleString(),
      icon: "📝",
    },
    {
      label: "Query Params",
      value: queryParams.length.toString(),
      icon: "🔗",
    },
    {
      label: "Encoded Size",
      value:
        mode === "encode"
          ? `${encodedUrl.length} chars`
          : `${decodedUrl.length} chars`,
      icon: "📊",
    },
  ]

  const outputValue = mode === "encode" ? encodedUrl : decodedUrl
  const outputLabel = mode === "encode" ? "Encoded URL" : "Decoded URL"

  const features = [
    {
      icon: "🔄",
      title: "Bidirectional",
      description: "Encode and decode URLs in both directions",
    },
    {
      icon: "🔗",
      title: "Query Parser",
      description: "Extract and analyze URL parameters",
    },
    {
      icon: "🛠️",
      title: "Query Builder",
      description: "Build URLs with custom parameters",
    },
    {
      icon: "📊",
      title: "Real-time Stats",
      description: "Live analysis and character counting",
    },
  ]

  return (
    <ToolLayout>
      {/* Controls */}
      <ToolControls>
        <div className="flex items-center rounded-lg border p-1">
          <Button
            variant={mode === "encode" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("encode")}
          >
            🔒 Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            🔓 Decode
          </Button>
        </div>

        <Button onClick={switchMode} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Switch Mode
        </Button>

        <Button onClick={handleClear} variant="outline" disabled={!inputUrl}>
          Clear All
        </Button>

        <Button onClick={handleSampleData} variant="outline">
          <LinkIcon className="mr-2 h-4 w-4" />
          Sample URL
        </Button>
      </ToolControls>

      {/* Mode Badge */}
      <div className="mb-4">
        <Badge variant={mode === "encode" ? "default" : "secondary"}>
          {mode === "encode" ? "🔒 Encoding Mode" : "🔓 Decoding Mode"}
        </Badge>
      </div>

      {/* Stats */}
      {inputUrl && (
        <div className="mb-6">
          <StatsDisplay stats={stats} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* URL Input */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {mode === "encode" ? "Original URL" : "Encoded URL"}
                </CardTitle>
                <CopyButton text={inputUrl} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                placeholder={
                  mode === "encode"
                    ? "Enter URL to encode..."
                    : "Enter encoded URL to decode..."
                }
                value={inputUrl}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Query Builder */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Query Builder</CardTitle>
                <Button onClick={addQueryParam} size="sm" variant="outline">
                  Add Param
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {queryBuilder.map((param, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) =>
                      updateQueryParam(index, "key", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">=</span>
                  <Input
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) =>
                      updateQueryParam(index, "value", e.target.value)
                    }
                    className="flex-1"
                  />
                  {queryBuilder.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQueryParam(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={generateUrlFromParams} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Generate URL
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {/* URL Output */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{outputLabel}</CardTitle>
                <CopyButton text={outputValue} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                placeholder={`${outputLabel} will appear here...`}
                value={outputValue}
                readOnly
                className="bg-muted/50 min-h-[120px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Parsed Query Parameters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Parsed Query Parameters ({queryParams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queryParams.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No query parameters found
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {queryParams.map((param, index) => (
                    <div key={index} className="bg-muted/50 rounded border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">
                              {param.key}
                            </span>
                            <span className="text-muted-foreground">=</span>
                            <span className="font-mono text-sm">
                              {param.value}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <CopyButton
                            text={param.key}
                            size="sm"
                            title="Copy key"
                          />
                          <CopyButton
                            text={param.value}
                            size="sm"
                            title="Copy value"
                          />
                          <CopyButton
                            text={`${param.key}=${param.value}`}
                            size="sm"
                            title="Copy pair"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureGrid features={features} />

      {/* Use Cases */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold">Common Use Cases</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌐 API Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-sm">
                Build and test API endpoints with query parameters
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                /api/users?limit=10&sort=name
              </code>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔍 Search URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-sm">
                Handle search queries with special characters
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                ?q=javascript%20tutorial
              </code>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📧 Email Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-sm">
                Create mailto links with encoded subjects
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                mailto:?subject=Hello%20World
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}

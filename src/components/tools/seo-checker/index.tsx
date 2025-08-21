"use client"

import { useState } from "react"
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Info,
  Loader2,
  Search,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ToolLayout } from "@/components/common"

interface SEOCheckResult {
  url: string
  finalUrl: string
  redirected: boolean
  responseTime: number
  fileSize: number
  doctype: {
    valid: boolean
    message: string
  }
  charset: {
    valid: boolean
    text: string
    message: string
  }
  htmlLang: {
    valid: boolean
    text: string
    message: string
  }
  title: {
    valid: boolean
    message: string
    text?: string
    length?: number
  }
  description: {
    valid: boolean
    text: string
    length: number
    message: string
  }
  robotsTag: {
    valid: boolean
    message: string
  }
  viewportTag: {
    valid: boolean
    text: string
    message: string
  }
  ogTags: {
    valid: boolean
    count: number
    message: string
    text: string
  }
  twitterCardTags: {
    valid: boolean
    count: number
    message: string
    text: string
  }
  metaTags: {
    valid: boolean
    count: number
    tags: Record<string, string>
    message: string
  }
  h1Count: {
    valid: boolean
    count: number
    message: string
    texts: string[]
  }
  headingCounts: {
    valid: boolean
    count: number
    message: string
    counts: Record<string, number>
    titles: Record<string, string[]>
    text: string
  }
  wordCount: {
    valid: boolean
    count: number
    message: string
  }
  paragraphCount: {
    valid: boolean
    count: number
    message: string
  }
  imageAltTags: {
    valid: boolean
    count: number
    message: string
  }
  linkCounts: {
    valid: boolean
    counts: {
      internal: number
      external: number
      nofollowExternal: number
    }
    message: string
  }
  canonicalLink: {
    valid: boolean
    message: string
  }
  faviconLink: {
    valid: boolean
    message: string
  }
  appleTouchIcon: {
    valid: boolean
    message: string
  }
  frames: {
    valid: boolean
    count: number
    message: string
  }
  hreflangLinks: {
    valid: boolean
    message: string
  }
  relNextPrev: {
    valid: boolean
    message: string
  }
  structuredData: {
    valid: boolean
    message: string
  }
  httpsCheck: {
    valid: boolean
    message: string
  }
  resourceHttpsCheck: {
    valid: boolean
    report: {
      mixedContent: string[]
      count: number
    }
    message: string
  }
  responseHeaders: {
    valid: boolean
    message: string
    headers: Record<string, string>
  }
  wwwRedirect: {
    valid: boolean
    message: string
  }
}

export function SEOChecker() {
  const [url, setUrl] = useState("https://example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SEOCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/seo-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze URL")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (valid: boolean) => {
    if (valid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (valid: boolean) => {
    if (valid) {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          Pass
        </Badge>
      )
    }
    return (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      >
        Fail
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <ToolLayout
      title="SEO Checker"
      description="Analyze your website's on-page SEO factors and get detailed recommendations for improvement."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Website Analysis</CardTitle>
            <CardDescription>
              Enter a URL to analyze its on-page technical SEO factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Check
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  <a
                    href={result.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {result.finalUrl}
                  </a>
                  {result.redirected && (
                    <span className="ml-2 text-orange-600 dark:text-orange-400">
                      (redirected from {result.url})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.responseTime}ms
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Response Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatFileSize(result.fileSize)}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      File Size
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.wordCount.count}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Word Count
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.headingCounts.count}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Headings
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical SEO */}
            <Card>
              <CardHeader>
                <CardTitle>Technical SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Doctype</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.doctype.valid)}
                      {getStatusBadge(result.doctype.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Charset</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.charset.valid)}
                      {getStatusBadge(result.charset.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HTML Lang</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.htmlLang.valid)}
                      {getStatusBadge(result.htmlLang.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HTTPS</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.httpsCheck.valid)}
                      {getStatusBadge(result.httpsCheck.valid)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content SEO */}
            <Card>
              <CardHeader>
                <CardTitle>Content & Meta Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Title Tag</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.title.valid)}
                        {getStatusBadge(result.title.valid)}
                      </div>
                    </div>
                    {result.title.text && (
                      <div className="text-muted-foreground text-xs">
                        &quot;{result.title.text}&quot; ({result.title.length}{" "}
                        chars)
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Description</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.description.valid)}
                        {getStatusBadge(result.description.valid)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {result.description.length} characters
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Viewport Tag</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.viewportTag.valid)}
                      {getStatusBadge(result.viewportTag.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Robots Tag</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.robotsTag.valid)}
                      {getStatusBadge(result.robotsTag.valid)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media & Open Graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Open Graph Tags
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.ogTags.valid)}
                        {getStatusBadge(result.ogTags.valid)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {result.ogTags.count} tags found
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Twitter Cards</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.twitterCardTags.valid)}
                        {getStatusBadge(result.twitterCardTags.valid)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {result.twitterCardTags.count} tags found
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Content Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">H1 Tags</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.h1Count.valid)}
                        {getStatusBadge(result.h1Count.valid)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {result.h1Count.count} H1 tag(s)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Heading Structure
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.headingCounts.valid)}
                        {getStatusBadge(result.headingCounts.valid)}
                      </div>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {result.headingCounts.count} headings total
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Images with Alt Text
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.imageAltTags.valid)}
                      {getStatusBadge(result.imageAltTags.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Canonical Link</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.canonicalLink.valid)}
                      {getStatusBadge(result.canonicalLink.valid)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links & Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>Links & Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.linkCounts.counts.internal}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Internal Links
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {result.linkCounts.counts.external}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      External Links
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.linkCounts.counts.nofollowExternal}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Nofollow External
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mixed Content</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.resourceHttpsCheck.valid)}
                      {getStatusBadge(result.resourceHttpsCheck.valid)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Security Headers
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.responseHeaders.valid)}
                      {getStatusBadge(result.responseHeaders.valid)}
                    </div>
                  </div>
                </div>
                {result.resourceHttpsCheck.report.mixedContent.length > 0 && (
                  <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <div className="font-medium">
                          Mixed Content Detected:
                        </div>
                        <ul className="mt-1 list-inside list-disc">
                          {result.resourceHttpsCheck.report.mixedContent
                            .slice(0, 5)
                            .map((item, index) => (
                              <li key={index} className="text-xs">
                                {item}
                              </li>
                            ))}
                          {result.resourceHttpsCheck.report.mixedContent
                            .length > 5 && (
                            <li className="text-xs">
                              ...and{" "}
                              {result.resourceHttpsCheck.report.mixedContent
                                .length - 5}{" "}
                              more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>
                  Click to expand and view detailed information for each section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <details className="group">
                  <summary className="hover:text-primary cursor-pointer list-none font-medium">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Meta Tags Details
                    </div>
                  </summary>
                  <div className="bg-muted mt-3 rounded-md p-3">
                    <div className="text-sm">
                      <div className="mb-2 font-medium">
                        Additional Meta Tags:
                      </div>
                      {Object.entries(result.metaTags.tags).map(
                        ([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="bg-background rounded px-1 py-0.5 font-mono text-xs">
                              {key}
                            </span>
                            : {value}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </details>

                <details className="group">
                  <summary className="hover:text-primary cursor-pointer list-none font-medium">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Heading Structure
                    </div>
                  </summary>
                  <div className="bg-muted mt-3 rounded-md p-3">
                    <div className="space-y-2 text-sm">
                      {Object.entries(result.headingCounts.counts).map(
                        ([tag, count]) =>
                          count > 0 && (
                            <div key={tag}>
                              <div className="font-medium">
                                {tag.toUpperCase()}: {count}
                              </div>
                              {result.headingCounts.titles[tag].length > 0 && (
                                <ul className="text-muted-foreground ml-4 list-disc text-xs">
                                  {result.headingCounts.titles[tag]
                                    .slice(0, 3)
                                    .map((title, index) => (
                                      <li key={index}>{title}</li>
                                    ))}
                                  {result.headingCounts.titles[tag].length >
                                    3 && (
                                    <li>
                                      ...and{" "}
                                      {result.headingCounts.titles[tag].length -
                                        3}{" "}
                                      more
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </details>

                <details className="group">
                  <summary className="hover:text-primary cursor-pointer list-none font-medium">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Response Headers
                    </div>
                  </summary>
                  <div className="bg-muted mt-3 rounded-md p-3">
                    <div className="text-sm">
                      {Object.entries(result.responseHeaders.headers).map(
                        ([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="bg-background rounded px-1 py-0.5 font-mono text-xs">
                              {key}
                            </span>
                            : {value}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

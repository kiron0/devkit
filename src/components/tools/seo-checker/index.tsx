"use client"

import { useState } from "react"
import axios from "axios"
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Download,
  Download as DownloadIcon,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Info,
  Link,
  Loader2,
  Search,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
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
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FeatureGrid, ToolLayout } from "@/components/common"

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
  schemaMarkup: {
    valid: boolean
    count: number
    message: string
  }
  breadcrumbNavigation: {
    valid: boolean
    message: string
  }
  sitemapReference: {
    valid: boolean
    message: string
  }
  rssFeeds: {
    valid: boolean
    count: number
    message: string
  }
}

interface SEOScore {
  overall: number
  technical: number
  content: number
  social: number
  performance: number
  security: number
}

export function SEOChecker() {
  const [url, setUrl] = useState("https://example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SEOCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  )
  const [progress, setProgress] = useState(0)

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const calculateSEOScore = (result: SEOCheckResult): SEOScore => {
    let technicalScore = 0
    let contentScore = 0
    let socialScore = 0
    let performanceScore = 0
    let securityScore = 0

    // Technical SEO (30 points)
    if (result.doctype.valid) technicalScore += 5
    if (result.charset.valid) technicalScore += 5
    if (result.htmlLang.valid) technicalScore += 5
    if (result.viewportTag.valid) technicalScore += 5
    if (result.robotsTag.valid) technicalScore += 5
    if (result.schemaMarkup.valid) technicalScore += 5

    // Content SEO (35 points)
    if (result.title.valid) contentScore += 10
    if (result.description.valid) contentScore += 10
    if (result.h1Count.valid) contentScore += 5
    if (result.headingCounts.valid) contentScore += 5
    if (result.breadcrumbNavigation.valid) contentScore += 5

    // Social Media (20 points)
    if (result.ogTags.valid) socialScore += 10
    if (result.twitterCardTags.valid) socialScore += 10

    // Performance (15 points)
    if (result.responseTime < 1000) performanceScore += 15
    else if (result.responseTime < 2000) performanceScore += 10
    else if (result.responseTime < 3000) performanceScore += 5

    // Security (10 points)
    if (result.httpsCheck.valid) securityScore += 5
    if (result.resourceHttpsCheck.valid) securityScore += 5

    const maxScore = 30 + 35 + 20 + 15 + 10 // 110
    const totalScore =
      technicalScore +
      contentScore +
      socialScore +
      performanceScore +
      securityScore

    const overall = Math.round((totalScore / maxScore) * 100)

    return {
      overall,
      technical: Math.round((technicalScore / 30) * 100),
      content: Math.round((contentScore / 35) * 100),
      social: Math.round((socialScore / 20) * 100),
      performance: Math.round((performanceScore / 15) * 100),
      security: Math.round((securityScore / 10) * 100),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)
    setSeoScore(null)
    setProgress(0)

    try {
      setProgress(10)
      const timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev))
      }, 300)

      const response = await axios.post("/api/seo-checker", { url })

      clearInterval(timer)
      setProgress(100)

      if (response.status < 200 || response.status >= 300) {
        const errorData = response.data || {
          error: "Failed to parse error response",
        }
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        )
      }

      const data = response.data
      setResult(data)
      setSeoScore(calculateSEOScore(data))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (valid: boolean) => {
    if (valid) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="mr-1 h-3 w-3" />
          Pass
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <XCircle className="mr-1 h-3 w-3" />
        Fail
      </Badge>
    )
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score >= 70)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (score >= 50)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const exportResults = () => {
    if (!result || !seoScore) return

    const report = `
SEO Analysis Report for ${result.finalUrl}
Generated on: ${new Date().toLocaleString()}

OVERALL SCORE: ${seoScore.overall}/100

DETAILED SCORES:
- Technical SEO: ${seoScore.technical}/100
- Content SEO: ${seoScore.content}/100
- Social Media: ${seoScore.social}/100
- Performance: ${seoScore.performance}/100
- Security: ${seoScore.security}/100

TECHNICAL ANALYSIS:
${result.doctype.message}
${result.charset.message}
${result.htmlLang.message}
${result.viewportTag.message}
${result.robotsTag.message}

CONTENT ANALYSIS:
${result.title.message}
${result.description.message}
${result.h1Count.message}
${result.headingCounts.message}
Word Count: ${result.wordCount.count}
Paragraph Count: ${result.paragraphCount.count}

PERFORMANCE:
Response Time: ${result.responseTime}ms
File Size: ${formatFileSize(result.fileSize)}

SECURITY:
${result.httpsCheck.message}
${result.resourceHttpsCheck.message}
    `

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `seo-report-${new URL(result.finalUrl).hostname}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const features = [
    {
      title: "SEO Score",
      description:
        "Comprehensive website SEO analysis with detailed insights, scoring, and actionable recommendations.",
      icon: "🔍",
    },
    {
      title: "Quick Overview",
      description:
        "Quick overview of the website's SEO score, response time, file size, word count, and heading count.",
      icon: "📈",
    },
    {
      title: "Detailed Analysis",
      description:
        "Detailed analysis of the website's SEO score, response time, file size, word count, and heading count.",
      icon: "📊",
    },
    {
      title: "Actionable Insights",
      description:
        "Actionable insights and recommendations to improve your website's SEO performance.",
      icon: "💡",
    },
    {
      title: "Export Results",
      description:
        "Export the SEO analysis results as a text file for easy sharing and reporting.",
      icon: "📄",
    },
    {
      title: "User-Friendly Interface",
      description:
        "Intuitive and user-friendly interface for easy navigation and understanding of SEO metrics.",
      icon: "🖥️",
    },
    {
      title: "Real-Time Analysis",
      description:
        "Real-time analysis of your website's SEO performance with instant feedback.",
      icon: "⏱️",
    },
    {
      title: "Multi-Tab View",
      description:
        "Multi-tab view for detailed insights into technical SEO, content, social media, performance, and security.",
      icon: "📑",
    },
  ]

  return (
    <ToolLayout
      title="SEO Checker"
      description="Comprehensive website SEO analysis with detailed insights, scoring, and actionable recommendations."
    >
      <TooltipProvider>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 md:flex-row"
              >
                <div className="relative flex-1">
                  <Globe
                    className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4"
                    strokeWidth={1.5}
                  />
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 text-base"
                    required
                  />
                  <div className="text-muted-foreground mt-3 text-center text-xs md:mt-6">
                    💡 Try: https://httpbin.org/html, https://github.com, or any
                    public website
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Analyze SEO
                    </>
                  )}
                </Button>
              </form>

              {/* Loading Progress */}
              {isLoading && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Analyzing website...</span>
                    <span className="text-primary">Please wait</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-muted-foreground text-center text-xs">
                    Checking technical SEO, content, social media, performance,
                    and security...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-3 text-red-700 md:flex-row dark:text-red-300">
                  <AlertCircle className="h-6 w-6" />
                  <div className="flex-1">
                    <div className="font-semibold">Analysis Failed</div>
                    <div className="mb-3 text-sm">{error}</div>
                    <div className="rounded-md bg-red-100 p-3 text-xs text-red-600 dark:bg-red-900/50 dark:text-red-400">
                      <div className="mb-2 font-medium">
                        💡 Common Solutions:
                      </div>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Check if the URL is accessible in your browser</li>
                        <li>Ensure the URL starts with http:// or https://</li>
                        <li>
                          Try a different website (some sites block automated
                          requests)
                        </li>
                        <li>
                          Check if the website is down or has restricted access
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && seoScore && (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <Card className="border-primary/20 from-primary/5 to-primary/10 border-2 bg-gradient-to-r">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">
                    SEO Score
                  </CardTitle>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-primary text-6xl font-bold">
                      {seoScore.overall}
                    </div>
                    <div className="text-muted-foreground text-2xl">/ 100</div>
                  </div>
                  <div className="flex justify-center">
                    <Badge
                      className={`px-4 py-2 text-lg ${getScoreBadgeColor(seoScore.overall)}`}
                    >
                      {seoScore.overall >= 90
                        ? "Excellent"
                        : seoScore.overall >= 70
                          ? "Good"
                          : seoScore.overall >= 50
                            ? "Fair"
                            : "Poor"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sky-600">
                        {seoScore.technical}%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Technical
                      </div>
                      <Progress value={seoScore.technical} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {seoScore.content}%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Content
                      </div>
                      <Progress value={seoScore.content} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {seoScore.social}%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Social
                      </div>
                      <Progress value={seoScore.social} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {seoScore.performance}%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Performance
                      </div>
                      <Progress value={seoScore.performance} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {seoScore.security}%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Security
                      </div>
                      <Progress value={seoScore.security} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-sky-50 p-4 text-center dark:bg-sky-950/50">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-sky-600" />
                      <div className="text-2xl font-bold text-sky-600">
                        {result.responseTime}ms
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Response Time
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/50">
                      <Download className="mx-auto mb-2 h-8 w-8 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        {formatFileSize(result.fileSize)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        File Size
                      </div>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-950/50">
                      <FileText className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">
                        {result.wordCount.count}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Word Count
                      </div>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-950/50">
                      <Link className="mx-auto mb-2 h-8 w-8 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-600">
                        {result.headingCounts.count}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Headings
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={exportResults} variant="outline">
                      <DownloadIcon className="h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <ScrollArea>
                  <TabsList>
                    <TabsTrigger
                      value="overview"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="technical"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Technical
                    </TabsTrigger>
                    <TabsTrigger
                      value="content"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Social
                    </TabsTrigger>
                    <TabsTrigger
                      value="performance"
                      className="flex items-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Performance
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Advanced
                    </TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Target className="h-5 w-5 text-sky-600" />
                          URL Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Final URL:
                          </span>
                          <a
                            href={result.finalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-sky-600 hover:underline"
                          >
                            {result.finalUrl}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        {result.redirected && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Redirected from:
                            </span>
                            <span className="text-sm text-orange-600">
                              {result.url}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">HTTPS:</span>
                          {getStatusBadge(result.httpsCheck.valid)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Key Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            SEO Score:
                          </span>
                          <Badge
                            className={getScoreBadgeColor(seoScore.overall)}
                          >
                            {seoScore.overall}/100
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Response Time:
                          </span>
                          <span
                            className={`text-sm font-medium ${result.responseTime < 1000 ? "text-green-600" : result.responseTime < 2000 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {result.responseTime}ms
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            File Size:
                          </span>
                          <span className="text-sm">
                            {formatFileSize(result.fileSize)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* SEO Tips */}
                  <Card className="border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-sky-200">
                        <Info className="h-5 w-5" />
                        SEO Tips & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="font-medium text-sky-800 dark:text-sky-200">
                            Technical SEO
                          </div>
                          <ul className="list-inside list-disc space-y-1 text-sky-700 dark:text-sky-300">
                            <li>Ensure proper HTML5 doctype</li>
                            <li>Set UTF-8 charset encoding</li>
                            <li>Add HTML lang attribute</li>
                            <li>Include viewport meta tag</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sky-800 dark:text-sky-200">
                            Content SEO
                          </div>
                          <ul className="list-inside list-disc space-y-1 text-sky-700 dark:text-sky-300">
                            <li>Write compelling titles (50-60 chars)</li>
                            <li>Create descriptive meta descriptions</li>
                            <li>Use proper heading hierarchy (H1-H6)</li>
                            <li>Include 300+ words of quality content</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Technical SEO Analysis
                      </CardTitle>
                      <CardDescription>
                        Core technical elements that affect search engine
                        crawling and indexing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-sky-600" />
                              <span className="font-medium">Doctype</span>
                            </div>
                            {getStatusBadge(result.doctype.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.doctype.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Charset</span>
                            </div>
                            {getStatusBadge(result.charset.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.charset.text} - {result.charset.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">HTML Lang</span>
                            </div>
                            {getStatusBadge(result.htmlLang.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.htmlLang.text} - {result.htmlLang.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">Viewport Tag</span>
                            </div>
                            {getStatusBadge(result.viewportTag.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.viewportTag.message}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Content & Meta Analysis
                      </CardTitle>
                      <CardDescription>
                        Content structure, meta tags, and readability factors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-sky-600" />
                              <span className="font-medium">Title Tag</span>
                            </div>
                            {getStatusBadge(result.title.valid)}
                          </div>
                          {result.title.text && (
                            <div className="text-muted-foreground ml-6 text-sm">
                              &ldquo;{result.title.text}&rdquo; (
                              {result.title.length} chars)
                            </div>
                          )}
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.title.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Description</span>
                            </div>
                            {getStatusBadge(result.description.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.description.length} characters -{" "}
                            {result.description.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">H1 Tags</span>
                            </div>
                            {getStatusBadge(result.h1Count.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.h1Count.count} H1 tag(s) -{" "}
                            {result.h1Count.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">
                                Heading Structure
                              </span>
                            </div>
                            {getStatusBadge(result.headingCounts.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.headingCounts.count} headings total
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Social Tab */}
                <TabsContent value="social" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Social Media & Open Graph
                      </CardTitle>
                      <CardDescription>
                        Social media optimization and sharing appearance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Share2 className="h-4 w-4 text-sky-600" />
                              <span className="font-medium">
                                Open Graph Tags
                              </span>
                            </div>
                            {getStatusBadge(result.ogTags.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.ogTags.count} tags found
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.ogTags.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Share2 className="h-4 w-4 text-green-600" />
                              <span className="font-medium">Twitter Cards</span>
                            </div>
                            {getStatusBadge(result.twitterCardTags.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.twitterCardTags.count} tags found
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.twitterCardTags.message}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Performance & Security
                      </CardTitle>
                      <CardDescription>
                        Page speed, security headers, and HTTPS implementation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-sky-600" />
                              <span className="font-medium">Response Time</span>
                            </div>
                            <Badge
                              className={
                                result.responseTime < 1000
                                  ? "bg-green-100 text-green-800"
                                  : result.responseTime < 2000
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {result.responseTime}ms
                            </Badge>
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.responseTime < 1000
                              ? "Excellent"
                              : result.responseTime < 2000
                                ? "Good"
                                : "Needs improvement"}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="font-medium">HTTPS</span>
                            </div>
                            {getStatusBadge(result.httpsCheck.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.httpsCheck.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">Mixed Content</span>
                            </div>
                            {getStatusBadge(result.resourceHttpsCheck.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.resourceHttpsCheck.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">
                                Security Headers
                              </span>
                            </div>
                            {getStatusBadge(result.responseHeaders.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.responseHeaders.message}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Advanced SEO Features
                      </CardTitle>
                      <CardDescription>
                        Advanced SEO elements and structured data analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-sky-600" />
                              <span className="font-medium">
                                Schema.org Markup
                              </span>
                            </div>
                            {getStatusBadge(result.schemaMarkup.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.schemaMarkup.count} markup elements found
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.schemaMarkup.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                Breadcrumb Navigation
                              </span>
                            </div>
                            {getStatusBadge(result.breadcrumbNavigation.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.breadcrumbNavigation.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">
                                Sitemap Reference
                              </span>
                            </div>
                            {getStatusBadge(result.sitemapReference.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.sitemapReference.message}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">
                                RSS/Atom Feeds
                              </span>
                            </div>
                            {getStatusBadge(result.rssFeeds.valid)}
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.rssFeeds.count} feeds found
                          </div>
                          <div className="text-muted-foreground ml-6 text-sm">
                            {result.rssFeeds.message}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Detailed Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Detailed Analysis
                  </CardTitle>
                  <CardDescription>
                    Expand sections to view detailed information and
                    recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meta Tags Details */}
                  <div className="rounded-lg border">
                    <button
                      onClick={() => toggleSection("meta")}
                      className="hover:bg-muted/50 w-full p-4 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">Meta Tags Details</span>
                        </div>
                        {expandedSections.has("meta") ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {expandedSections.has("meta") && (
                      <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-2 text-sm">
                          <div className="mb-3 font-medium">
                            Additional Meta Tags:
                          </div>
                          {Object.entries(result.metaTags.tags).length > 0 ? (
                            Object.entries(result.metaTags.tags).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2"
                                >
                                  <code className="bg-background rounded px-2 py-1 font-mono text-xs">
                                    {key}
                                  </code>
                                  <span className="text-muted-foreground">
                                    :
                                  </span>
                                  <span className="text-sm">{value}</span>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              No additional meta tags found.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Heading Structure */}
                  <div className="rounded-lg border">
                    <button
                      onClick={() => toggleSection("headings")}
                      className="hover:bg-muted/50 w-full p-4 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span className="font-medium">Heading Structure</span>
                        </div>
                        {expandedSections.has("headings") ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {expandedSections.has("headings") && (
                      <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-3 text-sm">
                          {Object.values(result.headingCounts.counts).reduce(
                            (sum, count) => sum + count,
                            0
                          ) > 0 ? (
                            Object.entries(result.headingCounts.counts).map(
                              ([tag, count]) =>
                                count > 0 && (
                                  <div key={tag}>
                                    <div className="mb-2 font-medium">
                                      {tag.toUpperCase()}: {count}
                                    </div>
                                    {result.headingCounts.titles[tag].length >
                                      0 && (
                                      <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-xs">
                                        {result.headingCounts.titles[tag]
                                          .slice(0, 3)
                                          .map((title, index) => (
                                            <li key={index}>{title}</li>
                                          ))}
                                        {result.headingCounts.titles[tag]
                                          .length > 3 && (
                                          <li>
                                            ...and{" "}
                                            {result.headingCounts.titles[tag]
                                              .length - 3}{" "}
                                            more
                                          </li>
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                )
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              No headings found on this page.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Response Headers */}
                  <div className="rounded-lg border">
                    <button
                      onClick={() => toggleSection("headers")}
                      className="hover:bg-muted/50 w-full p-4 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="font-medium">Response Headers</span>
                        </div>
                        {expandedSections.has("headers") ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    {expandedSections.has("headers") && (
                      <div className="bg-muted/30 border-t p-4">
                        <div className="space-y-2 overflow-auto text-sm">
                          {Object.entries(result.responseHeaders.headers)
                            .length > 0 ? (
                            Object.entries(result.responseHeaders.headers).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2"
                                >
                                  <code className="bg-background rounded px-2 py-1 font-mono text-xs">
                                    {key}
                                  </code>
                                  <span className="text-muted-foreground">
                                    :
                                  </span>
                                  <span className="text-sm">{value}</span>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              No response headers found.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </TooltipProvider>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

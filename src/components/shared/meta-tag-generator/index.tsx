"use client"

import { useState } from "react"
import Image from "next/image"
import { Copy, Download } from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface MetaTag {
  name?: string
  content: string
  property?: string
  httpEquiv?: string
}

interface MetaData {
  title: string
  description: string
  keywords: string
  author: string
  robots: string
  viewport: string
  charset: string
  language: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  ogType: string
  ogSiteName: string
  ogLocale: string
  twitterCard: string
  twitterSite: string
  twitterCreator: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
}

const ROBOTS_OPTIONS = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
  "index, follow, max-snippet:-1",
  "index, follow, max-image-preview:large",
  "index, follow, max-snippet:-1, max-image-preview:large",
]

const VIEWPORT_OPTIONS = [
  "width=device-width, initial-scale=1.0",
  "width=device-width, initial-scale=1.0, maximum-scale=1.0",
  "width=device-width, initial-scale=1.0, user-scalable=no",
  "width=device-width, initial-scale=1.0, shrink-to-fit=no",
]

const CHARSET_OPTIONS = ["UTF-8", "ISO-8859-1", "Windows-1252"]

const LANGUAGE_OPTIONS = [
  "en",
  "en-US",
  "en-GB",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
]

const OG_TYPE_OPTIONS = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
]

const TWITTER_CARD_OPTIONS = ["summary", "summary_large_image", "app", "player"]

export function MetaTagGenerator() {
  const [metaData, setMetaData] = useState<MetaData>({
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1.0",
    charset: "UTF-8",
    language: "en",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    ogType: "website",
    ogSiteName: "",
    ogLocale: "en_US",
    twitterCard: "summary",
    twitterSite: "",
    twitterCreator: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  })
  const [activeTab, setActiveTab] = useState("basic")

  const updateMetaData = (key: keyof MetaData, value: string) => {
    setMetaData((prev) => ({ ...prev, [key]: value }))
  }

  const generateBasicMetaTags = (): MetaTag[] => {
    const tags: MetaTag[] = []

    if (metaData.title) {
      tags.push({ name: "title", content: metaData.title })
    }
    if (metaData.description) {
      tags.push({ name: "description", content: metaData.description })
    }
    if (metaData.keywords) {
      tags.push({ name: "keywords", content: metaData.keywords })
    }
    if (metaData.author) {
      tags.push({ name: "author", content: metaData.author })
    }
    if (metaData.robots) {
      tags.push({ name: "robots", content: metaData.robots })
    }
    if (metaData.viewport) {
      tags.push({ name: "viewport", content: metaData.viewport })
    }
    if (metaData.charset) {
      tags.push({ name: "charset", content: metaData.charset })
    }
    if (metaData.language) {
      tags.push({ name: "language", content: metaData.language })
    }

    return tags
  }

  const generateOpenGraphTags = (): MetaTag[] => {
    const tags: MetaTag[] = []

    if (metaData.ogTitle || metaData.title) {
      tags.push({
        property: "og:title",
        content: metaData.ogTitle || metaData.title,
      })
    }
    if (metaData.ogDescription || metaData.description) {
      tags.push({
        property: "og:description",
        content: metaData.ogDescription || metaData.description,
      })
    }
    if (metaData.ogImage) {
      tags.push({ property: "og:image", content: metaData.ogImage })
    }
    if (metaData.ogUrl || metaData.canonical) {
      tags.push({
        property: "og:url",
        content: metaData.ogUrl || metaData.canonical,
      })
    }
    if (metaData.ogType) {
      tags.push({ property: "og:type", content: metaData.ogType })
    }
    if (metaData.ogSiteName) {
      tags.push({ property: "og:site_name", content: metaData.ogSiteName })
    }
    if (metaData.ogLocale) {
      tags.push({ property: "og:locale", content: metaData.ogLocale })
    }

    return tags
  }

  const generateTwitterTags = (): MetaTag[] => {
    const tags: MetaTag[] = []

    if (metaData.twitterCard) {
      tags.push({ name: "twitter:card", content: metaData.twitterCard })
    }
    if (metaData.twitterSite) {
      tags.push({ name: "twitter:site", content: metaData.twitterSite })
    }
    if (metaData.twitterCreator) {
      tags.push({ name: "twitter:creator", content: metaData.twitterCreator })
    }
    if (metaData.twitterTitle || metaData.title) {
      tags.push({
        name: "twitter:title",
        content: metaData.twitterTitle || metaData.title,
      })
    }
    if (metaData.twitterDescription || metaData.description) {
      tags.push({
        name: "twitter:description",
        content: metaData.twitterDescription || metaData.description,
      })
    }
    if (metaData.twitterImage) {
      tags.push({ name: "twitter:image", content: metaData.twitterImage })
    }

    return tags
  }

  const generateHTML = () => {
    const basicTags = generateBasicMetaTags()
    const ogTags = generateOpenGraphTags()
    const twitterTags = generateTwitterTags()

    let html = "<!DOCTYPE html>\n<html"
    if (metaData.language) {
      html += ` lang="${metaData.language}"`
    }
    html += ">\n<head>\n"

    if (metaData.charset) {
      html += `  <meta charset="${metaData.charset}">\n`
    }

    basicTags.forEach((tag) => {
      if (tag.name === "title") {
        html += `  <title>${tag.content}</title>\n`
      } else if (tag.name === "charset") {
        // Already handled above
      } else {
        html += `  <meta name="${tag.name}" content="${tag.content}">\n`
      }
    })

    if (metaData.canonical) {
      html += `  <link rel="canonical" href="${metaData.canonical}">\n`
    }

    ogTags.forEach((tag) => {
      html += `  <meta property="${tag.property}" content="${tag.content}">\n`
    })

    twitterTags.forEach((tag) => {
      html += `  <meta name="${tag.name}" content="${tag.content}">\n`
    })

    html += "</head>\n<body>\n  <!-- Your content here -->\n</body>\n</html>"

    return html
  }

  const generateMetaTagsOnly = () => {
    const basicTags = generateBasicMetaTags()
    const ogTags = generateOpenGraphTags()
    const twitterTags = generateTwitterTags()

    let html = ""

    basicTags.forEach((tag) => {
      if (tag.name === "title") {
        html += `<title>${tag.content}</title>\n`
      } else if (tag.name === "charset") {
        html += `<meta charset="${tag.content}">\n`
      } else {
        html += `<meta name="${tag.name}" content="${tag.content}">\n`
      }
    })

    if (metaData.canonical) {
      html += `<link rel="canonical" href="${metaData.canonical}">\n`
    }

    ogTags.forEach((tag) => {
      html += `<meta property="${tag.property}" content="${tag.content}">\n`
    })

    twitterTags.forEach((tag) => {
      html += `<meta name="${tag.name}" content="${tag.content}">\n`
    })

    return html
  }

  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML())
      toast({
        title: "HTML copied!",
        description: "Complete HTML has been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy HTML:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy HTML to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyMetaTags = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTagsOnly())
      toast({
        title: "Meta tags copied!",
        description: "Meta tags have been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy meta tags:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy meta tags to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadHTML = () => {
    const blob = new Blob([generateHTML()], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "index.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getPreviewData = () => {
    return {
      title: metaData.ogTitle || metaData.title || "Page Title",
      description:
        metaData.ogDescription ||
        metaData.description ||
        "Page description will appear here",
      image: metaData.ogImage || metaData.twitterImage || "",
      url: metaData.ogUrl || metaData.canonical || "https://example.com",
    }
  }

  const features = [
    {
      title: "SEO Optimization",
      description:
        "Generate essential meta tags for better search engine visibility.",
      icon: "🔍",
    },
    {
      title: "Social Media Integration",
      description:
        "Create Open Graph and Twitter Card tags to enhance social media sharing.",
      icon: "📱",
    },
    {
      title: "Live Preview",
      description:
        "See how your content will appear on social media platforms.",
      icon: "👀",
    },
    {
      title: "Downloadable HTML",
      description: "Download the complete HTML with all meta tags included.",
      icon: "💾",
    },
  ]

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Meta Tag Generator</h1>
          <p className="text-muted-foreground">
            Generate SEO meta tags, Open Graph, and Twitter Card tags for your
            website
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic SEO</TabsTrigger>
            <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
            <TabsTrigger value="twitter">Twitter Cards</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic SEO Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic SEO Meta Tags</CardTitle>
                  <CardDescription>
                    Essential meta tags for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter your page title"
                      value={metaData.title}
                      onChange={(e) => updateMetaData("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a compelling description (150-160 characters)"
                      value={metaData.description}
                      onChange={(e) =>
                        updateMetaData("description", e.target.value)
                      }
                      className="max-h-[150px] min-h-[100px]"
                      maxLength={160}
                    />
                    <div className="text-muted-foreground text-right text-xs">
                      {metaData.description.length}/160
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={metaData.keywords}
                      onChange={(e) =>
                        updateMetaData("keywords", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Your name or company"
                      value={metaData.author}
                      onChange={(e) => updateMetaData("author", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      placeholder="https://example.com/page"
                      value={metaData.canonical}
                      onChange={(e) =>
                        updateMetaData("canonical", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Technical Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Settings</CardTitle>
                  <CardDescription>
                    Advanced meta tag configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="robots">Robots</Label>
                    <Select
                      value={metaData.robots}
                      onValueChange={(value) => updateMetaData("robots", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select robots directive" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROBOTS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="viewport">Viewport</Label>
                    <Select
                      value={metaData.viewport}
                      onValueChange={(value) =>
                        updateMetaData("viewport", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select viewport setting" />
                      </SelectTrigger>
                      <SelectContent>
                        {VIEWPORT_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charset">Character Encoding</Label>
                    <Select
                      value={metaData.charset}
                      onValueChange={(value) =>
                        updateMetaData("language", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHARSET_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={metaData.language}
                      onValueChange={(value) =>
                        updateMetaData("language", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opengraph" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Open Graph Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Meta Tags</CardTitle>
                  <CardDescription>
                    Control how your content appears when shared on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">Open Graph Title</Label>
                    <Input
                      id="ogTitle"
                      placeholder="Leave empty to use page title"
                      value={metaData.ogTitle}
                      onChange={(e) =>
                        updateMetaData("ogTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">
                      Open Graph Description
                    </Label>
                    <Textarea
                      id="ogDescription"
                      placeholder="Leave empty to use meta description"
                      value={metaData.ogDescription}
                      onChange={(e) =>
                        updateMetaData("ogDescription", e.target.value)
                      }
                      className="max-h-[150px] min-h-[100px]"
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Open Graph Image URL</Label>
                    <Input
                      id="ogImage"
                      placeholder="https://example.com/image.jpg"
                      value={metaData.ogImage}
                      onChange={(e) =>
                        updateMetaData("ogImage", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogUrl">Open Graph URL</Label>
                    <Input
                      id="ogUrl"
                      placeholder="https://example.com/page"
                      value={metaData.ogUrl}
                      onChange={(e) => updateMetaData("ogUrl", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogType">Open Graph Type</Label>
                    <Select
                      value={metaData.ogType}
                      onValueChange={(value) => updateMetaData("ogType", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Open Graph type" />
                      </SelectTrigger>
                      <SelectContent>
                        {OG_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogSiteName">Site Name</Label>
                    <Input
                      id="ogSiteName"
                      placeholder="Your website name"
                      value={metaData.ogSiteName}
                      onChange={(e) =>
                        updateMetaData("ogSiteName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogLocale">Locale</Label>
                    <Input
                      id="ogLocale"
                      placeholder="en_US"
                      value={metaData.ogLocale}
                      onChange={(e) =>
                        updateMetaData("ogLocale", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Open Graph Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Preview</CardTitle>
                  <CardDescription>
                    How your content will appear on Facebook, LinkedIn, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 rounded-lg border p-4">
                    {getPreviewData().image && (
                      <Image
                        src={getPreviewData().image}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="h-32 w-full rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-sky-500">
                        {getPreviewData().url}
                      </div>
                      <div className="text-lg font-semibold">
                        {getPreviewData().title}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {getPreviewData().description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Twitter Card Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Meta Tags</CardTitle>
                  <CardDescription>
                    Control how your content appears on Twitter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterCard">Twitter Card Type</Label>
                    <Select
                      value={metaData.twitterCard}
                      onValueChange={(value) =>
                        updateMetaData("twitterCard", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Twitter card type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TWITTER_CARD_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterSite">Twitter Site</Label>
                    <Input
                      id="twitterSite"
                      placeholder="@username or @website"
                      value={metaData.twitterSite}
                      onChange={(e) =>
                        updateMetaData("twitterSite", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterCreator">Twitter Creator</Label>
                    <Input
                      id="twitterCreator"
                      placeholder="@username"
                      value={metaData.twitterCreator}
                      onChange={(e) =>
                        updateMetaData("twitterCreator", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterTitle">Twitter Title</Label>
                    <Input
                      id="twitterTitle"
                      placeholder="Leave empty to use page title"
                      value={metaData.twitterTitle}
                      onChange={(e) =>
                        updateMetaData("twitterTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterDescription">
                      Twitter Description
                    </Label>
                    <Textarea
                      id="twitterDescription"
                      placeholder="Leave empty to use meta description"
                      value={metaData.twitterDescription}
                      onChange={(e) =>
                        updateMetaData("twitterDescription", e.target.value)
                      }
                      className="max-h-[150px] min-h-[100px]"
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterImage">Twitter Image URL</Label>
                    <Input
                      id="twitterImage"
                      placeholder="https://example.com/image.jpg"
                      value={metaData.twitterImage}
                      onChange={(e) =>
                        updateMetaData("twitterImage", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Preview</CardTitle>
                  <CardDescription>
                    How your content will appear on Twitter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 rounded-lg border p-4">
                    {getPreviewData().image && (
                      <Image
                        width={500}
                        height={300}
                        src={getPreviewData().image}
                        alt="Preview"
                        className="h-32 w-full rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    )}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Twitter</div>
                      <div className="text-lg font-semibold">
                        {getPreviewData().title}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {getPreviewData().description}
                      </div>
                      <div className="text-sm text-sky-500">
                        {getPreviewData().url}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Generated Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                  <CardDescription>
                    Copy the generated HTML or meta tags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Complete HTML</Label>
                    <CodeHighlighter
                      language="html"
                      className="max-h-64 overflow-y-auto"
                    >
                      {generateHTML()}
                    </CodeHighlighter>
                    <div className="flex gap-2">
                      <Button onClick={copyHTML} className="flex-1">
                        <Copy className="h-4 w-4" />
                        Copy HTML
                      </Button>
                      <Button onClick={downloadHTML} variant="outline">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Meta Tags Only</Label>
                    <CodeHighlighter
                      language="html"
                      className="max-h-64 overflow-y-auto"
                    >
                      {generateMetaTagsOnly()}
                    </CodeHighlighter>
                    <Button onClick={copyMetaTags} className="w-full">
                      <Copy className="h-4 w-4" />
                      Copy Meta Tags
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Preview</CardTitle>
                  <CardDescription>
                    How your content appears on mobile devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 text-center text-sm text-gray-500">
                      Mobile Browser
                    </div>
                    <div className="bg-muted rounded-lg p-3 shadow-sm">
                      <div className="mb-1 text-xs text-gray-400">
                        Search Result
                      </div>
                      <div className="mb-1 text-sm text-sky-500">
                        {getPreviewData().url}
                      </div>
                      <div className="mb-1 text-base font-medium">
                        {getPreviewData().title}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {getPreviewData().description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

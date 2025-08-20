"use client"

import { useState } from "react"
import { Copy, Search } from "lucide-react"

import { toast } from "@/hooks/use-toast"
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
import { FeatureGrid, ToolLayout } from "@/components/common"

interface FontFamily {
  family: string
  category: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: Record<string, string>
}

interface FontPairing {
  name: string
  description: string
  headingFont: string
  bodyFont: string
  accentFont?: string
  category: "classic" | "modern" | "playful" | "professional" | "minimal"
  tags: string[]
  preview: string
}

const DESIGN_STYLES = [
  "classic",
  "modern",
  "playful",
  "professional",
  "minimal",
  "elegant",
  "bold",
  "clean",
]

const PREMADE_PAIRINGS: FontPairing[] = [
  {
    name: "Classic Serif",
    description: "Traditional and readable typography for formal content",
    headingFont: "Playfair Display",
    bodyFont: "Source Sans Pro",
    category: "classic",
    tags: ["formal", "readable", "traditional"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Modern Sans",
    description: "Clean and contemporary design for modern websites",
    headingFont: "Inter",
    bodyFont: "Open Sans",
    category: "modern",
    tags: ["clean", "contemporary", "web"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Playful Display",
    description: "Fun and creative typography for engaging content",
    headingFont: "Fredoka One",
    bodyFont: "Nunito",
    category: "playful",
    tags: ["fun", "creative", "engaging"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Professional Clean",
    description: "Corporate and business-focused typography",
    headingFont: "Roboto",
    bodyFont: "Lato",
    category: "professional",
    tags: ["corporate", "business", "clean"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Minimalist",
    description: "Simple and elegant typography for minimal designs",
    headingFont: "Montserrat",
    bodyFont: "Source Sans Pro",
    category: "minimal",
    tags: ["simple", "elegant", "minimal"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Editorial",
    description: "Magazine-style typography for editorial content",
    headingFont: "Merriweather",
    bodyFont: "Open Sans",
    category: "classic",
    tags: ["editorial", "magazine", "content"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Tech Startup",
    description: "Modern tech company typography",
    headingFont: "Poppins",
    bodyFont: "Inter",
    category: "modern",
    tags: ["tech", "startup", "modern"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Creative Agency",
    description: "Bold and creative typography for agencies",
    headingFont: "Bebas Neue",
    bodyFont: "Roboto",
    category: "playful",
    tags: ["creative", "agency", "bold"],
    preview: "The quick brown fox jumps over the lazy dog",
  },
]

const GOOGLE_FONTS: FontFamily[] = [
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    version: "v12",
    lastModified: "2023-12-07",
    files: {
      "100":
        "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
      "400":
        "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    },
  },
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
    version: "v30",
    lastModified: "2023-12-07",
    files: {
      "100": "http://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu4mxK.woff2",
      "400": "http://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
    },
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
    version: "v34",
    lastModified: "2023-12-07",
    files: {
      "300":
        "http://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2",
      "400":
        "http://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2",
    },
  },
  {
    family: "Lato",
    category: "sans-serif",
    variants: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
    version: "v23",
    lastModified: "2023-12-07",
    files: {
      "100": "http://fonts.gstatic.com/s/lato/v23/S6u8w4BMUTPHh30AXC-v.woff2",
      "400": "http://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wWw.woff2",
    },
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    version: "v30",
    lastModified: "2023-12-07",
    files: {
      "400":
        "http://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwc7jX9OeHs.woff2",
      "700":
        "http://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwc7jX9OeHs.woff2",
    },
  },
  {
    family: "Merriweather",
    category: "serif",
    variants: ["300", "400", "700", "900"],
    subsets: ["latin"],
    version: "v30",
    lastModified: "2023-12-07",
    files: {
      "300":
        "http://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhS9gW8tQ9o.woff2",
      "400":
        "http://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhS9gW8tQ9o.woff2",
    },
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    version: "v20",
    lastModified: "2023-12-07",
    files: {
      "100":
        "http://fonts.gstatic.com/s/poppins/v20/pxiGyp8kv8JHgFVrLPTucHtF.woff2",
      "400":
        "http://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2",
    },
  },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    version: "v25",
    lastModified: "2023-12-07",
    files: {
      "100":
        "http://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2",
      "400":
        "http://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2",
    },
  },
]

export function FontPairingSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStyle, setSelectedStyle] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPairing, setSelectedPairing] = useState<FontPairing | null>(
    null
  )
  const [customPairing, setCustomPairing] = useState({
    headingFont: "",
    bodyFont: "",
    accentFont: "",
  })
  const [activeTab, setActiveTab] = useState("suggestions")

  const filteredPairings = PREMADE_PAIRINGS.filter((pairing) => {
    const matchesCategory =
      selectedCategory === "all" || pairing.category === selectedCategory
    const matchesStyle =
      selectedStyle === "all" || pairing.tags.includes(selectedStyle)
    const matchesSearch =
      searchQuery === "" ||
      pairing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pairing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pairing.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    return matchesCategory && matchesStyle && matchesSearch
  })

  const generateCSS = (pairing: FontPairing) => {
    return `/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=${pairing.headingFont.replace(/\s+/g, "+")}:wght@400;700&family=${pairing.bodyFont.replace(/\s+/g, "+")}:wght@300;400;500&display=swap');

/* Typography System */
.heading-font {
  font-family: '${pairing.headingFont}', serif;
  font-weight: 700;
  line-height: 1.2;
}

.body-font {
  font-family: '${pairing.bodyFont}', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

/* Example Usage */
h1, h2, h3, h4, h5, h6 {
  font-family: '${pairing.headingFont}', serif;
  font-weight: 700;
}

p, span, div {
  font-family: '${pairing.bodyFont}', sans-serif;
  font-weight: 400;
}`
  }

  const generateTailwindCSS = (pairing: FontPairing) => {
    return `/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'heading': ['${pairing.headingFont}', 'serif'],
        'body': ['${pairing.bodyFont}', 'sans-serif'],
      },
    },
  },
}

/* Usage in Tailwind */
<h1 class="font-heading font-bold text-4xl">Heading</h1>
<p class="font-body text-lg">Body text</p>`
  }

  const copyCSS = async (pairing: FontPairing, type: "css" | "tailwind") => {
    const css =
      type === "css" ? generateCSS(pairing) : generateTailwindCSS(pairing)
    try {
      await navigator.clipboard.writeText(css)
      toast({
        title: "CSS copied!",
        description: `${type === "css" ? "CSS" : "Tailwind CSS"} has been copied to clipboard`,
      })
    } catch (error) {
      console.error("Failed to copy CSS:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy CSS to clipboard",
        variant: "destructive",
      })
    }
  }

  const getGoogleFontsLink = (pairing: FontPairing) => {
    const fonts = [pairing.headingFont, pairing.bodyFont]
    if (pairing.accentFont) fonts.push(pairing.accentFont)

    return `https://fonts.googleapis.com/css2?${fonts
      .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;700`)
      .join("&")}&display=swap`
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "classic":
        return "📚"
      case "modern":
        return "🚀"
      case "playful":
        return "🎨"
      case "professional":
        return "💼"
      case "minimal":
        return "✨"
      default:
        return "🔤"
    }
  }

  const features = [
    {
      title: "Google Fonts Integration",
      description:
        "Seamlessly browse and select from thousands of Google Fonts.",
      icon: "🌐",
    },
    {
      title: "Custom Pairing Builder",
      description: "Create your own font combinations with live preview.",
      icon: "✏️",
    },
    {
      title: "Pre-made Suggestions",
      description:
        "Explore curated font pairings for various design styles and categories.",
      icon: "🎨",
    },
    {
      title: "Search and Filter",
      description:
        "Quickly find font pairings by name, category, or design style.",
      icon: "🔍",
    },
  ]

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Font Pairing Suggestions</h1>
          <p className="text-muted-foreground">
            Discover beautiful typography combinations with Google Fonts
            integration
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="custom">Custom Pairing</TabsTrigger>
            <TabsTrigger value="browse">Browse Fonts</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                      placeholder="Search font pairings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStyle}
                    onValueChange={setSelectedStyle}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Styles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      {DESIGN_STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Font Pairings Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPairings.map((pairing) => (
                <Card
                  key={pairing.name}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => setSelectedPairing(pairing)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {pairing.name}
                        </CardTitle>
                        <CardDescription>{pairing.description}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {getCategoryIcon(pairing.category)}
                        {pairing.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Heading:</span>{" "}
                        {pairing.headingFont}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Body:</span>{" "}
                        {pairing.bodyFont}
                      </div>
                    </div>

                    <div
                      className="rounded-lg border p-3"
                      style={{
                        fontFamily: pairing.bodyFont,
                        fontSize: "14px",
                        lineHeight: "1.4",
                      }}
                    >
                      {pairing.preview}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pairing.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Custom Pairing Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Pairing</CardTitle>
                  <CardDescription>
                    Build your own font combination
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Heading Font</Label>
                    <Select
                      value={customPairing.headingFont}
                      onValueChange={(value) =>
                        setCustomPairing((prev) => ({
                          ...prev,
                          headingFont: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select heading font" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOOGLE_FONTS.map((font) => (
                          <SelectItem key={font.family} value={font.family}>
                            {font.family}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Body Font</Label>
                    <Select
                      value={customPairing.bodyFont}
                      onValueChange={(value) =>
                        setCustomPairing((prev) => ({
                          ...prev,
                          bodyFont: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select body font" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOOGLE_FONTS.map((font) => (
                          <SelectItem key={font.family} value={font.family}>
                            {font.family}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentFont">Accent Font (Optional)</Label>
                    <Select
                      value={customPairing.accentFont}
                      onValueChange={(value) =>
                        setCustomPairing((prev) => ({
                          ...prev,
                          accentFont: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select accent font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {GOOGLE_FONTS.map((font) => (
                          <SelectItem key={font.family} value={font.family}>
                            {font.family}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Pairing Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your fonts look together
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customPairing.headingFont && customPairing.bodyFont ? (
                    <>
                      <div
                        className="mb-4 text-2xl font-bold"
                        style={{ fontFamily: customPairing.headingFont }}
                      >
                        This is a Heading
                      </div>
                      <div
                        className="text-base leading-relaxed"
                        style={{ fontFamily: customPairing.bodyFont }}
                      >
                        This is body text that demonstrates how your chosen
                        fonts work together. The combination should provide good
                        contrast and readability while maintaining visual
                        harmony.
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Button
                          onClick={() =>
                            copyCSS(
                              {
                                name: "Custom Pairing",
                                description: "Your custom font combination",
                                headingFont: customPairing.headingFont,
                                bodyFont: customPairing.bodyFont,
                                accentFont: customPairing.accentFont,
                                category: "minimal",
                                tags: ["custom"],
                                preview: "Custom font pairing",
                              } as FontPairing,
                              "css"
                            )
                          }
                          className="w-full"
                        >
                          <Copy className="h-4 w-4" />
                          Copy CSS
                        </Button>
                        <Button
                          onClick={() =>
                            copyCSS(
                              {
                                name: "Custom Pairing",
                                description: "Your custom font combination",
                                headingFont: customPairing.headingFont,
                                bodyFont: customPairing.bodyFont,
                                accentFont: customPairing.accentFont,
                                category: "minimal", // Use a valid category
                                tags: ["custom"],
                                preview: "Custom font pairing",
                              } as FontPairing,
                              "tailwind"
                            )
                          }
                          variant="outline"
                          className="w-full"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Tailwind CSS
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground py-8 text-center">
                      Select fonts to see preview
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Browse Google Fonts</CardTitle>
                <CardDescription>
                  Explore available fonts by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {GOOGLE_FONTS.map((font) => (
                    <div
                      key={font.family}
                      className="space-y-2 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{font.family}</h3>
                        <Badge variant="outline" className="text-xs">
                          {font.category}
                        </Badge>
                      </div>
                      <div
                        className="text-lg"
                        style={{ fontFamily: font.family }}
                      >
                        The quick brown fox
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {font.variants.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Font Pairing Detail Modal */}
        {selectedPairing && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedPairing.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedPairing.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPairing(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="space-y-4 rounded-lg border p-6">
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: selectedPairing.headingFont }}
                  >
                    {selectedPairing.preview}
                  </div>
                  <div
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: selectedPairing.bodyFont }}
                  >
                    This is body text that demonstrates how the fonts work
                    together. The combination provides good contrast and
                    readability while maintaining visual harmony.
                  </div>
                </div>
              </div>

              {/* Font Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Heading Font</h4>
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">
                      {selectedPairing.headingFont}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Serif category
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Body Font</h4>
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">
                      {selectedPairing.bodyFont}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Sans-serif category
                    </div>
                  </div>
                </div>
              </div>

              {/* Implementation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Implementation</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Google Fonts Link:
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          getGoogleFontsLink(selectedPairing)
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                  <code className="bg-muted block w-full rounded p-2 text-xs break-all">
                    {getGoogleFontsLink(selectedPairing)}
                  </code>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => copyCSS(selectedPairing, "css")}>
                    <Copy className="h-4 w-4" />
                    Copy CSS
                  </Button>
                  <Button
                    onClick={() => copyCSS(selectedPairing, "tailwind")}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Tailwind CSS
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

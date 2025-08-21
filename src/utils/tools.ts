import * as React from "react"

import { Base64Tool } from "@/components/tools/base64"
import { CodeBeautifier } from "@/components/tools/code-beautifier"
import { ColorConverter } from "@/components/tools/color-converter"
import { CronCalculator } from "@/components/tools/cron-calculator"
import { CSSAnimationGenerator } from "@/components/tools/css-animation-generator"
import { CSSBoxShadowGenerator } from "@/components/tools/css-box-shadow-generator"
import { CSSLayoutGenerator } from "@/components/tools/css-layout-generator"
import { CsvJsonConverter } from "@/components/tools/csv-json-converter"
import { FontPairingSuggestions } from "@/components/tools/font-pairing-suggestions"
import { GitCommandGenerator } from "@/components/tools/git-command-generator"
import { HashGenerator } from "@/components/tools/hash-generator"
import { HTTPStatusLookup } from "@/components/tools/http-status-lookup"
import { ImageConverter } from "@/components/tools/image-converter"
import { JsonFormatter } from "@/components/tools/json-formatter"
import { JsonToTypescript } from "@/components/tools/json-to-typescript"
import { JwtDecoder } from "@/components/tools/jwt-decoder"
import { LoremGenerator } from "@/components/tools/lorem-generator"
import { MarkdownTool } from "@/components/tools/markdown"
import { MetaTagGenerator } from "@/components/tools/meta-tag-generator"
import { NumberBaseConverter } from "@/components/tools/number-base-converter"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { Playground } from "@/components/tools/playground"
import { QRGenerator } from "@/components/tools/qr-generator"
import { RegexTesterAdvanced } from "@/components/tools/regex-tester"
import { ResponsiveTestingTool } from "@/components/tools/responsive-testing"
import { SEOChecker } from "@/components/tools/seo-checker"
import { SqlFormatterTool } from "@/components/tools/sql-formatter"
import { TextUtilities } from "@/components/tools/text-utilities"
import { TimestampConverter } from "@/components/tools/timestamp-converter"
import { URLEncoder } from "@/components/tools/url-encoder"
import { UUIDGenerator } from "@/components/tools/uuid-generator"

export interface Tool {
  id: string
  title: string
  description: string
  icon: string
  category: string
  path: string
  featured: boolean
  component: React.ComponentType
}

export const TOOL_CATEGORIES = [
  "Text & Content",
  "Encoding & Conversion",
  "Generators & Utilities",
  "Development Tools",
  "Formatting",
  "Design",
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

export const TOOLS: Tool[] = [
  {
    id: "regex-tester",
    title: "Regex Tester",
    description:
      "Test and validate regular expressions with real-time feedback. Supports advanced features like regex groups, flags, and more.",
    icon: "🔍",
    category: "Development Tools",
    path: "/tools/regex-tester",
    featured: true,
    component: RegexTesterAdvanced,
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, validate, and convert JSON/XML with advanced validation and syntax highlighting. Supports file upload and multiple output formats.",
    icon: "📄",
    category: "Formatting",
    path: "/tools/json-formatter",
    featured: true,
    component: JsonFormatter,
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description:
      "Encode and decode Base64 strings and files. Supports URL-safe encoding.",
    icon: "🔐",
    category: "Encoding & Conversion",
    path: "/tools/base64",
    featured: true,
    component: Base64Tool,
  },
  {
    id: "url-encoder",
    title: "URL Encoder/Decoder",
    description:
      "URL encode/decode and parse query parameters. Supports file upload.",
    icon: "🌐",
    category: "Encoding & Conversion",
    path: "/tools/url-encoder",
    featured: false,
    component: URLEncoder,
  },
  {
    id: "number-base-converter",
    title: "Number Base Converter",
    description:
      "Convert numbers between binary, octal, decimal, and hex. Supports large numbers and custom bases.",
    icon: "🔢",
    category: "Encoding & Conversion",
    path: "/tools/number-base-converter",
    featured: false,
    component: NumberBaseConverter,
  },
  {
    id: "csv-json-converter",
    title: "CSV ↔ JSON Converter",
    description:
      "Convert between CSV and JSON with header support. Handles validation and formatting.",
    icon: "🧮",
    category: "Encoding & Conversion",
    path: "/tools/csv-json-converter",
    featured: false,
    component: CsvJsonConverter,
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description:
      "Generate secure passwords with customizable options. Supports length, character types, and more.",
    icon: "🔑",
    category: "Generators & Utilities",
    path: "/tools/password-generator",
    featured: true,
    component: PasswordGenerator,
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256 hashes for text and files. Supports HMAC.",
    icon: "🔐",
    category: "Generators & Utilities",
    path: "/tools/hash-generator",
    featured: false,
    component: HashGenerator,
  },
  {
    id: "color-converter",
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, HSL formats with palette generator",
    icon: "🎨",
    category: "Design",
    path: "/tools/color-converter",
    featured: true,
    component: ColorConverter,
  },
  {
    id: "text-utilities",
    title: "Text Utilities",
    description:
      "Word count, case conversion, text comparison and more. Supports file upload.",
    icon: "📝",
    category: "Text & Content",
    path: "/tools/text-utilities",
    featured: false,
    component: TextUtilities,
  },
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description:
      "Generate UUIDs in various formats (v1, v4, v5). Supports custom namespaces.",
    icon: "🆔",
    category: "Generators & Utilities",
    path: "/tools/uuid-generator",
    featured: false,
    component: UUIDGenerator,
  },
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description:
      "Convert between Unix timestamps, ISO dates & human-readable formats",
    icon: "⏰",
    category: "Generators & Utilities",
    path: "/tools/timestamp-converter",
    featured: true,
    component: TimestampConverter,
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description:
      "Generate QR codes for text, URLs, WiFi & contacts. Supports customization.",
    icon: "📱",
    category: "Generators & Utilities",
    path: "/tools/qr-generator",
    featured: true,
    component: QRGenerator,
  },
  {
    id: "seo-checker",
    title: "SEO Checker",
    description:
      "Analyze your website's on-page SEO factors and get detailed recommendations for improvement.",
    icon: "🔍",
    category: "Development Tools",
    path: "/tools/seo-checker",
    featured: true,
    component: SEOChecker,
  },
  {
    id: "lorem-generator",
    title: "Lorem Generator",
    description:
      "Generate placeholder text for designs and layouts. Supports customization of length and format.",
    icon: "✍️",
    category: "Generators & Utilities",
    path: "/tools/lorem-generator",
    featured: false,
    component: LoremGenerator,
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens locally. Supports validation and signature verification.",
    icon: "🔓",
    category: "Development Tools",
    path: "/tools/jwt-decoder",
    featured: false,
    component: JwtDecoder,
  },
  {
    id: "json-to-typescript",
    title: "JSON to TypeScript",
    description:
      "Convert JSON objects to TypeScript interfaces. Supports nested structures.",
    icon: "🧩",
    category: "Development Tools",
    path: "/tools/json-to-typescript",
    featured: false,
    component: JsonToTypescript,
  },
  {
    id: "code-beautifier",
    title: "Code Beautifier & Minifier",
    description:
      "Beautify or minify JavaScript, CSS, and HTML code with customizable options",
    icon: "✨",
    category: "Formatting",
    path: "/tools/code-beautifier",
    featured: true,
    component: CodeBeautifier,
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description:
      "Format and beautify SQL queries. Supports syntax highlighting and minification.",
    icon: "🗄️",
    category: "Formatting",
    path: "/tools/sql-formatter",
    featured: false,
    component: SqlFormatterTool,
  },
  {
    id: "cron-calculator",
    title: "Cron Calculator",
    description:
      "Build and validate cron expressions. Supports visualization and scheduling",
    icon: "⏱️",
    category: "Development Tools",
    path: "/tools/cron-calculator",
    featured: false,
    component: CronCalculator,
  },
  {
    id: "markdown",
    title: "Markdown",
    description:
      "Write and preview Markdown. Supports syntax highlighting and export.",
    icon: "📝",
    category: "Text & Content",
    path: "/tools/markdown",
    featured: false,
    component: MarkdownTool,
  },
  {
    id: "playground",
    title: "Playground",
    description:
      "Experiment with JavaScript/TypeScript snippets. Supports live preview.",
    icon: "🎮",
    category: "Development Tools",
    path: "/tools/playground",
    featured: false,
    component: Playground,
  },
  {
    id: "responsive-testing",
    title: "Responsive Testing Tool",
    description:
      "Preview websites at different screen sizes and test responsive design across various devices",
    icon: "📱",
    category: "Development Tools",
    path: "/tools/responsive-testing",
    featured: true,
    component: ResponsiveTestingTool,
  },
  {
    id: "image-converter",
    title: "Image Format Converter",
    description:
      "Convert images between PNG, JPG, WebP, SVG formats with compression and basic editing",
    icon: "🖼️",
    category: "Design",
    path: "/tools/image-converter",
    featured: false,
    component: ImageConverter,
  },
  {
    id: "css-layout-generator",
    title: "CSS Layout Generator",
    description:
      "Visual CSS Grid and Flexbox builder with live preview and code generation",
    icon: "🎨",
    category: "Design",
    path: "/tools/css-layout-generator",
    featured: false,
    component: CSSLayoutGenerator,
  },
  {
    id: "http-status-lookup",
    title: "HTTP Status Lookup",
    description:
      "Searchable database of HTTP status codes with common use cases and troubleshooting tips",
    icon: "🌐",
    category: "Development Tools",
    path: "/tools/http-status-lookup",
    featured: false,
    component: HTTPStatusLookup,
  },
  {
    id: "git-command-generator",
    title: "Git Command Generator",
    description:
      "Interactive Git command builder with common workflows and explanations",
    icon: "📚",
    category: "Development Tools",
    path: "/tools/git-command-generator",
    featured: false,
    component: GitCommandGenerator,
  },
  {
    id: "css-animation-generator",
    title: "CSS Animation Generator",
    description:
      "Create smooth CSS animations with keyframes and transitions. Visual timeline editor.",
    icon: "🎬",
    category: "Design",
    path: "/tools/css-animation-generator",
    featured: false,
    component: CSSAnimationGenerator,
  },
  {
    id: "font-pairing-suggestions",
    title: "Font Pairing Suggestions",
    description:
      "Discover beautiful typography combinations with Google Fonts integration",
    icon: "🔤",
    category: "Design",
    path: "/tools/font-pairing-suggestions",
    featured: false,
    component: FontPairingSuggestions,
  },
  {
    id: "css-box-shadow-generator",
    title: "CSS Box Shadow Generator",
    description:
      "Create beautiful box shadows with visual builder and multiple layers",
    icon: "🌗",
    category: "Design",
    path: "/tools/css-box-shadow-generator",
    featured: false,
    component: CSSBoxShadowGenerator,
  },
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    description:
      "Generate SEO meta tags, Open Graph, and Twitter Card tags for your website",
    icon: "🏷️",
    category: "Development Tools",
    path: "/tools/meta-tag-generator",
    featured: false,
    component: MetaTagGenerator,
  },
]

export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find((tool) => tool.id === id)
}

export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return TOOLS.filter((tool) => tool.category === category).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}

export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter((tool) => tool.featured).sort((a, b) =>
    a.title.localeCompare(b.title)
  )
}

export const getToolsGroupedByCategory = (): Record<string, Tool[]> => {
  const grouped = TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, Tool[]>
  )

  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => a.title.localeCompare(b.title))
  })

  return grouped
}

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase()
  return TOOLS.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery) ||
      tool.category.toLowerCase().includes(lowercaseQuery)
  )
}

export const getToolComponent = (
  toolId: string
): React.ComponentType | null => {
  const tool = getToolById(toolId)
  return tool?.component || null
}

export const getToolStats = () => ({
  totalTools: TOOLS.length,
  totalCategories: TOOL_CATEGORIES.length,
  featuredTools: getFeaturedTools().length,
})

import React from "react"

// Import all tool components
import { Base64Tool } from "@/components/shared/base64"
import { ColorConverter } from "@/components/shared/color-converter"
import { HashGenerator } from "@/components/shared/hash-generator"
import { JSONFormatter } from "@/components/shared/json-formatter"
import { PasswordGenerator } from "@/components/shared/password-generator"
import { QRGenerator } from "@/components/shared/qr-generator"
import { RegexTesterAdvanced } from "@/components/shared/regex-tester"
import { TextUtilities } from "@/components/shared/text-utilities"
import { TimestampConverter } from "@/components/shared/timestamp-converter"
import { URLEncoder } from "@/components/shared/url-encoder"
import { UUIDGenerator } from "@/components/shared/uuid-generator"

// Tool interface
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

// Categories
export const TOOL_CATEGORIES = [
  "Text Processing",
  "Data Processing",
  "Encoding",
  "Security",
  "Design",
  "Generators",
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]

// Centralized tools array with all information
export const TOOLS: Tool[] = [
  {
    id: "regex-tester",
    title: "Regex Tester",
    description:
      "Test and validate regular expressions with real-time feedback",
    icon: "🔍",
    category: "Text Processing",
    path: "/tools/regex-tester",
    featured: true,
    component: RegexTesterAdvanced,
  },
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description:
      "Format, validate, and minify JSON data with syntax highlighting",
    icon: "📄",
    category: "Data Processing",
    path: "/tools/json-formatter",
    featured: true,
    component: JSONFormatter,
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings and files",
    icon: "🔐",
    category: "Encoding",
    path: "/tools/base64",
    featured: true,
    component: Base64Tool,
  },
  {
    id: "url-encoder",
    title: "URL Encoder/Decoder",
    description: "URL encode/decode and parse query parameters",
    icon: "🌐",
    category: "Encoding",
    path: "/tools/url-encoder",
    featured: false,
    component: URLEncoder,
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure passwords with customizable options",
    icon: "🔑",
    category: "Security",
    path: "/tools/password-generator",
    featured: true,
    component: PasswordGenerator,
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes for text and files",
    icon: "🔐",
    category: "Security",
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
    description: "Word count, case conversion, text comparison and more",
    icon: "📝",
    category: "Text Processing",
    path: "/tools/text-utilities",
    featured: false,
    component: TextUtilities,
  },
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUIDs in various formats (v1, v4, v5)",
    icon: "🆔",
    category: "Generators",
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
    category: "Data Processing",
    path: "/tools/timestamp-converter",
    featured: true,
    component: TimestampConverter,
  },
  {
    id: "qr-generator",
    title: "QR Code Generator",
    description: "Generate QR codes for text, URLs, WiFi & contacts",
    icon: "📱",
    category: "Generators",
    path: "/tools/qr-generator",
    featured: true,
    component: QRGenerator,
  },
]

// Utility functions
export const getToolById = (id: string): Tool | undefined => {
  return TOOLS.find((tool) => tool.id === id)
}

export const getToolsByCategory = (category: ToolCategory): Tool[] => {
  return TOOLS.filter((tool) => tool.category === category)
}

export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter((tool) => tool.featured)
}

export const getToolsGroupedByCategory = (): Record<string, Tool[]> => {
  return TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, Tool[]>
  )
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

// Tool component mapping for dynamic rendering
export const getToolComponent = (
  toolId: string
): React.ComponentType | null => {
  const tool = getToolById(toolId)
  return tool?.component || null
}

// Statistics
export const getToolStats = () => ({
  totalTools: TOOLS.length,
  totalCategories: TOOL_CATEGORIES.length,
  featuredTools: getFeaturedTools().length,
})

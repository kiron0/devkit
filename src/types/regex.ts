/**
 * Regex testing types and interfaces
 */

export interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

export interface RegexMatch {
  match: string
  index: number
  groups: string[]
  namedGroups: Record<string, string>
}

export interface RegexTestResult {
  isValid: boolean
  matches: RegexMatch[]
  highlightedText: string
  error?: string
  stats: {
    matchCount: number
    uniqueMatches: number
    totalLength: number
    executionTime: number
  }
}

export interface RegexPattern {
  pattern: string
  flags: RegexFlags
  description?: string
  category?: string
}

export interface RegexExplanation {
  token: string
  explanation: string
  position: [number, number]
  type:
    | "literal"
    | "metacharacter"
    | "quantifier"
    | "group"
    | "class"
    | "anchor"
    | "assertion"
}

export interface RegexExample {
  name: string
  pattern: string
  testString: string
  flags: Partial<RegexFlags>
  description: string
  category: "email" | "phone" | "url" | "date" | "password" | "ip" | "custom"
}

export interface RegexPerformanceMetrics {
  compilationTime: number
  executionTime: number
  memoryUsage?: number
  complexityScore: number
}

export interface RegexAnalysis {
  explanation: RegexExplanation[]
  performance: RegexPerformanceMetrics
  warnings: string[]
  suggestions: string[]
}

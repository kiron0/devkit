import type {
  RegexAnalysis,
  RegexExample,
  RegexExplanation,
  RegexPerformanceMetrics,
} from "@/types"

/**
 * Advanced regex explanation patterns with enhanced metadata
 */
export const REGEX_EXPLANATIONS: Record<
  string,
  { explanation: string; type: RegexExplanation["type"] }
> = {
  // Basic patterns
  ".": {
    explanation: "matches any single character except newline",
    type: "metacharacter",
  },
  "\\d": { explanation: "matches any digit (0-9)", type: "metacharacter" },
  "\\D": {
    explanation: "matches any non-digit character",
    type: "metacharacter",
  },
  "\\w": {
    explanation: "matches any word character (letters, digits, underscore)",
    type: "metacharacter",
  },
  "\\W": {
    explanation: "matches any non-word character",
    type: "metacharacter",
  },
  "\\s": {
    explanation: "matches any whitespace character (space, tab, newline)",
    type: "metacharacter",
  },
  "\\S": {
    explanation: "matches any non-whitespace character",
    type: "metacharacter",
  },
  "\\n": { explanation: "matches newline character", type: "metacharacter" },
  "\\t": { explanation: "matches tab character", type: "metacharacter" },
  "\\r": { explanation: "matches carriage return", type: "metacharacter" },

  // Quantifiers
  "*": {
    explanation: "matches 0 or more of the preceding element (greedy)",
    type: "quantifier",
  },
  "+": {
    explanation: "matches 1 or more of the preceding element (greedy)",
    type: "quantifier",
  },
  "?": {
    explanation: "matches 0 or 1 of the preceding element (greedy)",
    type: "quantifier",
  },
  "*?": {
    explanation: "matches 0 or more of the preceding element (non-greedy)",
    type: "quantifier",
  },
  "+?": {
    explanation: "matches 1 or more of the preceding element (non-greedy)",
    type: "quantifier",
  },
  "??": {
    explanation: "matches 0 or 1 of the preceding element (non-greedy)",
    type: "quantifier",
  },

  // Anchors
  "^": { explanation: "matches the start of string/line", type: "anchor" },
  $: { explanation: "matches the end of string/line", type: "anchor" },
  "\\b": { explanation: "matches word boundary", type: "anchor" },
  "\\B": { explanation: "matches non-word boundary", type: "anchor" },

  // Character classes
  "[": {
    explanation: "starts character class - matches any character inside",
    type: "class",
  },
  "]": { explanation: "ends character class", type: "class" },
  "[^": {
    explanation: "negated character class - matches any character NOT inside",
    type: "class",
  },

  // Groups
  "(": { explanation: "starts capturing group", type: "group" },
  ")": { explanation: "ends capturing group", type: "group" },
  "(?:": { explanation: "starts non-capturing group", type: "group" },
  "(?=": { explanation: "positive lookahead assertion", type: "assertion" },
  "(?!": { explanation: "negative lookahead assertion", type: "assertion" },
  "(?<=": { explanation: "positive lookbehind assertion", type: "assertion" },
  "(?<!": { explanation: "negative lookbehind assertion", type: "assertion" },

  // Alternation
  "|": {
    explanation: "alternation - matches either left or right side",
    type: "metacharacter",
  },

  // Escaping
  "\\\\": { explanation: "matches literal backslash", type: "literal" },
  "\\.": { explanation: "matches literal dot", type: "literal" },
  "\\*": { explanation: "matches literal asterisk", type: "literal" },
  "\\+": { explanation: "matches literal plus", type: "literal" },
  "\\?": { explanation: "matches literal question mark", type: "literal" },
  "\\(": {
    explanation: "matches literal opening parenthesis",
    type: "literal",
  },
  "\\)": {
    explanation: "matches literal closing parenthesis",
    type: "literal",
  },
  "\\[": { explanation: "matches literal opening bracket", type: "literal" },
  "\\]": { explanation: "matches literal closing bracket", type: "literal" },
  "\\{": { explanation: "matches literal opening brace", type: "literal" },
  "\\}": { explanation: "matches literal closing brace", type: "literal" },
  "\\^": { explanation: "matches literal caret", type: "literal" },
  "\\$": { explanation: "matches literal dollar sign", type: "literal" },
  "\\|": { explanation: "matches literal pipe", type: "literal" },
}

/**
 * Predefined regex examples with enhanced metadata
 */
export const REGEX_EXAMPLES: RegexExample[] = [
  {
    name: "Email Address",
    pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
    testString:
      "Contact us at support@example.com or sales@company.org for help. Invalid: user@.com, @invalid.com",
    flags: { global: true, ignoreCase: true },
    description: "Matches valid email addresses with proper domain structure",
    category: "email",
  },
  {
    name: "Phone Number (US)",
    pattern: "\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})",
    testString:
      "Call us at (555) 123-4567 or 555.987.6543 or 5551234567 for support.",
    flags: { global: true },
    description:
      "Matches US phone numbers in various formats with capturing groups",
    category: "phone",
  },
  {
    name: "URL",
    pattern:
      "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    testString:
      "Visit https://www.example.com or http://test.org for more info. Also check https://subdomain.site.co.uk/path?query=value",
    flags: { global: true, ignoreCase: true },
    description:
      "Matches HTTP and HTTPS URLs with optional www and complex paths",
    category: "url",
  },
  {
    name: "Date (MM/DD/YYYY)",
    pattern: "(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}",
    testString:
      "Important dates: 12/25/2023, 01/01/2024, and 07/04/2024. Invalid: 13/25/2023, 02/30/2024",
    flags: { global: true },
    description:
      "Matches dates in MM/DD/YYYY format with validation for months and days",
    category: "date",
  },
  {
    name: "Strong Password",
    pattern:
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    testString: "Password123!\nMySecure123@\nweakpass\nPass1!",
    flags: { global: true, multiline: true },
    description:
      "Validates strong passwords: 8+ chars, uppercase, lowercase, digit, special char",
    category: "password",
  },
  {
    name: "IPv4 Address",
    pattern:
      "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    testString:
      "Valid IPs: 192.168.1.1, 10.0.0.1, 255.255.255.255. Invalid: 256.1.1.1, 192.168.1.300",
    flags: { global: true },
    description:
      "Matches valid IPv4 addresses with proper range validation (0-255)",
    category: "ip",
  },
  {
    name: "HTML Tags",
    pattern: "<\\/?[a-zA-Z][a-zA-Z0-9]*\\b[^>]*>",
    testString:
      '<div class="container"><p>Hello <strong>world</strong>!</p></div><br><img src="test.jpg" alt="test"/>',
    flags: { global: true },
    description: "Matches HTML opening and closing tags with attributes",
    category: "custom",
  },
  {
    name: "Credit Card (Basic)",
    pattern: "\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b",
    testString:
      "Cards: 1234 5678 9012 3456, 1234-5678-9012-3456, 1234567890123456",
    flags: { global: true },
    description:
      "Matches credit card numbers in various formats (spaces, dashes, or none)",
    category: "custom",
  },
]

/**
 * Enhanced regex tokenizer with position tracking
 */
export function tokenizeRegex(
  pattern: string
): Array<{ token: string; position: [number, number] }> {
  const tokens: Array<{ token: string; position: [number, number] }> = []
  let i = 0

  while (i < pattern.length) {
    const startPos = i
    let token = ""
    const char = pattern[i]

    // Handle escaped characters
    if (char === "\\" && i + 1 < pattern.length) {
      token = char + pattern[i + 1]
      i += 2
    }
    // Handle quantifiers with braces
    else if (char === "{") {
      let j = i
      while (j < pattern.length && pattern[j] !== "}") j++
      if (j < pattern.length) {
        token = pattern.slice(i, j + 1)
        i = j + 1
      } else {
        token = char
        i++
      }
    }
    // Handle character classes
    else if (char === "[") {
      let j = i + 1
      if (j < pattern.length && pattern[j] === "^") {
        j++
      }
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++ // Skip escaped characters
        j++
      }
      if (j < pattern.length) {
        token = pattern.slice(i, j + 1)
        i = j + 1
      } else {
        token = char
        i++
      }
    }
    // Handle groups and assertions
    else if (char === "(" && i + 1 < pattern.length) {
      if (pattern[i + 1] === "?") {
        if (i + 2 < pattern.length) {
          const nextChar = pattern[i + 2]
          if (
            nextChar === ":" ||
            nextChar === "=" ||
            nextChar === "!" ||
            nextChar === "<"
          ) {
            if (
              nextChar === "<" &&
              i + 3 < pattern.length &&
              (pattern[i + 3] === "=" || pattern[i + 3] === "!")
            ) {
              token = pattern.slice(i, i + 4)
              i += 4
            } else {
              token = pattern.slice(i, i + 3)
              i += 3
            }
          } else {
            token = char
            i++
          }
        } else {
          token = char
          i++
        }
      } else {
        token = char
        i++
      }
    }
    // Handle non-greedy quantifiers
    else if (
      (char === "*" || char === "+" || char === "?") &&
      i + 1 < pattern.length &&
      pattern[i + 1] === "?"
    ) {
      token = char + "?"
      i += 2
    }
    // Single character tokens
    else {
      token = char
      i++
    }

    if (token) {
      tokens.push({
        token,
        position: [startPos, i - 1],
      })
    }
  }

  return tokens
}

/**
 * Generate comprehensive regex explanation
 */
export function explainRegex(pattern: string): RegexExplanation[] {
  if (!pattern.trim()) return []

  const tokens = tokenizeRegex(pattern)
  const explanations: RegexExplanation[] = []

  tokens.forEach(({ token, position }) => {
    const explanation = getTokenExplanation(token)
    if (explanation) {
      explanations.push({
        token,
        explanation: explanation.explanation,
        position,
        type: explanation.type,
      })
    }
  })

  return explanations
}

/**
 * Get explanation for a specific token
 */
function getTokenExplanation(
  token: string
): { explanation: string; type: RegexExplanation["type"] } | null {
  // Check for exact matches first
  if (REGEX_EXPLANATIONS[token]) {
    return REGEX_EXPLANATIONS[token]
  }

  // Check for quantifiers with specific numbers
  const quantifierMatch = token.match(/^{(\d+)(,(\d+)?)?}$/)
  if (quantifierMatch) {
    const min = quantifierMatch[1]
    const max = quantifierMatch[3]
    if (max) {
      return {
        explanation: `matches between ${min} and ${max} occurrences`,
        type: "quantifier",
      }
    } else if (quantifierMatch[2]) {
      return {
        explanation: `matches ${min} or more occurrences`,
        type: "quantifier",
      }
    } else {
      return {
        explanation: `matches exactly ${min} occurrences`,
        type: "quantifier",
      }
    }
  }

  // Check for character classes
  if (token.startsWith("[") && token.endsWith("]")) {
    const content = token.slice(1, -1)
    if (content.startsWith("^")) {
      return {
        explanation: `negated character class - matches any character NOT in: ${content.slice(1)}`,
        type: "class",
      }
    } else {
      return {
        explanation: `character class - matches any single character in: ${content}`,
        type: "class",
      }
    }
  }

  // Check for literal characters
  if (token.length === 1 && !/[.*+?^${}()|[\]\\]/.test(token)) {
    return {
      explanation: `matches literal character '${token}'`,
      type: "literal",
    }
  }

  return null
}

/**
 * Analyze regex performance and complexity
 */
export function analyzeRegexPerformance(
  pattern: string
): RegexPerformanceMetrics {
  const startTime = performance.now()

  try {
    // Compile regex to measure compilation time
    new RegExp(pattern)
    const compilationTime = performance.now() - startTime

    // Calculate complexity score based on various factors
    let complexityScore = 0

    // Base complexity
    complexityScore += pattern.length * 0.1

    // Quantifiers increase complexity
    const quantifiers = pattern.match(/[*+?{]/g)
    if (quantifiers) complexityScore += quantifiers.length * 2

    // Lookarounds are expensive
    const lookarounds = pattern.match(/\(\?\<?[=!]/g)
    if (lookarounds) complexityScore += lookarounds.length * 5

    // Character classes
    const charClasses = pattern.match(/\[[^\]]*\]/g)
    if (charClasses) complexityScore += charClasses.length * 1.5

    // Backtracking potential
    const backtrackingPatterns = pattern.match(/\*.*\*|\+.*\+/g)
    if (backtrackingPatterns) complexityScore += backtrackingPatterns.length * 3

    return {
      compilationTime,
      executionTime: 0, // Will be updated during actual execution
      complexityScore: Math.round(complexityScore * 10) / 10,
    }
  } catch {
    return {
      compilationTime: performance.now() - startTime,
      executionTime: 0,
      complexityScore: 0,
    }
  }
}

/**
 * Generate warnings and suggestions for regex patterns
 */
export function analyzeRegexIssues(pattern: string): {
  warnings: string[]
  suggestions: string[]
} {
  const warnings: string[] = []
  const suggestions: string[] = []

  // Check for catastrophic backtracking patterns
  if (/\*.*\*|\+.*\+/.test(pattern)) {
    warnings.push("Potential catastrophic backtracking detected")
    suggestions.push(
      "Consider using non-greedy quantifiers (*?, +?) or atomic groups"
    )
  }

  // Check for unescaped special characters
  const unescapedSpecial = pattern.match(/(?<!\\)[.+*?^${}()|[\]]/g)
  if (
    (unescapedSpecial &&
      unescapedSpecial.length >
        (pattern.match(/\\[.+*?^${}()|[\]]/g)?.length ?? 0)) ??
    0
  ) {
    suggestions.push(
      "Consider if special characters need to be escaped for literal matching"
    )
  }

  // Check for inefficient character classes
  if (pattern.includes("[0-9]")) {
    suggestions.push("Use \\d instead of [0-9] for better performance")
  }
  if (pattern.includes("[a-zA-Z0-9_]")) {
    suggestions.push("Use \\w instead of [a-zA-Z0-9_] for better readability")
  }

  // Check for unnecessary capturing groups
  const capturingGroups = (pattern.match(/\(/g) || []).length
  const nonCapturingGroups = (pattern.match(/\(\?:/g) || []).length
  if (capturingGroups > nonCapturingGroups && capturingGroups > 2) {
    suggestions.push(
      "Consider using non-capturing groups (?:) if you don't need to extract the matched content"
    )
  }

  // Check for overly broad patterns
  if (pattern.includes(".*") || pattern.includes(".+")) {
    warnings.push("Very broad pattern detected - may match more than intended")
    suggestions.push("Consider making your pattern more specific")
  }

  return { warnings, suggestions }
}

/**
 * Complete regex analysis
 */
export function analyzeRegex(pattern: string): RegexAnalysis {
  const explanation = explainRegex(pattern)
  const performance = analyzeRegexPerformance(pattern)
  const { warnings, suggestions } = analyzeRegexIssues(pattern)

  return {
    explanation,
    performance,
    warnings,
    suggestions,
  }
}

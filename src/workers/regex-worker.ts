/**
 * Web Worker for intensive regex operations
 * Prevents blocking the main thread during complex pattern matching
 */

interface RegexWorkerMessage {
  id: string
  type: "test" | "analyze"
  pattern: string
  text: string
  flags: string
}

interface RegexWorkerResponse {
  id: string
  success: boolean
  result?: {
    matches: Array<{
      match: string
      index: number
      groups: string[]
    }>
    executionTime: number
    isValid: boolean
  }
  error?: string
}

// Handle messages from main thread
self.onmessage = function (e: MessageEvent<RegexWorkerMessage>) {
  const { id, type, pattern, text, flags } = e.data

  try {
    const startTime = performance.now()

    if (type === "test") {
      const regex = new RegExp(pattern, flags)
      const matches: Array<{ match: string; index: number; groups: string[] }> =
        []

      if (flags.includes("g")) {
        // Global matching
        const globalMatches = [...text.matchAll(regex)]
        globalMatches.forEach((match) => {
          if (match.index !== undefined) {
            matches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
            })
          }
        })
      } else {
        // Single match
        const match = text.match(regex)
        if (match && match.index !== undefined) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      const executionTime = performance.now() - startTime

      const response: RegexWorkerResponse = {
        id,
        success: true,
        result: {
          matches,
          executionTime,
          isValid: true,
        },
      }

      self.postMessage(response)
    }
  } catch (error) {
    const response: RegexWorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }

    self.postMessage(response)
  }
}

export {}

import { useCallback, useEffect, useRef, useState } from "react"

import type { RegexFlags, RegexMatch, RegexTestResult } from "@/types/regex"

import { useDebounce } from "./use-debounce"

/**
 * Advanced regex testing hook with performance monitoring
 */
export function useRegex(debounceDelay = 300) {
  const [pattern, setPattern] = useState("")
  const [testString, setTestString] = useState("")
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  })

  const [result, setResult] = useState<RegexTestResult>({
    isValid: false,
    matches: [],
    highlightedText: "",
    stats: {
      matchCount: 0,
      uniqueMatches: 0,
      totalLength: 0,
      executionTime: 0,
    },
  })

  const [isProcessing, setIsProcessing] = useState(false)

  // Use refs to store current values for stable access
  const patternRef = useRef(pattern)
  const testStringRef = useRef(testString)
  const flagsRef = useRef(flags)

  // Update refs when state changes
  patternRef.current = pattern
  testStringRef.current = testString
  flagsRef.current = flags

  // Helper function to create flag string from flags object
  const createFlagString = useCallback((flagsObject: RegexFlags) => {
    return Object.entries(flagsObject)
      .filter(([, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "global":
            return "g"
          case "ignoreCase":
            return "i"
          case "multiline":
            return "m"
          case "dotAll":
            return "s"
          case "unicode":
            return "u"
          case "sticky":
            return "y"
          default:
            return ""
        }
      })
      .join("")
  }, [])

  // Core regex testing function
  const testRegex = useCallback(
    (regexPattern: string, text: string, flagStr: string): RegexTestResult => {
      const startTime = performance.now()

      if (!regexPattern.trim()) {
        return {
          isValid: false,
          matches: [],
          highlightedText: text,
          stats: {
            matchCount: 0,
            uniqueMatches: 0,
            totalLength: 0,
            executionTime: 0,
          },
        }
      }

      try {
        const regex = new RegExp(regexPattern, flagStr)
        const matches: RegexMatch[] = []
        let highlightedText = text
        let matchArray: RegExpMatchArray | null

        if (flagStr.includes("g")) {
          // Global matching
          const globalMatches = [...text.matchAll(regex)]
          globalMatches.forEach((match) => {
            if (match.index !== undefined) {
              matches.push({
                match: match[0],
                index: match.index,
                groups: match.slice(1),
                namedGroups: match.groups || {},
              })
            }
          })

          // Highlight matches
          globalMatches.reverse().forEach((match) => {
            if (match.index !== undefined) {
              const start = match.index
              const end = start + match[0].length
              highlightedText =
                highlightedText.slice(0, start) +
                `<mark class="bg-primary/20 text-primary font-semibold rounded px-1">${match[0]}</mark>` +
                highlightedText.slice(end)
            }
          })
        } else {
          // Single match
          matchArray = text.match(regex)
          if (matchArray && matchArray.index !== undefined) {
            matches.push({
              match: matchArray[0],
              index: matchArray.index,
              groups: matchArray.slice(1),
              namedGroups: matchArray.groups || {},
            })

            const start = matchArray.index
            const end = start + matchArray[0].length
            highlightedText =
              text.slice(0, start) +
              `<mark class="bg-primary/20 text-primary font-semibold rounded px-1">${matchArray[0]}</mark>` +
              text.slice(end)
          }
        }

        const executionTime = performance.now() - startTime
        const uniqueMatches = new Set(matches.map((m) => m.match)).size
        const totalLength = matches.reduce(
          (sum, match) => sum + match.match.length,
          0
        )

        return {
          isValid: true,
          matches,
          highlightedText,
          stats: {
            matchCount: matches.length,
            uniqueMatches,
            totalLength,
            executionTime,
          },
        }
      } catch (error) {
        const executionTime = performance.now() - startTime
        return {
          isValid: false,
          matches: [],
          highlightedText: text,
          error: error instanceof Error ? error.message : "Unknown error",
          stats: {
            matchCount: 0,
            uniqueMatches: 0,
            totalLength: 0,
            executionTime,
          },
        }
      }
    },
    []
  )

  // Debounced test function - using refs for stability
  const [debouncedTest] = useDebounce(
    useCallback(() => {
      setIsProcessing(true)

      try {
        // Use current state values instead of refs to ensure we have the latest data
        const currentFlagString = createFlagString(flags)
        const newResult = testRegex(pattern, testString, currentFlagString)
        setResult(newResult)
      } catch (error) {
        console.error("Error in debouncedTest:", error)
      } finally {
        setIsProcessing(false)
      }
    }, [testRegex, createFlagString, pattern, testString, flags]), // Include state dependencies
    debounceDelay
  )

  // Update flag
  const updateFlag = useCallback((flag: keyof RegexFlags, value: boolean) => {
    setFlags((prev) => ({ ...prev, [flag]: value }))
  }, [])

  // Update pattern
  const updatePattern = useCallback((newPattern: string) => {
    setPattern(newPattern)
  }, [])

  // Update test string
  const updateTestString = useCallback((newTestString: string) => {
    setTestString(newTestString)
  }, [])

  // Trigger test when pattern, testString, or flags change
  useEffect(() => {
    // Only run if we have meaningful data (not just empty strings)
    if (pattern.trim() && testString.trim()) {
      debouncedTest()
    }
  }, [pattern, testString, flags, debouncedTest])

  // Immediate test (for flag changes) - using refs for stable access
  const immediateTest = useCallback(() => {
    setIsProcessing(true)

    try {
      const currentFlagString = createFlagString(flagsRef.current)
      const newResult = testRegex(
        patternRef.current,
        testStringRef.current,
        currentFlagString
      )
      setResult(newResult)
    } catch (error) {
      console.error("Error in immediateTest:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [testRegex, createFlagString]) // Depend on stable functions

  const onClear = useCallback(() => {
    setPattern("")
    setTestString("")
    setFlags({
      global: false,
      ignoreCase: false,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false,
    })
    setResult({
      isValid: false,
      matches: [],
      highlightedText: "",
      stats: {
        matchCount: 0,
        uniqueMatches: 0,
        totalLength: 0,
        executionTime: 0,
      },
    })
    setIsProcessing(false)
  }, [])

  return {
    pattern,
    testString,
    flags,
    result,
    onClear,
    isProcessing,
    updatePattern,
    updateTestString,
    updateFlag,
    immediateTest,
    setPattern,
    setTestString,
    setFlags,
  }
}

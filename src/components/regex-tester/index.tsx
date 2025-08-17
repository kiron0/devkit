"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Download } from "lucide-react"

import type { RegexExample, RegexHistory } from "@/types/regex"
import { analyzeRegex } from "@/lib/regex-engine"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useRegex } from "@/hooks/use-regex"
import { Button } from "@/components/ui/button"

import { ExportDialog } from "./export-dialog"
import { RegexInputSection } from "./regex-input-section"
import { RegexOutputSection } from "./regex-output-section"

export function RegexTester() {
  const {
    pattern,
    testString,
    flags,
    result,
    isProcessing,
    updatePattern,
    updateTestString,
    updateFlag,
    immediateTest,
    setPattern,
    setTestString,
    setFlags,
  } = useRegex(300)

  // Store history in localStorage
  const [history, setHistory] = useLocalStorage<RegexHistory[]>(
    "regex-tester-history",
    []
  )

  // Export dialog state
  const [showExportDialog, setShowExportDialog] = useState(false)

  // Track initial load state
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Generate analysis
  const analysis = useMemo(() => {
    if (!pattern.trim()) return null
    return analyzeRegex(pattern)
  }, [pattern])

  // Load example
  const handleLoadExample = (example: RegexExample) => {
    // Set flags first
    setFlags({
      global: example.flags.global ?? false,
      ignoreCase: example.flags.ignoreCase ?? false,
      multiline: example.flags.multiline ?? false,
      dotAll: example.flags.dotAll ?? false,
      unicode: example.flags.unicode ?? false,
      sticky: example.flags.sticky ?? false,
    })

    // Use the update functions which trigger debounced test
    updatePattern(example.pattern)
    updateTestString(example.testString)
  }

  // Load history item
  const handleLoadHistory = (historyItem: RegexHistory) => {
    setFlags(historyItem.flags)
    updatePattern(historyItem.pattern)
    updateTestString(historyItem.testString)
  }

  // Save to history when pattern/testString changes
  useEffect(() => {
    if (pattern.trim() && testString.trim()) {
      const historyItem: RegexHistory = {
        id: Date.now().toString(),
        pattern,
        flags,
        testString,
        timestamp: Date.now(),
      }

      setHistory((prev) => {
        // Remove duplicate patterns
        const filtered = prev.filter((item) => item.pattern !== pattern)
        // Keep only last 50 items
        const newHistory = [historyItem, ...filtered].slice(0, 50)
        return newHistory
      })
    }
  }, [pattern, testString, setHistory, flags]) // Remove flags from dependencies

  // Load from URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const urlPattern = urlParams.get("pattern")
      const urlTestString = urlParams.get("testString")

      if (urlPattern) {
        setPattern(urlPattern)
      }

      if (urlTestString) {
        setTestString(urlTestString)
      }

      // Set flags from URL
      const newFlags = {
        global: Boolean(urlParams.get("global")),
        ignoreCase: Boolean(urlParams.get("ignoreCase")),
        multiline: Boolean(urlParams.get("multiline")),
        dotAll: Boolean(urlParams.get("dotAll")),
        unicode: Boolean(urlParams.get("unicode")),
        sticky: Boolean(urlParams.get("sticky")),
      }

      // Only update flags if there are URL parameters
      if (
        urlParams.has("global") ||
        urlParams.has("ignoreCase") ||
        urlParams.has("multiline") ||
        urlParams.has("dotAll") ||
        urlParams.has("unicode") ||
        urlParams.has("sticky")
      ) {
        setFlags(newFlags)
      }
    }

    // Mark initial load as complete
    setIsInitialLoad(false)
  }, [setPattern, setTestString, setFlags]) // Add necessary setState functions as dependencies

  // Run initial test once everything is loaded
  useEffect(() => {
    if (!isInitialLoad) {
      immediateTest()
    }
  }, [isInitialLoad, immediateTest])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="my-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <Link href="/" className="text-4xl font-bold md:text-5xl">
              🔍 Advanced Regex Tester
            </Link>
            <Button
              onClick={() => setShowExportDialog(true)}
              variant="outline"
              className="gap-2"
              disabled={!pattern.trim()}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Test, analyze, and understand regular expressions with real-time
            feedback, performance metrics, and comprehensive explanations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <RegexInputSection
              pattern={pattern}
              testString={testString}
              flags={flags}
              history={history}
              onPatternChange={updatePattern}
              onTestStringChange={updateTestString}
              onFlagChange={updateFlag}
              onLoadExample={handleLoadExample}
              onLoadHistory={handleLoadHistory}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <RegexOutputSection
              result={result}
              analysis={analysis}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground mt-12 text-center text-sm">
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS • Performance
            optimized with debouncing and Web Workers
          </p>
        </div>

        {/* Export Dialog */}
        <ExportDialog
          pattern={pattern}
          flags={flags}
          testString={testString}
          result={result}
          analysis={analysis}
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
        />
      </div>
    </div>
  )
}

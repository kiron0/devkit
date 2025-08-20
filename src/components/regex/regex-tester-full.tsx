"use client"

import { useEffect, useMemo, useState } from "react"
import { Download } from "lucide-react"

import type { RegexExample } from "@/types/regex"
import { analyzeRegex } from "@/lib/regex-engine"
import { cn } from "@/lib/utils"
import { useRegex } from "@/hooks/use-regex"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import { ExportDialog } from "./export-dialog"
import { FlagsSelector } from "./flags-selector"
import { MatchDisplay } from "./match-display"
import { MatchStats } from "./match-stats"
import { PatternInput } from "./pattern-input"
import { QuickExamples } from "./quick-examples"
import { TestStringInput } from "./test-string-input"

interface RegexTesterFullProps {
  debounceMs?: number
  className?: string
  title?: string
  description?: string
  showExport?: boolean
}

export function RegexTesterFull({
  debounceMs = 300,
  className,
  title = "🔍 Advanced Regex Tester",
  description = "Test, analyze, and understand regular expressions with real-time feedback, performance metrics, and comprehensive explanations.",
  showExport = true,
}: RegexTesterFullProps) {
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
    setFlags,
  } = useRegex(debounceMs)

  // Track initial load state
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Export dialog state
  const [showExportDialog, setShowExportDialog] = useState(false)

  // Generate analysis
  const analysis = useMemo(() => {
    if (!pattern.trim()) return null
    return analyzeRegex(pattern)
  }, [pattern])

  // Load example
  const handleLoadExample = (example: RegexExample) => {
    // Use a single state update to avoid race conditions
    const newFlags = {
      global: example.flags.global ?? false,
      ignoreCase: example.flags.ignoreCase ?? false,
      multiline: example.flags.multiline ?? false,
      dotAll: example.flags.dotAll ?? false,
      unicode: example.flags.unicode ?? false,
      sticky: example.flags.sticky ?? false,
    }

    // Update all state at once to ensure consistency
    setFlags(newFlags)
    updatePattern(example.pattern)
    updateTestString(example.testString)
  }

  // Load from URL parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsInitialLoad(false)
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const urlPattern = urlParams.get("pattern")
    const urlTest = urlParams.get("test")
    const urlFlags = urlParams.get("flags")

    // Only proceed if we have URL parameters to load
    if (!urlPattern && !urlTest && !urlFlags) {
      setIsInitialLoad(false)
      return
    }

    // Load pattern
    if (urlPattern) {
      updatePattern(urlPattern) // URLSearchParams handles decoding
    }

    // Load test string
    if (urlTest) {
      updateTestString(urlTest)
    }

    // Set flags from URL
    if (urlFlags) {
      const newFlags = {
        global: urlFlags.includes("g"),
        ignoreCase: urlFlags.includes("i"),
        multiline: urlFlags.includes("m"),
        dotAll: urlFlags.includes("s"),
        unicode: urlFlags.includes("u"),
        sticky: urlFlags.includes("y"),
      }
      setFlags(newFlags)
    }

    setIsInitialLoad(false)
  }, [setFlags, updatePattern, updateTestString])

  // Initial test after URL load
  useEffect(() => {
    if (!isInitialLoad) {
      immediateTest()
    }
  }, [isInitialLoad, immediateTest])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {description}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-6 p-6">
              <PatternInput
                value={pattern}
                onChange={updatePattern}
                label="Regex Pattern"
                placeholder="Enter your regex pattern..."
              />

              <FlagsSelector flags={flags} onChange={updateFlag} />

              <TestStringInput
                value={testString}
                onChange={updateTestString}
                label="Test String"
                placeholder="Enter text to test against..."
                rows={6}
              />

              <QuickExamples onLoadExample={handleLoadExample} />
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Results</Label>
              </div>

              <MatchDisplay
                result={result}
                isProcessing={isProcessing}
                minHeight="min-h-[200px]"
              />

              <MatchStats
                result={result}
                showResults={pattern.trim().length > 0}
              />

              {/* Export Button */}
              {showExport && (
                <div className="border-t pt-4">
                  <Button
                    onClick={() => setShowExportDialog(true)}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={!pattern.trim()}
                  >
                    <Download className="h-4 w-4" />
                    Export Pattern
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Section */}
          {analysis && (
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">
                  Analysis & Explanation
                </h3>
                <div className="space-y-2 text-sm">
                  {analysis.explanation &&
                    Array.isArray(analysis.explanation) && (
                      <div>
                        <h4 className="font-medium">Pattern Explanation:</h4>
                        <div className="space-y-1">
                          {analysis.explanation.map((item, index) => (
                            <p key={index} className="text-muted-foreground">
                              <span className="font-medium">{item.token}</span>:{" "}
                              {item.explanation}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  {analysis.performance && (
                    <div>
                      <h4 className="font-medium">Performance:</h4>
                      <p className="text-muted-foreground">
                        Time: {analysis.performance.executionTime?.toFixed(1)}ms
                        - Score: {analysis.performance.complexityScore}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        pattern={pattern}
        flags={flags}
        testString={testString}
        result={result}
        analysis={analysis}
      />
    </div>
  )
}

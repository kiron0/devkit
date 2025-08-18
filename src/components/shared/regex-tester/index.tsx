"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Download, RefreshCw, RotateCcw, Share2 } from "lucide-react"

import type { RegexExample } from "@/types/regex"
import { analyzeRegex } from "@/lib/regex-engine"
import { getCommonFeatures } from "@/lib/tool-patterns"
import { useRegex } from "@/hooks/use-regex"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"
import { ExportDialog } from "@/components/regex/export-dialog"
import { FlagsSelector } from "@/components/regex/flags-selector"
import { MatchDisplay } from "@/components/regex/match-display"
import { MatchStats } from "@/components/regex/match-stats"
import { PatternInput } from "@/components/regex/pattern-input"
import { QuickExamples } from "@/components/regex/quick-examples"
import { TestStringInput } from "@/components/regex/test-string-input"

export function RegexTesterAdvanced() {
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
  } = useRegex(300)

  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Generate analysis
  const analysis = useMemo(() => {
    if (!pattern.trim()) return null
    return analyzeRegex(pattern)
  }, [pattern])

  // Load example
  const handleLoadExample = useCallback(
    (example: RegexExample) => {
      setFlags({
        global: example.flags.global ?? false,
        ignoreCase: example.flags.ignoreCase ?? false,
        multiline: example.flags.multiline ?? false,
        dotAll: example.flags.dotAll ?? false,
        unicode: example.flags.unicode ?? false,
        sticky: example.flags.sticky ?? false,
      })
      updatePattern(example.pattern)
      updateTestString(example.testString)
    },
    [setFlags, updatePattern, updateTestString]
  )

  const handleClear = () => {
    updatePattern("")
    updateTestString("")
    setFlags({
      global: false,
      ignoreCase: false,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false,
    })
    toast({
      title: "Cleared",
      description: "Pattern and test string have been cleared",
    })
  }

  const handleShare = async () => {
    const url = new URL(window.location.href)
    url.searchParams.set("pattern", pattern)
    url.searchParams.set("test", testString)

    const flagsString = [
      flags.global && "g",
      flags.ignoreCase && "i",
      flags.multiline && "m",
      flags.dotAll && "s",
      flags.unicode && "u",
      flags.sticky && "y",
    ]
      .filter(Boolean)
      .join("")

    if (flagsString) {
      url.searchParams.set("flags", flagsString)
    }

    try {
      await navigator.clipboard.writeText(url.toString())
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard",
      })
    } catch {
      toast({
        title: "Share Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      })
    }
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

    if (!urlPattern && !urlTest && !urlFlags) {
      setIsInitialLoad(false)
      return
    }

    if (urlPattern) updatePattern(urlPattern)
    if (urlTest) updateTestString(urlTest)

    if (urlFlags) {
      setFlags({
        global: urlFlags.includes("g"),
        ignoreCase: urlFlags.includes("i"),
        multiline: urlFlags.includes("m"),
        dotAll: urlFlags.includes("s"),
        unicode: urlFlags.includes("u"),
        sticky: urlFlags.includes("y"),
      })
    }

    setIsInitialLoad(false)
  }, [setFlags, updatePattern, updateTestString])

  useEffect(() => {
    if (!isInitialLoad) {
      immediateTest()
    }
  }, [isInitialLoad, immediateTest])

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          onClick={immediateTest}
          variant="outline"
          disabled={!pattern.trim()}
        >
          <RefreshCw className="h-4 w-4" />
          Test Pattern
        </Button>

        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!pattern && !testString}
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          disabled={!pattern.trim()}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <Button
          onClick={() => setShowExportDialog(true)}
          variant="outline"
          disabled={!pattern.trim()}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pattern Input */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Regex Pattern</CardTitle>
                <CopyButton text={pattern} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <PatternInput
                value={pattern}
                onChange={updatePattern}
                placeholder="Enter your regex pattern..."
              />
            </CardContent>
          </Card>

          {/* Flags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Flags</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FlagsSelector flags={flags} onChange={updateFlag} />
            </CardContent>
          </Card>

          {/* Test String */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Test String</CardTitle>
                <CopyButton text={testString} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <TestStringInput
                value={testString}
                onChange={updateTestString}
                placeholder="Enter text to test against..."
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Quick Examples */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Examples</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <QuickExamples onLoadExample={handleLoadExample} />
            </CardContent>
          </Card>
        </div>

        {/* Results & Analysis */}
        <div className="space-y-6">
          {/* Results */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <MatchDisplay
                result={result}
                isProcessing={isProcessing}
                minHeight="min-h-[200px]"
              />
              <div className="mt-4">
                <MatchStats
                  result={result}
                  showResults={pattern.trim().length > 0}
                />
              </div>
            </CardContent>
          </Card>

          {/* Analysis */}
          {analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Analysis & Explanation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {analysis.explanation &&
                  Array.isArray(analysis.explanation) && (
                    <div>
                      <h4 className="mb-2 font-medium">Pattern Explanation:</h4>
                      <div className="space-y-1">
                        {analysis.explanation.map((item, index) => (
                          <p
                            key={index}
                            className="text-muted-foreground text-sm"
                          >
                            <span className="bg-muted rounded px-1 font-mono font-medium">
                              {item.token}
                            </span>
                            : {item.explanation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                {analysis.performance && (
                  <div>
                    <h4 className="mb-2 font-medium">Performance:</h4>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {analysis.performance.executionTime?.toFixed(1)}ms
                      </Badge>
                      <Badge variant="secondary">
                        Score: {analysis.performance.complexityScore}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About Regex</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Common Flags</h4>
                <p className="text-muted-foreground text-xs">
                  g: Global | i: Ignore case | m: Multiline | s: Dot all
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Performance</h4>
                <p className="text-muted-foreground text-xs">
                  Real-time testing with execution metrics
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Export</h4>
                <p className="text-muted-foreground text-xs">
                  Generate code snippets for multiple languages
                </p>
              </div>
            </CardContent>
          </Card>
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

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

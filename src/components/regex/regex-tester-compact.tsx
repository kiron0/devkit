"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRegex } from "@/hooks/use-regex"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/common/empty-state"

import { MatchDisplay } from "./match-display"
import { MatchStats } from "./match-stats"
import { PatternInput } from "./pattern-input"
import { TestStringInput } from "./test-string-input"

interface RegexTesterCompactProps {
  debounceMs?: number
  className?: string
}

export function RegexTesterCompact({
  debounceMs = 500,
  className,
}: RegexTesterCompactProps) {
  const {
    pattern,
    testString,
    result,
    isProcessing,
    updatePattern,
    updateTestString,
  } = useRegex(debounceMs)

  const [showResults, setShowResults] = useState(false)

  const handlePatternChange = (value: string) => {
    updatePattern(value)
    setShowResults(value.trim().length > 0)
  }

  const handleTestStringChange = (value: string) => {
    updateTestString(value)
    setShowResults(pattern.trim().length > 0)
  }

  const handleLoadExample = (patternValue: string, testValue: string) => {
    handlePatternChange(patternValue)
    handleTestStringChange(testValue)
  }

  return (
    <Card className={cn("mx-auto w-full max-w-4xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Regex Tester
          </div>
          <Link href="/tools/regex-tester">
            <Button variant="outline" size="sm" className="gap-2">
              Advanced Mode
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <PatternInput
              value={pattern}
              onChange={handlePatternChange}
              placeholder="Enter regex pattern (e.g., \\d+)"
              showCopyButton={false}
            />
            <TestStringInput
              value={testString}
              onChange={handleTestStringChange}
              placeholder="Enter text to test..."
              rows={5}
              showCopyButton={false}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Results</Label>
            </div>

            {!showResults ? (
              <div className="bg-muted/30 min-h-[140px] rounded-md border p-3 sm:min-h-[160px]">
                <EmptyState icon="🔍" title="Enter a pattern to see matches" />
              </div>
            ) : (
              <>
                <MatchDisplay
                  result={result}
                  isProcessing={isProcessing}
                  minHeight="min-h-[140px] sm:min-h-[160px]"
                />
                <MatchStats result={result} showResults={showResults} />
              </>
            )}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="border-t pt-6">
          <div className="mb-4 text-sm font-medium">Quick Examples:</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleLoadExample(
                  "\\b\\w+@\\w+\\.\\w+\\b",
                  "Contact us at support@example.com or sales@company.org"
                )
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="text-xs font-medium">📧 Email</div>
                <div className="text-muted-foreground text-xs">
                  Find email addresses
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleLoadExample(
                  "\\d{3}[-.]?\\d{3}[-.]?\\d{4}",
                  "Call us at 555-123-4567 or 555.987.6543"
                )
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="text-xs font-medium">📞 Phone</div>
                <div className="text-muted-foreground text-xs">
                  Match phone numbers
                </div>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleLoadExample(
                  "\\d+",
                  "I have 5 apples and 10 oranges, total 15 fruits"
                )
              }
              className="h-auto p-3 text-left"
            >
              <div>
                <div className="text-xs font-medium">🔢 Numbers</div>
                <div className="text-muted-foreground text-xs">
                  Extract numbers
                </div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

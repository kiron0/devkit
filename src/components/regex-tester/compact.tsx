"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Search } from "lucide-react"

import { useRegex } from "@/hooks/use-regex"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function CompactRegexTester() {
  const {
    pattern,
    testString,
    result,
    isProcessing,
    updatePattern,
    updateTestString,
  } = useRegex(500) // Slightly longer debounce for compact version

  const [showResults, setShowResults] = useState(false)

  const handlePatternChange = (value: string) => {
    updatePattern(value)
    setShowResults(value.trim().length > 0)
  }

  const handleTestStringChange = (value: string) => {
    updateTestString(value)
    setShowResults(pattern.trim().length > 0)
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Regex Tester
          </div>
          <Link href="/regex-tester">
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
            <div>
              <label className="mb-2 block text-sm font-medium">
                Regex Pattern
              </label>
              <Input
                value={pattern}
                onChange={(e) => handlePatternChange(e.target.value)}
                placeholder="Enter regex pattern (e.g., \d+)"
                className="font-mono text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Test String
              </label>
              <Textarea
                value={testString}
                onChange={(e) => handleTestStringChange(e.target.value)}
                placeholder="Enter text to test..."
                className="resize-none font-mono text-sm sm:text-base"
                rows={5}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Results</label>
              {isProcessing && (
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              )}
            </div>

            <div className="bg-muted/30 min-h-[140px] overflow-auto rounded-md border p-3 font-mono text-xs sm:min-h-[160px] sm:text-sm">
              {!showResults ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-center">
                  <div>
                    <div className="mb-2 text-2xl">🔍</div>
                    <div>Enter a pattern to see matches</div>
                  </div>
                </div>
              ) : result.error ? (
                <div className="text-destructive">
                  <strong>Error:</strong> {result.error}
                </div>
              ) : result.matches.length === 0 ? (
                <div className="text-muted-foreground flex h-full items-center justify-center text-center">
                  <div>
                    <div className="mb-2 text-2xl">❌</div>
                    <div>No matches found</div>
                  </div>
                </div>
              ) : (
                <div
                  className="leading-relaxed break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                />
              )}
            </div>

            {/* Quick Stats */}
            {showResults && result.matches.length > 0 && (
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {result.stats.matchCount}
                  </Badge>
                  <span className="text-muted-foreground">matches</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {result.stats.executionTime.toFixed(1)}ms
                  </Badge>
                  <span className="text-muted-foreground">time</span>
                </div>
                {result.matches.some(
                  (match) => match.groups && match.groups.length > 0
                ) && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {result.matches.reduce(
                        (count, match) =>
                          count + (match.groups ? match.groups.length : 0),
                        0
                      )}
                    </Badge>
                    <span className="text-muted-foreground">groups</span>
                  </div>
                )}
              </div>
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
              onClick={() => {
                handlePatternChange("\\b\\w+@\\w+\\.\\w+\\b")
                handleTestStringChange(
                  "Contact us at support@example.com or sales@company.org"
                )
              }}
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
              onClick={() => {
                handlePatternChange("\\d{3}[-.]?\\d{3}[-.]?\\d{4}")
                handleTestStringChange(
                  "Call us at 555-123-4567 or 555.987.6543"
                )
              }}
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
              onClick={() => {
                handlePatternChange("\\d+")
                handleTestStringChange(
                  "I have 5 apples and 10 oranges, total 15 fruits"
                )
              }}
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

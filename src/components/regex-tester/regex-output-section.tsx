import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Target,
  XCircle,
} from "lucide-react"

import type { RegexAnalysis, RegexTestResult } from "@/types/regex"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RegexOutputSectionProps {
  result: RegexTestResult
  analysis: RegexAnalysis | null
  isProcessing: boolean
}

export function RegexOutputSection({
  result,
  analysis,
  isProcessing,
}: RegexOutputSectionProps) {
  const { matches, highlightedText, stats, error, isValid } = result

  return (
    <div className="space-y-6">
      {/* Match Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Matches
            {isProcessing && (
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Match Display */}
            <div className="bg-muted/30 max-h-[300px] min-h-[120px] overflow-auto rounded-md border p-4 font-mono text-sm">
              {error ? (
                <div className="text-destructive flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>Error: {error}</span>
                </div>
              ) : !highlightedText.trim() ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Enter a regex pattern to see matches</span>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>No matches found</span>
                </div>
              ) : (
                <div
                  className="break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-md border p-3 text-center">
                <div className="text-primary text-2xl font-bold">
                  {stats.matchCount}
                </div>
                <div className="text-muted-foreground text-xs tracking-wide uppercase">
                  Matches
                </div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-primary text-2xl font-bold">
                  {stats.uniqueMatches}
                </div>
                <div className="text-muted-foreground text-xs tracking-wide uppercase">
                  Unique
                </div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-primary text-2xl font-bold">
                  {stats.totalLength}
                </div>
                <div className="text-muted-foreground text-xs tracking-wide uppercase">
                  Total Length
                </div>
              </div>
              <div className="rounded-md border p-3 text-center">
                <div className="text-primary text-2xl font-bold">
                  {stats.executionTime.toFixed(2)}ms
                </div>
                <div className="text-muted-foreground text-xs tracking-wide uppercase">
                  Execution Time
                </div>
              </div>
            </div>

            {/* Match Details */}
            {matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Match Details</h4>
                <div className="max-h-[200px] space-y-2 overflow-auto">
                  {matches.slice(0, 10).map((match, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 flex items-center gap-3 rounded p-2 text-xs"
                    >
                      <Badge variant="secondary" className="px-2 text-xs">
                        {index + 1}
                      </Badge>
                      <code className="bg-background flex-1 rounded px-2 py-1">
                        {match.match}
                      </code>
                      <span className="text-muted-foreground">
                        @{match.index}
                      </span>
                      {match.groups.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {match.groups.length} groups
                        </Badge>
                      )}
                    </div>
                  ))}
                  {matches.length > 10 && (
                    <div className="text-muted-foreground text-center text-xs">
                      ... and {matches.length - 10} more matches
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regex Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Regex Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis || analysis.explanation.length === 0 ? (
            <div className="text-muted-foreground flex items-center gap-2 p-4">
              <Lightbulb className="h-4 w-4" />
              <span>Enter a regex pattern to see explanation</span>
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.explanation.map((exp, index) => (
                <div
                  key={index}
                  className="bg-muted/30 border-primary/50 flex items-start gap-3 rounded-md border-l-4 p-3"
                >
                  <Badge
                    variant={
                      exp.type === "literal"
                        ? "secondary"
                        : exp.type === "metacharacter"
                          ? "default"
                          : exp.type === "quantifier"
                            ? "success"
                            : exp.type === "group"
                              ? "info"
                              : exp.type === "class"
                                ? "warning"
                                : "outline"
                    }
                    className="shrink-0 font-mono text-xs"
                  >
                    {exp.token}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{exp.explanation}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Type: {exp.type} • Position: {exp.position[0]}-
                      {exp.position[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance & Analysis */}
      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border p-3 text-center">
                  <div className="text-lg font-bold">
                    {analysis.performance.compilationTime.toFixed(2)}ms
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Compilation
                  </div>
                </div>
                <div className="rounded-md border p-3 text-center">
                  <div
                    className={cn(
                      "text-lg font-bold",
                      analysis.performance.complexityScore < 5
                        ? "text-green-600"
                        : analysis.performance.complexityScore < 15
                          ? "text-yellow-600"
                          : "text-red-600"
                    )}
                  >
                    {analysis.performance.complexityScore}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Complexity
                  </div>
                </div>
              </div>

              <div className="text-muted-foreground text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Low complexity (0-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>Medium complexity (5-15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>High complexity (15+)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings & Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-destructive text-sm font-medium">
                    Warnings
                  </h4>
                  {analysis.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="text-destructive mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-destructive">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {analysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-600">
                    Suggestions
                  </h4>
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span className="text-blue-600">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}

              {analysis.warnings.length === 0 &&
                analysis.suggestions.length === 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">No issues detected</span>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

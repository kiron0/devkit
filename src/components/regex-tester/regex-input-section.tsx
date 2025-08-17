import { Clock, Copy, History, Search, Zap } from "lucide-react"

import type { RegexExample, RegexFlags, RegexHistory } from "@/types/regex"
import { REGEX_EXAMPLES } from "@/lib/regex-engine"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface RegexInputSectionProps {
  pattern: string
  testString: string
  flags: RegexFlags
  history: RegexHistory[]
  onPatternChange: (pattern: string) => void
  onTestStringChange: (testString: string) => void
  onFlagChange: (flag: keyof RegexFlags, value: boolean) => void
  onLoadExample: (example: RegexExample) => void
  onLoadHistory: (historyItem: RegexHistory) => void
}

export function RegexInputSection({
  pattern,
  testString,
  flags,
  history,
  onPatternChange,
  onTestStringChange,
  onFlagChange,
  onLoadExample,
  onLoadHistory,
}: RegexInputSectionProps) {
  const handleCopyPattern = async () => {
    try {
      await navigator.clipboard.writeText(pattern)
    } catch (error) {
      console.error("Failed to copy pattern:", error)
    }
  }

  const handleCopyTestString = async () => {
    try {
      await navigator.clipboard.writeText(testString)
    } catch (error) {
      console.error("Failed to copy test string:", error)
    }
  }

  const flagDefinitions = [
    {
      key: "global" as const,
      label: "g",
      description: "Global - find all matches",
    },
    {
      key: "ignoreCase" as const,
      label: "i",
      description: "Ignore case - case insensitive matching",
    },
    {
      key: "multiline" as const,
      label: "m",
      description: "Multiline - ^ and $ match line breaks",
    },
    {
      key: "dotAll" as const,
      label: "s",
      description: "Dot all - . matches newlines",
    },
    {
      key: "unicode" as const,
      label: "u",
      description: "Unicode - enable Unicode support",
    },
    {
      key: "sticky" as const,
      label: "y",
      description: "Sticky - match from lastIndex only",
    },
  ]

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Regex Pattern
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pattern Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Regular Expression</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPattern}
              disabled={!pattern}
              className="h-8 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <Input
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="Enter your regex pattern..."
            className="bg-amber-50 font-mono text-sm dark:bg-amber-950/20"
            startIcon={<Zap className="h-4 w-4" />}
          />
        </div>

        {/* Flags */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Flags</label>
          <div className="grid grid-cols-2 gap-3">
            {flagDefinitions.map(({ key, label, description }) => (
              <div key={key} className="flex items-start space-x-2">
                <Checkbox
                  id={`flag-${key}`}
                  checked={flags[key]}
                  onCheckedChange={(checked) =>
                    onFlagChange(key, checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={`flag-${key}`}
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0.5 font-mono text-xs"
                      >
                        {label}
                      </Badge>
                      <span className="text-xs">
                        {label === "g" ? "global" : key}
                      </span>
                    </div>
                  </label>
                  <p className="text-muted-foreground text-xs">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test String Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Test String</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyTestString}
              disabled={!testString}
              className="h-8 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <Textarea
            value={testString}
            onChange={(e) => onTestStringChange(e.target.value)}
            placeholder="Enter text to test against your regex..."
            className="resize-none font-mono text-sm"
            size="lg"
            showCount
            maxLength={10000}
          />
        </div>

        {/* Quick Examples */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <label className="text-sm font-medium">Quick Examples</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {REGEX_EXAMPLES.slice(0, 6).map((example) => (
              <Button
                key={example.name}
                variant="outline"
                size="sm"
                onClick={() => onLoadExample(example)}
                className="h-8 text-xs"
              >
                {example.name}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Click any example to load it into the tester
          </p>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <label className="text-sm font-medium">Recent Patterns</label>
            </div>
            <div className="max-h-[120px] space-y-2 overflow-y-auto">
              {history.slice(0, 5).map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoadHistory(item)}
                  className="h-auto w-full justify-start p-2 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-primary truncate font-mono text-xs">
                      /{item.pattern}/
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Click to load a recent pattern
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

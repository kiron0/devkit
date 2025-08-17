"use client"

import { Download, FileText } from "lucide-react"

import type { RegexAnalysis, RegexFlags, RegexTestResult } from "@/types/regex"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CopyButton } from "@/components/common/copy-button"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  pattern: string
  flags: RegexFlags
  testString: string
  result: RegexTestResult
  analysis?: RegexAnalysis | null
}

export function ExportDialog({
  isOpen,
  onClose,
  pattern,
  flags,
  testString,
  result,
}: ExportDialogProps) {
  const flagString = Object.entries(flags)
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

  const exportData = {
    pattern,
    flags: flagString,
    testString,
    matches: result.matches,
    stats: result.stats,
    timestamp: new Date().toISOString(),
  }

  const generateCodeSnippet = (language: string) => {
    switch (language) {
      case "javascript":
        return `// JavaScript Regex
const pattern = /${pattern}/${flagString};
const testString = ${JSON.stringify(testString)};
const matches = testString.match(pattern);
console.log(matches);`

      case "python":
        return `# Python Regex
import re
pattern = r"${pattern}"
test_string = ${JSON.stringify(testString)}
matches = re.findall(pattern, test_string${flagString.includes("i") ? ", re.IGNORECASE" : ""})
print(matches)`

      case "java":
        return `// Java Regex
import java.util.regex.Pattern;
import java.util.regex.Matcher;

String pattern = "${pattern.replace(/\\/g, "\\\\")}";
String testString = ${JSON.stringify(testString)};
Pattern regex = Pattern.compile(pattern${flagString.includes("i") ? ", Pattern.CASE_INSENSITIVE" : ""});
Matcher matcher = regex.matcher(testString);`

      default:
        return `Regex: /${pattern}/${flagString}\nTest String: ${testString}`
    }
  }

  const generateShareableURL = () => {
    const params = new URLSearchParams({
      pattern: encodeURIComponent(pattern),
      test: encodeURIComponent(testString),
      flags: flagString,
    })
    return `${typeof window !== "undefined" ? window.location.origin : ""}/regex-tester?${params.toString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Regex Pattern
          </DialogTitle>
          <DialogDescription>
            Export your regex pattern in various formats or generate shareable
            links
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          {/* Pattern Summary */}
          <div className="bg-muted/30 rounded-lg border p-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Pattern:</span>
                <code className="ml-2 font-mono text-sm">
                  /{pattern}/{flagString}
                </code>
              </div>
              <div>
                <span className="text-sm font-medium">Matches:</span>
                <Badge variant="secondary" className="ml-2">
                  {result.stats.matchCount}
                </Badge>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export Options</h3>

            {/* JSON Export */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">JSON Data</h4>
                  <p className="text-muted-foreground text-sm">
                    Complete data with matches and statistics
                  </p>
                </div>
                <div className="flex gap-2">
                  <CopyButton
                    text={JSON.stringify(exportData, null, 2)}
                    showText={true}
                    variant="outline"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob(
                        [JSON.stringify(exportData, null, 2)],
                        { type: "application/json" }
                      )
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "regex-export.json"
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Code Snippets */}
            <div className="space-y-3">
              <h4 className="font-medium">Code Snippets</h4>

              <div className="space-y-4 pr-2">
                {/* JavaScript */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">JavaScript</span>
                    <CopyButton
                      text={generateCodeSnippet("javascript")}
                      size="sm"
                    />
                  </div>
                  <div>
                    <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                      <code>{generateCodeSnippet("javascript")}</code>
                    </pre>
                  </div>
                </div>

                {/* Python */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Python</span>
                    <CopyButton
                      text={generateCodeSnippet("python")}
                      size="sm"
                    />
                  </div>
                  <div>
                    <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                      <code>{generateCodeSnippet("python")}</code>
                    </pre>
                  </div>
                </div>

                {/* Java */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Java</span>
                    <CopyButton text={generateCodeSnippet("java")} size="sm" />
                  </div>
                  <div>
                    <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                      <code>{generateCodeSnippet("java")}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Shareable URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Shareable URL</h4>
                  <p className="text-muted-foreground text-sm">
                    Share this regex with others
                  </p>
                </div>
                <CopyButton
                  text={generateShareableURL()}
                  showText={true}
                  variant="outline"
                />
              </div>
              <div>
                <div className="bg-muted rounded p-3">
                  <code className="text-xs break-all">
                    {generateShareableURL()}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

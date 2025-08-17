import { useState } from "react"
import {
  Check,
  Code,
  Copy,
  Database,
  Download,
  FileText,
  Share2,
} from "lucide-react"

import type { RegexAnalysis, RegexFlags, RegexTestResult } from "@/types/regex"
import {
  copyToClipboard,
  exportAsCode,
  exportToCSV,
  exportToJSON,
  generateShareableURL,
} from "@/lib/export-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExportDialogProps {
  pattern: string
  flags: RegexFlags
  testString: string
  result: RegexTestResult
  analysis: RegexAnalysis | null
  isOpen: boolean
  onClose: () => void
}

export function ExportDialog({
  pattern,
  flags,
  testString,
  result,
  analysis,
  isOpen,
  onClose,
}: ExportDialogProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedPattern, setCopiedPattern] = useState(false)

  if (!isOpen) return null

  const exportData = {
    pattern,
    flags,
    testString,
    result,
    analysis,
    timestamp: new Date().toISOString(),
  }

  const handleExportJSON = () => {
    exportToJSON(exportData)
  }

  const handleExportCSV = () => {
    exportToCSV(exportData)
  }

  const handleExportCode = (
    language: "javascript" | "python" | "java" | "csharp"
  ) => {
    exportAsCode(exportData, language)
  }

  const handleShareURL = async () => {
    const url = generateShareableURL({ pattern, flags, testString })
    const success = await copyToClipboard(url)
    if (success) {
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  const handleCopyPattern = async () => {
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

    const regexString = `/${pattern}/${flagString}`
    const success = await copyToClipboard(regexString)
    if (success) {
      setCopiedPattern(true)
      setTimeout(() => setCopiedPattern(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg shadow-xl">
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export & Share
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyPattern}
                  className="justify-start gap-2"
                >
                  {copiedPattern ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy Regex Pattern
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareURL}
                  className="justify-start gap-2"
                >
                  {copiedUrl ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  Share URL
                </Button>
              </div>
            </div>

            {/* Export Data */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Export Data</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportJSON}
                  className="justify-start gap-2"
                  disabled={!result.matches.length}
                >
                  <FileText className="h-4 w-4" />
                  Export as JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="justify-start gap-2"
                  disabled={!result.matches.length}
                >
                  <Database className="h-4 w-4" />
                  Export as CSV
                </Button>
              </div>
            </div>

            {/* Export Code */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Export as Code</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleExportCode("javascript")}
                  className="justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  JavaScript
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportCode("python")}
                  className="justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  Python
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportCode("java")}
                  className="justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  Java
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportCode("csharp")}
                  className="justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  C#
                </Button>
              </div>
            </div>

            {/* Current Pattern Info */}
            <div className="bg-muted/30 space-y-2 rounded-lg p-4">
              <h4 className="text-sm font-medium">Current Pattern</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    /{pattern}/
                    {Object.entries(flags)
                      .filter(([, v]) => v)
                      .map(([k]) => k[0])
                      .join("")}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-xs">
                  {result.matches.length} matches found •{" "}
                  {result.stats.executionTime.toFixed(2)}ms execution time
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-muted-foreground text-xs">
              <p>
                <strong>Share URL:</strong> Creates a link that loads this
                pattern and test string
              </p>
              <p>
                <strong>Export Data:</strong> Downloads match results and
                analysis
              </p>
              <p>
                <strong>Export Code:</strong> Generates code snippets for
                different programming languages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

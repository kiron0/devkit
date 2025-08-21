"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  ToolControls,
  ToolLayout,
} from "@/components/common"

function csvToJson(csv: string): string {
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return "[]"
  const headers = lines[0].split(",").map((h) => h.trim())
  const rows = lines
    .slice(1)
    .map((line) => line.split(",").map((c) => c.trim()))
  const json = rows.map((cols) =>
    headers.reduce<Record<string, string>>((acc, h, i) => {
      acc[h] = cols[i] ?? ""
      return acc
    }, {})
  )
  return JSON.stringify(json, null, 2)
}

function validateCsv(csv: string): string | null {
  if (!csv.trim()) return "CSV is empty"
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return "CSV has no data"
  const headers = lines[0].split(",").map((h) => h.trim())
  if (headers.length === 0) return "CSV header is missing"
  // check row column counts
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",")
    if (cols.length !== headers.length) {
      return `Row ${i + 1} has ${cols.length} columns, expected ${headers.length}`
    }
  }
  return null
}

function validateJson(jsonString: string): string | null {
  if (!jsonString.trim()) return "JSON is empty"
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) return "JSON must be an array of objects"
    if (data.length === 0) return "JSON array is empty"
    if (!data.every((item) => typeof item === "object" && item !== null))
      return "JSON array must contain objects"
  } catch {
    return "Malformed JSON"
  }
  return null
}

function jsonToCsv(jsonString: string): string {
  const data = JSON.parse(jsonString)
  if (!Array.isArray(data) || data.length === 0) return ""
  const headers = Array.from(
    data.reduce<Set<string>>((s, row) => {
      Object.keys(row || {}).forEach((k) => s.add(k))
      return s
    }, new Set())
  )
  const body = data
    .map((row: Record<string, unknown>) =>
      headers.map((h) => row?.[h] ?? "").join(",")
    )
    .join("\n")
  return [headers.join(","), body].filter(Boolean).join("\n")
}

export function CsvJsonConverter() {
  const [csv, setCsv] = useState("")
  const [json, setJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [errorLocation, setErrorLocation] = useState<"csv" | "json" | null>(
    null
  )

  const handleToJson = () => {
    const csvValidation = validateCsv(csv)
    if (csvValidation) {
      setError(csvValidation)
      setErrorLocation("csv")
      return
    }

    try {
      setError(null)
      setErrorLocation(null)
      setJson(csvToJson(csv))
    } catch {
      setError("Failed to convert CSV to JSON")
      setErrorLocation("csv")
    }
  }

  const handleToCsv = () => {
    const jsonValidation = validateJson(json)
    if (jsonValidation) {
      setError(jsonValidation)
      setErrorLocation("json")
      return
    }

    try {
      setError(null)
      setErrorLocation(null)
      setCsv(jsonToCsv(json))
    } catch {
      setError("Invalid JSON input")
      setErrorLocation("json")
    }
  }

  const handleClear = () => {
    setCsv("")
    setJson("")
    setError(null)
    setErrorLocation(null)
  }

  const handleSampleData = () => {
    const sampleCSV = `name,age,city,occupation
Alice,32,New York,Engineer
Bob,28,San Francisco,Designer
Charlie,35,Chicago,Manager
Diana,29,Boston,Developer
Eve,31,Seattle,Product Manager`
    setCsv(sampleCSV)
    setJson("")
    setError(null)
  }

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={handleToJson} disabled={!csv.trim()}>
          CSV → JSON
        </Button>
        <Button onClick={handleToCsv} variant="outline" disabled={!json.trim()}>
          JSON → CSV
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!csv && !json}
        >
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">CSV</CardTitle>
              <CopyButton text={csv} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="name,age\nAlice,32\nBob,28"
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
            {error && errorLocation === "csv" && (
              <div className="text-destructive mt-2 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">JSON</CardTitle>
              <CopyButton text={json} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder='[{"name":"Alice","age":"32"}]'
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
            {error && errorLocation === "json" && (
              <div className="text-destructive mt-2 text-sm">{error}</div>
            )}
          </CardContent>
        </Card>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

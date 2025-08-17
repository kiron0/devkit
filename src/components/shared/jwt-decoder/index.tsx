"use client"

import { useMemo, useState } from "react"
import { Key, RotateCcw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
  ValidationBadge,
} from "@/components/common"

function base64UrlDecode(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = input.length % 4
  if (pad) input += "=".repeat(4 - pad)
  try {
    return decodeURIComponent(
      atob(input)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
  } catch {
    return null
  }
}

export function JwtDecoder() {
  const [token, setToken] = useState("")

  const { header, payload, valid } = useMemo(() => {
    const parts = token.split(".")
    if (parts.length < 2)
      return {
        header: "",
        payload: "",
        valid: token.trim() === "" ? null : false,
      }
    const h = base64UrlDecode(parts[0])
    const p = base64UrlDecode(parts[1])
    try {
      return {
        header: h ? JSON.stringify(JSON.parse(h), null, 2) : "",
        payload: p ? JSON.stringify(JSON.parse(p), null, 2) : "",
        valid: Boolean(h && p),
      }
    } catch {
      return { header: h || "", payload: p || "", valid: false }
    }
  }, [token])

  const clear = () => setToken("")

  const handleSampleData = () => {
    // Sample JWT token (this is a demo token, not a real one)
    const sampleToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0EQpEd9A"
    setToken(sampleToken)
  }

  const stats = [
    {
      label: "Token Length",
      value: token.length.toString(),
      icon: "🔑",
    },
    {
      label: "Valid",
      value: valid === null ? "N/A" : valid ? "Yes" : "No",
      icon: valid === null ? "❓" : valid ? "✅" : "❌",
    },
    {
      label: "Parts",
      value: token ? token.split(".").length.toString() : "0",
      icon: "📊",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={clear} variant="outline" disabled={!token}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <Key className="mr-2 h-4 w-4" />
          Sample
        </Button>
      </ToolControls>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">JWT</CardTitle>
              <CopyButton text={token} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="eyJhbGciOi..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-[140px] font-mono text-sm"
            />
            <div className="mt-2">
              <ValidationBadge
                isValid={valid === null ? false : valid}
                validText="Looks valid"
                invalidText="Invalid structure"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Header</CardTitle>
                <CopyButton text={header} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={header}
                readOnly
                className="bg-muted/50 min-h-[160px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Payload</CardTitle>
                <CopyButton text={payload} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={payload}
                readOnly
                className="bg-muted/50 min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <StatsDisplay stats={stats} />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

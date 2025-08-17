"use client"

import { useCallback, useEffect, useState } from "react"
import { Calendar, Clock, RefreshCw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface TimestampData {
  unix: number
  milliseconds: number
  iso: string
  utc: string
  local: string
  relative: string
}

export function TimestampConverter() {
  const [currentTime, setCurrentTime] = useState<TimestampData | null>(null)
  const [inputTimestamp, setInputTimestamp] = useState("")
  const [inputType, setInputType] = useState<"unix" | "iso" | "milliseconds">(
    "unix"
  )
  const [convertedTime, setConvertedTime] = useState<TimestampData | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const formatTimestamp = useCallback((timestamp: number): TimestampData => {
    const date = new Date(timestamp)

    const getRelativeTime = (date: Date): string => {
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffDays / 365)

      if (diffMs < 0) {
        // Future date
        const absDiffSeconds = Math.abs(diffSeconds)
        const absDiffMinutes = Math.abs(diffMinutes)
        const absDiffHours = Math.abs(diffHours)
        const absDiffDays = Math.abs(diffDays)

        if (absDiffSeconds < 60) return `in ${absDiffSeconds} seconds`
        if (absDiffMinutes < 60) return `in ${absDiffMinutes} minutes`
        if (absDiffHours < 24) return `in ${absDiffHours} hours`
        if (absDiffDays < 30) return `in ${absDiffDays} days`
        return `in ${Math.abs(diffMonths)} months`
      }

      if (diffSeconds < 60) return `${diffSeconds} seconds ago`
      if (diffMinutes < 60) return `${diffMinutes} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffWeeks < 4) return `${diffWeeks} weeks ago`
      if (diffMonths < 12) return `${diffMonths} months ago`
      return `${diffYears} years ago`
    }

    return {
      unix: Math.floor(timestamp / 1000),
      milliseconds: timestamp,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: getRelativeTime(date),
    }
  }, [])

  const parseInput = useCallback(
    (input: string, type: string): number | null => {
      try {
        switch (type) {
          case "unix":
            const unixSeconds = parseInt(input)
            if (isNaN(unixSeconds)) return null
            return unixSeconds * 1000 // Convert to milliseconds

          case "milliseconds":
            const ms = parseInt(input)
            if (isNaN(ms)) return null
            return ms

          case "iso":
            const date = new Date(input)
            if (isNaN(date.getTime())) return null
            return date.getTime()

          default:
            return null
        }
      } catch {
        return null
      }
    },
    []
  )

  const handleInputChange = (value: string) => {
    setInputTimestamp(value)

    if (!value.trim()) {
      setConvertedTime(null)
      setIsValid(null)
      return
    }

    const timestamp = parseInput(value, inputType)

    if (timestamp === null) {
      setIsValid(false)
      setConvertedTime(null)
    } else {
      setIsValid(true)
      setConvertedTime(formatTimestamp(timestamp))
    }
  }

  const handleTypeChange = (type: "unix" | "iso" | "milliseconds") => {
    setInputType(type)
    if (inputTimestamp.trim()) {
      handleInputChange(inputTimestamp)
    }
  }

  const handleCurrentTime = () => {
    const now = Date.now()
    setCurrentTime(formatTimestamp(now))
  }

  const handleSampleData = () => {
    const samples = {
      unix: "1704067200", // 2024-01-01 00:00:00 UTC
      milliseconds: "1704067200000",
      iso: "2024-01-01T00:00:00.000Z",
    }

    setInputTimestamp(samples[inputType])
    handleInputChange(samples[inputType])
  }

  const presetTimestamps = [
    { label: "Unix Epoch", value: 0, description: "January 1, 1970" },
    { label: "Y2K", value: 946684800, description: "January 1, 2000" },
    {
      label: "Unix Time 32-bit End",
      value: 2147483647,
      description: "January 19, 2038",
    },
    {
      label: "Next Year",
      value: Math.floor(
        new Date(new Date().getFullYear() + 1, 0, 1).getTime() / 1000
      ),
      description: "New Year's Day",
    },
  ]

  // Update current time every second
  useEffect(() => {
    handleCurrentTime()
    const interval = setInterval(handleCurrentTime, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatTimestamp])

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      {/* Current Time */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <Clock className="mr-2 inline h-5 w-5" />
              Current Time
            </CardTitle>
            <Button onClick={handleCurrentTime} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentTime && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">
                  Unix Timestamp
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm">{currentTime.unix}</code>
                  <CopyButton text={currentTime.unix.toString()} size="sm" />
                </div>
              </div>
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">
                  Milliseconds
                </div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm">
                    {currentTime.milliseconds}
                  </code>
                  <CopyButton
                    text={currentTime.milliseconds.toString()}
                    size="sm"
                  />
                </div>
              </div>
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">
                  ISO 8601
                </div>
                <div className="flex items-center justify-between">
                  <code className="truncate font-mono text-sm">
                    {currentTime.iso}
                  </code>
                  <CopyButton text={currentTime.iso} size="sm" />
                </div>
              </div>
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">UTC</div>
                <div className="flex items-center justify-between">
                  <code className="truncate font-mono text-sm">
                    {currentTime.utc}
                  </code>
                  <CopyButton text={currentTime.utc} size="sm" />
                </div>
              </div>
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">
                  Local Time
                </div>
                <div className="flex items-center justify-between">
                  <code className="truncate font-mono text-sm">
                    {currentTime.local}
                  </code>
                  <CopyButton text={currentTime.local} size="sm" />
                </div>
              </div>
              <div className="bg-muted/50 rounded border p-3">
                <div className="text-muted-foreground mb-1 text-sm">
                  Relative
                </div>
                <div className="text-sm">Now</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Converter */}
        <div className="space-y-6 lg:col-span-2">
          {/* Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Convert Timestamp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Type Selector */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={inputType === "unix" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange("unix")}
                >
                  Unix Timestamp
                </Button>
                <Button
                  variant={inputType === "milliseconds" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange("milliseconds")}
                >
                  Milliseconds
                </Button>
                <Button
                  variant={inputType === "iso" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange("iso")}
                >
                  ISO 8601
                </Button>
                <Button onClick={handleSampleData} variant="outline" size="sm">
                  Sample Data
                </Button>
              </div>

              {/* Input Field */}
              <div className="space-y-2">
                <Input
                  placeholder={
                    inputType === "unix"
                      ? "1704067200"
                      : inputType === "milliseconds"
                        ? "1704067200000"
                        : "2024-01-01T00:00:00.000Z"
                  }
                  value={inputTimestamp}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="font-mono"
                />

                {/* Validation Badge */}
                {isValid !== null && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isValid ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isValid ? "✓ Valid" : "✗ Invalid"}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {convertedTime && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Converted Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Unix Timestamp
                      </span>
                      <CopyButton
                        text={convertedTime.unix.toString()}
                        size="sm"
                      />
                    </div>
                    <code className="block font-mono text-sm">
                      {convertedTime.unix}
                    </code>
                  </div>

                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Milliseconds</span>
                      <CopyButton
                        text={convertedTime.milliseconds.toString()}
                        size="sm"
                      />
                    </div>
                    <code className="block font-mono text-sm">
                      {convertedTime.milliseconds}
                    </code>
                  </div>

                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">ISO 8601</span>
                      <CopyButton text={convertedTime.iso} size="sm" />
                    </div>
                    <code className="block font-mono text-sm break-all">
                      {convertedTime.iso}
                    </code>
                  </div>

                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">UTC String</span>
                      <CopyButton text={convertedTime.utc} size="sm" />
                    </div>
                    <code className="block font-mono text-sm break-all">
                      {convertedTime.utc}
                    </code>
                  </div>

                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Local Time</span>
                      <CopyButton text={convertedTime.local} size="sm" />
                    </div>
                    <code className="block font-mono text-sm break-all">
                      {convertedTime.local}
                    </code>
                  </div>

                  <div className="bg-muted/50 rounded border p-3">
                    <div className="mb-2 text-sm font-medium">
                      Relative Time
                    </div>
                    <div className="text-sm">{convertedTime.relative}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preset Timestamps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                <Calendar className="mr-2 inline h-4 w-4" />
                Famous Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {presetTimestamps.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setInputType("unix")
                    setInputTimestamp(preset.value.toString())
                    handleInputChange(preset.value.toString())
                  }}
                  className="hover:bg-muted/50 w-full rounded-lg border p-3 text-left transition-colors"
                >
                  <div className="text-sm font-medium">{preset.label}</div>
                  <div className="text-muted-foreground text-xs">
                    {preset.description}
                  </div>
                  <code className="font-mono text-xs">{preset.value}</code>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Format Reference */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Format Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Unix Timestamp</h4>
                <p className="text-muted-foreground">
                  Seconds since January 1, 1970 UTC
                </p>
                <code className="text-xs">1704067200</code>
              </div>
              <div>
                <h4 className="font-semibold">Milliseconds</h4>
                <p className="text-muted-foreground">
                  Milliseconds since Unix epoch
                </p>
                <code className="text-xs">1704067200000</code>
              </div>
              <div>
                <h4 className="font-semibold">ISO 8601</h4>
                <p className="text-muted-foreground">
                  International standard format
                </p>
                <code className="text-xs">2024-01-01T00:00:00.000Z</code>
              </div>
            </CardContent>
          </Card>

          {/* Time Zones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Time Zone Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Local Timezone:</span>
                <code className="text-xs">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </code>
              </div>
              <div className="flex justify-between">
                <span>UTC Offset:</span>
                <code className="text-xs">
                  {new Date().getTimezoneOffset() / -60}h
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

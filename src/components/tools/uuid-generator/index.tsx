"use client"

import React, { useCallback, useState } from "react"
import { Download, RefreshCw, Trash2 } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface GeneratedUUID {
  id: string
  uuid: string
  version: string
  timestamp: number
}

export function UUIDGenerator() {
  const [currentUUID, setCurrentUUID] = useState("")
  const [selectedVersion, setSelectedVersion] = useState("v4")
  const [history, setHistory] = useState<GeneratedUUID[]>([])
  const [bulkCount, setBulkCount] = useState(10)

  const generateUUIDv4 = useCallback((): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }, [])

  const generateUUIDv1 = useCallback((): string => {
    // Simplified UUID v1 implementation (timestamp-based)
    const timestamp = Date.now()
    const timestampHex = timestamp.toString(16).padStart(12, "0")
    const randomPart = Math.random().toString(16).substring(2, 14)

    return [
      timestampHex.substring(0, 8),
      timestampHex.substring(8, 12),
      "1" + randomPart.substring(0, 3),
      (8 + Math.floor(Math.random() * 4)).toString(16) +
        randomPart.substring(3, 6),
      randomPart.substring(6, 12) + Math.random().toString(16).substring(2, 8),
    ].join("-")
  }, [])

  const generateNil = useCallback((): string => {
    return "00000000-0000-0000-0000-000000000000"
  }, [])

  const generateMax = useCallback((): string => {
    return "ffffffff-ffff-ffff-ffff-ffffffffffff"
  }, [])

  const generateUUID = useCallback(
    (version: string = selectedVersion): string => {
      switch (version) {
        case "v1":
          return generateUUIDv1()
        case "v4":
          return generateUUIDv4()
        case "nil":
          return generateNil()
        case "max":
          return generateMax()
        default:
          return generateUUIDv4()
      }
    },
    [selectedVersion, generateUUIDv1, generateUUIDv4, generateNil, generateMax]
  )

  const handleGenerate = useCallback(() => {
    const uuid = generateUUID()
    setCurrentUUID(uuid)

    const newEntry: GeneratedUUID = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uuid,
      version: selectedVersion,
      timestamp: Date.now(),
    }

    setHistory((prev) => {
      // Ensure no duplicate IDs
      const existingIds = new Set(prev.map((item) => item.id))
      if (existingIds.has(newEntry.id)) {
        newEntry.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      return [newEntry, ...prev.slice(0, 49)] // Keep last 50
    })

    toast({
      title: "UUID Generated",
      description: `${selectedVersion.toUpperCase()} UUID created`,
    })
  }, [generateUUID, selectedVersion])

  const generateBulkUUIDs = useCallback(() => {
    const uuids = Array.from({ length: bulkCount }, () => generateUUID())
    const content = uuids.join("\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `uuid-bulk-${selectedVersion}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Bulk UUIDs Generated",
      description: `${bulkCount} UUIDs downloaded`,
    })
  }, [generateUUID, bulkCount, selectedVersion])

  const clearHistory = () => {
    setHistory([])
    toast({
      title: "History Cleared",
      description: "UUID history has been cleared",
    })
  }

  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const nilRegex = /^00000000-0000-0000-0000-000000000000$/
    const maxRegex = /^ffffffff-ffff-ffff-ffff-ffffffffffff$/i

    return uuidRegex.test(uuid) || nilRegex.test(uuid) || maxRegex.test(uuid)
  }

  const getUUIDInfo = (uuid: string) => {
    if (!isValidUUID(uuid)) return null

    const parts = uuid.split("-")
    const version = parseInt(parts[2].charAt(0), 16)
    const variant = parseInt(parts[3].charAt(0), 16)

    return {
      version: version,
      variant: variant >= 8 ? "RFC 4122" : "Other",
      isNil: uuid === "00000000-0000-0000-0000-000000000000",
      isMax: uuid.toLowerCase() === "ffffffff-ffff-ffff-ffff-ffffffffffff",
    }
  }

  // Generate initial UUID
  React.useEffect(() => {
    if (!currentUUID) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const uuidInfo = currentUUID ? getUUIDInfo(currentUUID) : null

  const versionOptions = [
    { value: "v1", label: "Version 1", description: "Timestamp-based" },
    { value: "v4", label: "Version 4", description: "Random (recommended)" },
    { value: "nil", label: "Nil UUID", description: "All zeros" },
    { value: "max", label: "Max UUID", description: "All ones (0xF)" },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate UUIDs for your projects"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Generated UUID</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={currentUUID}
                  readOnly
                  className="h-12 pr-12 font-mono text-sm"
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  <CopyButton variant="ghost" text={currentUUID} />
                </div>
              </div>

              {/* UUID Info */}
              {uuidInfo && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <span className="ml-2 font-mono">
                      {uuidInfo.isNil
                        ? "Nil"
                        : uuidInfo.isMax
                          ? "Max"
                          : `v${uuidInfo.version}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Variant:</span>
                    <span className="ml-2 font-mono">{uuidInfo.variant}</span>
                  </div>
                </div>
              )}

              {/* Version Selector */}
              <div className="space-y-3">
                <h3 className="font-medium">UUID Version</h3>
                <div className="grid grid-cols-2 gap-2">
                  {versionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedVersion(option.value)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-colors",
                        selectedVersion === option.value
                          ? "border-primary bg-primary text-primary-foreground dark:bg-primary/50"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Generation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bulk Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label className="mb-2 block text-sm font-medium">
                    Number of UUIDs
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={bulkCount}
                    onChange={(e) =>
                      setBulkCount(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <Button onClick={generateBulkUUIDs} className="mt-6">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Generate and download multiple UUIDs as a text file
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {versionOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedVersion(option.value)
                    setTimeout(() => handleGenerate(), 100)
                  }}
                >
                  🆔 {option.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* UUID History */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent UUIDs</CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No recent UUIDs
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {history.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted/50 hover:bg-muted rounded border p-2 transition-colors"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {item.version.toUpperCase()}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 truncate font-mono text-xs">
                          {item.uuid}
                        </code>
                        <CopyButton text={item.uuid} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* UUID Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About UUIDs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Version 1</h4>
                <p className="text-muted-foreground">
                  Timestamp and MAC address based
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Version 4</h4>
                <p className="text-muted-foreground">
                  Random or pseudo-random (most common)
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Nil UUID</h4>
                <p className="text-muted-foreground">
                  Special UUID with all bits set to zero
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Max UUID</h4>
                <p className="text-muted-foreground">
                  Special UUID with all bits set to one
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

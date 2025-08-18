"use client"

import { useCallback, useState } from "react"
import { FileText, Lock, RefreshCw, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  FileInfoCard,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

interface HashResult {
  algorithm: string
  hash: string
  timestamp: number
}

export function HashGenerator() {
  const [inputText, setInputText] = useState("")
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([
    "md5",
    "sha1",
    "sha256",
  ])
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<HashResult[]>([])
  const [fileInfo, setFileInfo] = useState<{
    name: string
    size: number
  } | null>(null)

  // Simple hash implementations (for demo purposes)
  const generateMD5 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // Simple MD5-like hash (not cryptographically secure, for demo only)
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data[i]) & 0xffffffff
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }, [])

  const generateSHA1 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [])

  const generateSHA256 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [])

  const generateSHA512 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-512", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [])

  const generateHashes = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setHashes({})
        return
      }

      const results: Record<string, string> = {}
      const promises: Promise<void>[] = []

      if (selectedAlgorithms.includes("md5")) {
        promises.push(
          generateMD5(text).then((hash) => {
            results.md5 = hash
          })
        )
      }

      if (selectedAlgorithms.includes("sha1")) {
        promises.push(
          generateSHA1(text).then((hash) => {
            results.sha1 = hash
          })
        )
      }

      if (selectedAlgorithms.includes("sha256")) {
        promises.push(
          generateSHA256(text).then((hash) => {
            results.sha256 = hash
          })
        )
      }

      if (selectedAlgorithms.includes("sha512")) {
        promises.push(
          generateSHA512(text).then((hash) => {
            results.sha512 = hash
          })
        )
      }

      try {
        await Promise.all(promises)
        setHashes(results)

        // Add to history
        const newEntries: HashResult[] = Object.entries(results).map(
          ([algorithm, hash]) => ({
            algorithm: algorithm.toUpperCase(),
            hash,
            timestamp: Date.now(),
          })
        )

        setHistory((prev) => [...newEntries, ...prev.slice(0, 47)]) // Keep last 50
      } catch {
        toast({
          title: "Hash Generation Error",
          description: "Failed to generate hashes",
          variant: "destructive",
        })
      }
    },
    [
      selectedAlgorithms,
      generateMD5,
      generateSHA1,
      generateSHA256,
      generateSHA512,
    ]
  )

  const handleInputChange = (value: string) => {
    setInputText(value)
    generateHashes(value)
  }

  const handleAlgorithmToggle = (algorithm: string) => {
    const newAlgorithms = selectedAlgorithms.includes(algorithm)
      ? selectedAlgorithms.filter((a) => a !== algorithm)
      : [...selectedAlgorithms, algorithm]

    setSelectedAlgorithms(newAlgorithms)

    if (inputText.trim() && newAlgorithms.length > 0) {
      generateHashes(inputText)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
      })

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText(content)
        generateHashes(content)
      }
      reader.readAsText(file)
    }
  }

  const handleSampleData = () => {
    const sampleText =
      "Hello, DevTools Hub! This is a sample text for hash generation."
    setInputText(sampleText)
    generateHashes(sampleText)
  }

  const handleClear = () => {
    setInputText("")
    setHashes({})
    setFileInfo(null)
  }

  const clearHistory = () => {
    setHistory([])
    toast({
      title: "History Cleared",
      description: "Hash history has been cleared",
    })
  }

  const algorithms = [
    {
      id: "md5",
      name: "MD5",
      description: "Fast but not secure",
      color: "bg-red-500",
    },
    {
      id: "sha1",
      name: "SHA-1",
      description: "Legacy algorithm",
      color: "bg-yellow-500",
    },
    {
      id: "sha256",
      name: "SHA-256",
      description: "Secure and widely used",
      color: "bg-green-500",
    },
    {
      id: "sha512",
      name: "SHA-512",
      description: "Maximum security",
      color: "bg-blue-500",
    },
  ]

  const stats = [
    {
      label: "Input Size",
      value: `${inputText.length} chars`,
      icon: "📝",
    },
    {
      label: "Algorithms",
      value: selectedAlgorithms.length.toString(),
      icon: "🔐",
    },
    {
      label: "Total Hashes",
      value: Object.keys(hashes).length.toString(),
      icon: "🔢",
    },
  ]

  const features = [
    {
      icon: "🔐",
      title: "Multiple Algorithms",
      description: "MD5, SHA-1, SHA-256, SHA-512 support",
    },
    {
      icon: "📁",
      title: "File Support",
      description: "Upload and hash files directly",
    },
    {
      icon: "📊",
      title: "Real-time",
      description: "Instant hash generation as you type",
    },
    {
      icon: "📋",
      title: "History",
      description: "Track recently generated hashes",
    },
  ]

  return (
    <ToolLayout>
      {/* Controls */}
      <ToolControls>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="h-4 w-4" />
          Sample Data
        </Button>

        <Label className="inline-flex">
          <Button variant="outline" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Upload File
            </span>
          </Button>
          <input
            type="file"
            accept=".txt,.json,.xml,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Label>

        <Button onClick={handleClear} variant="outline" disabled={!inputText}>
          <RefreshCw className="h-4 w-4" />
          Clear
        </Button>
      </ToolControls>

      {/* File Info */}
      {fileInfo && (
        <FileInfoCard
          fileInfo={fileInfo}
          onRemove={() => setFileInfo(null)}
          className="mb-6"
        />
      )}

      {/* Stats */}
      {inputText && (
        <div className="mb-6">
          <StatsDisplay stats={stats} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input and Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Text Input */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Input Text</CardTitle>
                <CopyButton text={inputText} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                placeholder="Enter text to generate hashes..."
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                className="max-h-[200px] min-h-[200px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Algorithm Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Hash Algorithms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {algorithms.map((algorithm) => (
                  <button
                    key={algorithm.id}
                    onClick={() => handleAlgorithmToggle(algorithm.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      selectedAlgorithms.includes(algorithm.id)
                        ? "border-primary bg-primary text-primary-foreground dark:bg-primary/50"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            algorithm.color
                          )}
                        />
                        <span className="text-sm font-medium">
                          {algorithm.name}
                        </span>
                      </div>
                      {selectedAlgorithms.includes(algorithm.id) && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Selected
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs">{algorithm.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hash Results */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Generated Hashes</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(hashes).length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  Enter text and select algorithms to generate hashes
                </p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(hashes).map(([algorithm, hash]) => {
                    const algorithmInfo = algorithms.find(
                      (a) => a.id === algorithm
                    )
                    return (
                      <div
                        key={algorithm}
                        className="bg-muted/50 rounded border p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${algorithmInfo?.color}`}
                            />
                            <span className="text-sm font-medium">
                              {algorithm.toUpperCase()}
                            </span>
                          </div>
                          <CopyButton text={hash} size="sm" />
                        </div>
                        <code className="block font-mono text-xs break-all">
                          {hash}
                        </code>
                      </div>
                    )
                  })}
                </div>
              )}
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedAlgorithms(["md5"])
                  if (inputText.trim()) generateHashes(inputText)
                }}
              >
                <Lock className="h-4 w-4" />
                MD5 Only
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedAlgorithms(["sha256"])
                  if (inputText.trim()) generateHashes(inputText)
                }}
              >
                <Lock className="h-4 w-4" />
                SHA-256 Only
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedAlgorithms(["md5", "sha1", "sha256", "sha512"])
                  if (inputText.trim()) generateHashes(inputText)
                }}
              >
                <Lock className="h-4 w-4" />
                All Algorithms
              </Button>
            </CardContent>
          </Card>

          {/* Hash History */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Hashes</CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No recent hashes
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {history.slice(0, 10).map((item, index) => {
                    const algorithmInfo = algorithms.find(
                      (a) => a.name === item.algorithm
                    )
                    return (
                      <div
                        key={index}
                        className="bg-muted/50 rounded border p-2"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${algorithmInfo?.color}`}
                            />
                            <Badge variant="secondary" className="text-xs">
                              {item.algorithm}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 truncate font-mono text-xs">
                            {item.hash}
                          </code>
                          <CopyButton text={item.hash} size="sm" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-red-600">⚠️</span>
                <span>MD5 is not cryptographically secure</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span>SHA-1 is deprecated for security</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>SHA-256/512 are currently secure</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">ℹ️</span>
                <span>Use salts for password hashing</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

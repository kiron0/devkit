"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { DevicePreset, devicePresets } from "@/utils"
import {
  ExternalLink,
  Monitor,
  RefreshCw,
  RotateCcw,
  Smartphone,
} from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FeatureGrid, ToolLayout } from "@/components/common"

export function ResponsiveTestingTool() {
  const [url, setUrl] = useState("https://example.com")
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(
    devicePresets[0]
  )
  const [customWidth, setCustomWidth] = useState(375)
  const [customHeight, setCustomHeight] = useState(667)
  const [isPortrait, setIsPortrait] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getCurrentDimensions = useCallback(() => {
    if (isCustom) {
      return isPortrait
        ? { width: customWidth, height: customHeight }
        : { width: customHeight, height: customWidth }
    }

    return isPortrait
      ? { width: selectedDevice.width, height: selectedDevice.height }
      : { width: selectedDevice.height, height: selectedDevice.width }
  }, [selectedDevice, customWidth, customHeight, isPortrait, isCustom])

  const handleDeviceChange = (deviceName: string) => {
    if (deviceName === "custom") {
      setIsCustom(true)
      return
    }

    const device = devicePresets.find((d) => d.name === deviceName)
    if (device) {
      setSelectedDevice(device)
      setIsCustom(false)
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setError(null)

    // Trigger iframe reload
    const iframe = document.getElementById(
      "preview-iframe"
    ) as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }

    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleLoadUrl = () => {
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    // Ensure URL has protocol
    let fullUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = "https://" + url
    }

    setCurrentUrl(fullUrl)
    setError(null)
    setIsLoading(true)

    toast({
      title: "Loading Website",
      description: `Loading ${fullUrl} in ${getCurrentDimensions().width}×${getCurrentDimensions().height}`,
    })

    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleToggleOrientation = () => {
    setIsPortrait(!isPortrait)

    toast({
      title: "Orientation Changed",
      description: `Switched to ${!isPortrait ? "Portrait" : "Landscape"} mode`,
    })
  }

  const handleOpenInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, "_blank")
    }
  }

  const dimensions = getCurrentDimensions()

  const stats = [
    { label: "Width", value: `${dimensions.width}px` },
    { label: "Height", value: `${dimensions.height}px` },
    { label: "Orientation", value: isPortrait ? "Portrait" : "Landscape" },
    { label: "Device", value: isCustom ? "Custom" : selectedDevice.name },
  ]

  // Show mobile restriction message
  if (isMobile) {
    return (
      <ToolLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Smartphone className="text-muted-foreground h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Desktop Only Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Responsive Testing Tool is designed for desktop and tablet
                devices to provide the best experience for testing website
                responsiveness across different screen sizes.
              </p>
              <div className="text-muted-foreground space-y-2 text-sm">
                <p>
                  📱 <strong>Mobile devices</strong> are too small to
                  effectively preview other device sizes
                </p>
                <p>
                  💻 <strong>Desktop/Tablet</strong> provides optimal testing
                  experience
                </p>
                <p>
                  🔄 <strong>Orientation switching</strong> and device presets
                  work best on larger screens
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/tools"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  Browse Other Tools
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    )
  }

  return (
    <ToolLayout>
      <div className="space-y-6">
        {/* URL Input and Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Website URL & Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLoadUrl()}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleLoadUrl} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Load"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={!currentUrl}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOpenInNewTab}
                  disabled={!currentUrl}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Selection and Dimensions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Device & Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Selector */}
              <div className="space-y-2">
                <Label>Device Preset</Label>
                <Select
                  value={isCustom ? "custom" : selectedDevice.name}
                  onValueChange={handleDeviceChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Dimensions</SelectItem>

                    {/* Mobile Devices */}
                    <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                      📱 Mobile Devices
                    </div>
                    {devicePresets
                      .filter((d) => d.category === "mobile")
                      .map((device) => (
                        <SelectItem key={device.name} value={device.name}>
                          {device.icon} {device.name} ({device.width}×
                          {device.height})
                        </SelectItem>
                      ))}

                    {/* Tablets */}
                    <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                      📟 Tablets
                    </div>
                    {devicePresets
                      .filter((d) => d.category === "tablet")
                      .map((device) => (
                        <SelectItem key={device.name} value={device.name}>
                          {device.icon} {device.name} ({device.width}×
                          {device.height})
                        </SelectItem>
                      ))}

                    {/* Desktop */}
                    <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
                      🖥️ Desktop
                    </div>
                    {devicePresets
                      .filter((d) => d.category === "desktop")
                      .map((device) => (
                        <SelectItem key={device.name} value={device.name}>
                          {device.icon} {device.name} ({device.width}×
                          {device.height})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Dimensions */}
              {isCustom && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="custom-width">Width (px)</Label>
                    <Input
                      id="custom-width"
                      type="number"
                      min="200"
                      max="4000"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-height">Height (px)</Label>
                    <Input
                      id="custom-height"
                      type="number"
                      min="200"
                      max="4000"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Orientation Toggle */}
              <div className="flex items-center justify-between">
                <Label>Orientation</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleOrientation}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {isPortrait ? "Portrait" : "Landscape"}
                </Button>
              </div>

              {/* Current Dimensions Display */}
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {dimensions.width} × {dimensions.height}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Width: {dimensions.width}px • Height: {dimensions.height}px
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-2">
                {stats.map((stat, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      {stat.label}:
                    </span>
                    <Badge variant="secondary">{stat.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Website Preview</span>
                {currentUrl && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {currentUrl}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className="overflow-hidden rounded-lg border bg-white shadow-lg"
                  style={{
                    width: Math.min(dimensions.width, 800),
                    height: Math.min(dimensions.height, 600),
                  }}
                >
                  {currentUrl ? (
                    <iframe
                      id="preview-iframe"
                      src={currentUrl}
                      width="100%"
                      height="100%"
                      className="border-0"
                      title="Website Preview"
                      loading="lazy"
                      onLoad={() => setIsLoading(false)}
                      onError={() => {
                        setError(
                          "This site cannot be previewed because it blocks embedding in an iframe (X-Frame-Options or Content-Security-Policy). Try another site."
                        )
                        setIsLoading(false)
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center">
                      <div className="space-y-2 text-center">
                        <Monitor className="mx-auto h-12 w-12 opacity-50" />
                        <p>Enter a URL above to preview</p>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <div className="space-y-2 text-center">
                        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                        <p className="text-muted-foreground text-sm">
                          Loading website...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border-destructive/20 mt-4 rounded-lg border p-3">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats and Features */}
        <FeatureGrid
          features={[
            {
              icon: "📱",
              title: "Mobile Testing",
              description: "Test on various mobile device sizes",
            },
            {
              icon: "📟",
              title: "Tablet Support",
              description: "Preview on tablet devices and orientations",
            },
            {
              icon: "🖥️",
              title: "Desktop Sizes",
              description: "Test desktop and large screen layouts",
            },
            {
              icon: "🔄",
              title: "Orientation Toggle",
              description: "Switch between portrait and landscape",
            },
            {
              icon: "📐",
              title: "Custom Dimensions",
              description: "Set custom width and height values",
            },
            {
              icon: "🔗",
              title: "External Links",
              description: "Open in new tab for full testing",
            },
          ]}
        />
      </div>
    </ToolLayout>
  )
}

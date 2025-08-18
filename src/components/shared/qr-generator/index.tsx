"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import {
  Download,
  Link as LinkIcon,
  Mail,
  Phone,
  QrCode,
  RotateCcw,
  Smartphone,
  Wifi,
} from "lucide-react"
import QRCode from "qrcode"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface QROptions {
  size: number
  errorCorrection: "L" | "M" | "Q" | "H"
  margin: number
  darkColor: string
  lightColor: string
}

export function QRGenerator() {
  const [inputText, setInputText] = useState("")
  const [qrType, setQrType] = useState("text")
  const [qrOptions, setQrOptions] = useState<QROptions>({
    size: 256,
    errorCorrection: "M",
    margin: 4,
    darkColor: "#000000",
    lightColor: "#FFFFFF",
  })
  const [qrDataURL, setQrDataURL] = useState("")
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  })
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
    website: "",
  })
  const { toast } = useToast()

  // Generate real QR code using qrcode library
  const generateQRCode = useCallback(
    async (text: string, options: QROptions) => {
      if (!text.trim()) {
        setQrDataURL("")
        return
      }

      try {
        const qrDataURL = await QRCode.toDataURL(text, {
          width: options.size,
          margin: options.margin,
          color: {
            dark: options.darkColor,
            light: options.lightColor,
          },
          errorCorrectionLevel: options.errorCorrection,
        })
        setQrDataURL(qrDataURL)
      } catch (error) {
        console.error("Error generating QR code:", error)
        setQrDataURL("")
        toast({
          title: "Error",
          description: "Failed to generate QR code. Please check your input.",
          variant: "destructive",
        })
      }
    },
    [toast]
  )

  const getFormattedText = useCallback(() => {
    switch (qrType) {
      case "url":
        const url = inputText.startsWith("http")
          ? inputText
          : `https://${inputText}`
        return url
      case "email":
        return `mailto:${inputText}`
      case "phone":
        return `tel:${inputText}`
      case "sms":
        return `sms:${inputText}`
      case "wifi":
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? "true" : "false"};;`
      case "contact":
        return `MECARD:N:${contactData.name};TEL:${contactData.phone};EMAIL:${contactData.email};ORG:${contactData.organization};URL:${contactData.website};;`
      default:
        return inputText
    }
  }, [qrType, inputText, wifiData, contactData])

  const handleTextChange = (value: string) => {
    setInputText(value)
  }

  const handleTypeChange = (type: string) => {
    setQrType(type)
  }

  const handleOptionsChange = (newOptions: Partial<QROptions>) => {
    const updatedOptions = { ...qrOptions, ...newOptions }
    setQrOptions(updatedOptions)
  }

  // Effect to regenerate QR code when any relevant data changes
  useEffect(() => {
    const formattedText = getFormattedText()
    if (formattedText.trim()) {
      generateQRCode(formattedText, qrOptions)
    } else {
      setQrDataURL("")
    }
  }, [
    inputText,
    qrType,
    wifiData,
    contactData,
    qrOptions,
    generateQRCode,
    getFormattedText,
  ])

  const handleDownload = () => {
    if (!qrDataURL) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrDataURL
    link.click()

    toast({
      title: "Downloaded",
      description: "QR code image has been downloaded",
    })
  }

  const handleSampleData = () => {
    const samples = {
      text: "Hello, DevTools Hub!",
      url: "https://devtools-hub.com",
      email: "hello@devtools-hub.com",
      phone: "+1234567890",
      sms: "+1234567890",
    }

    const sampleText = samples[qrType as keyof typeof samples] || samples.text
    setInputText(sampleText)
  }

  const handleClear = () => {
    setInputText("")
    setQrDataURL("")
    setWifiData({ ssid: "", password: "", security: "WPA", hidden: false })
    setContactData({
      name: "",
      phone: "",
      email: "",
      organization: "",
      website: "",
    })
  }

  const qrTypes = [
    { id: "text", name: "Text", icon: "📝", description: "Plain text" },
    { id: "url", name: "URL", icon: "🔗", description: "Website link" },
    { id: "email", name: "Email", icon: "📧", description: "Email address" },
    { id: "phone", name: "Phone", icon: "📞", description: "Phone number" },
    { id: "sms", name: "SMS", icon: "💬", description: "Text message" },
    { id: "wifi", name: "WiFi", icon: "📶", description: "WiFi credentials" },
    { id: "contact", name: "Contact", icon: "👤", description: "Contact card" },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={handleSampleData} variant="outline">
          <QrCode className="h-4 w-4" />
          Sample Data
        </Button>

        <Button
          onClick={handleClear}
          variant="outline"
          disabled={!inputText && !qrDataURL}
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>

        {qrDataURL && (
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="space-y-6 lg:col-span-2">
          {/* QR Type Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">QR Code Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {qrTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id)}
                    className={cn(
                      "rounded-lg border p-2 text-center transition-colors",
                      qrType === type.id
                        ? "border-primary bg-primary dark:bg-primary/50"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="mb-1 text-lg">{type.icon}</div>
                    <div className="text-xs font-medium">{type.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          {qrType === "wifi" ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  <Wifi className="inline h-4 w-4" />
                  WiFi Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Network Name (SSID)
                  </Label>
                  <Input
                    placeholder="WiFi Network Name"
                    value={wifiData.ssid}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, ssid: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="WiFi Password"
                    value={wifiData.password}
                    onChange={(e) =>
                      setWifiData({ ...wifiData, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Security Type
                  </Label>
                  <div className="flex gap-2">
                    {["WPA", "WEP", "nopass"].map((security) => (
                      <Button
                        key={security}
                        variant={
                          wifiData.security === security ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setWifiData({ ...wifiData, security })}
                      >
                        {security === "nopass" ? "Open" : security}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : qrType === "contact" ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  <Smartphone className="inline h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={contactData.name}
                  onChange={(e) =>
                    setContactData({ ...contactData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={contactData.phone}
                  onChange={(e) =>
                    setContactData({ ...contactData, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Email Address"
                  value={contactData.email}
                  onChange={(e) =>
                    setContactData({ ...contactData, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Organization"
                  value={contactData.organization}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      organization: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Website"
                  value={contactData.website}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      website: e.target.value,
                    })
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Content</CardTitle>
                  <CopyButton text={inputText} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  placeholder={
                    qrType === "url"
                      ? "https://example.com"
                      : qrType === "email"
                        ? "user@example.com"
                        : qrType === "phone"
                          ? "+1234567890"
                          : "Enter your text here..."
                  }
                  value={inputText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}

          {/* QR Code Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">QR Code Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Size: {qrOptions.size}px
                  </Label>
                  <Slider
                    min={128}
                    max={512}
                    step={32}
                    value={[qrOptions.size]}
                    onValueChange={(values) =>
                      handleOptionsChange({ size: values[0] })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Error Correction
                  </Label>
                  <div className="flex gap-1">
                    {(["L", "M", "Q", "H"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={
                          qrOptions.errorCorrection === level
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleOptionsChange({ errorCorrection: level })
                        }
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Dark Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrOptions.darkColor}
                      onChange={(e) =>
                        handleOptionsChange({ darkColor: e.target.value })
                      }
                      className="h-8 w-16 cursor-pointer rounded border"
                    />
                    <Input
                      value={qrOptions.darkColor}
                      onChange={(e) =>
                        handleOptionsChange({ darkColor: e.target.value })
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Light Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrOptions.lightColor}
                      onChange={(e) =>
                        handleOptionsChange({ lightColor: e.target.value })
                      }
                      className="h-8 w-16 cursor-pointer rounded border"
                    />
                    <Input
                      value={qrOptions.lightColor}
                      onChange={(e) =>
                        handleOptionsChange({ lightColor: e.target.value })
                      }
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">QR Code Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {qrDataURL ? (
                <div className="space-y-4 text-center">
                  <div className="inline-block">
                    <Image
                      src={qrDataURL}
                      width={qrOptions.size}
                      height={qrOptions.size}
                      alt="Generated QR Code"
                      className="h-auto max-w-full rounded-lg"
                      style={{
                        width: Math.min(qrOptions.size, 256),
                        height: Math.min(qrOptions.size, 256),
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {qrOptions.size}x{qrOptions.size}px
                    </Badge>
                    <div className="text-muted-foreground text-xs">
                      Error Correction: {qrOptions.errorCorrection}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <QrCode className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="text-muted-foreground text-sm">
                    Enter content to generate QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
                  setQrType("url")
                  setInputText("https://github.com")
                }}
              >
                <LinkIcon className="h-4 w-4" />
                GitHub URL
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setQrType("email")
                  setInputText("hello@example.com")
                }}
              >
                <Mail className="h-4 w-4" />
                Email Contact
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setQrType("phone")
                  setInputText("+1234567890")
                }}
              >
                <Phone className="h-4 w-4" />
                Phone Number
              </Button>
            </CardContent>
          </Card>

          {/* QR Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">About QR Codes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Error Correction</h4>
                <p className="text-muted-foreground text-xs">
                  L: ~7% | M: ~15% | Q: ~25% | H: ~30%
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Capacity</h4>
                <p className="text-muted-foreground text-xs">
                  Up to 4,296 alphanumeric characters
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Compatibility</h4>
                <p className="text-muted-foreground text-xs">
                  Works with all QR code readers
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

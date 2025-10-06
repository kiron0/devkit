"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ImagePreview from "next/image"
import { Download, RotateCcw, Upload, X } from "lucide-react"
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  Gradient,
} from "qr-code-styling"
import type { Area, Point } from "react-easy-crop"
import Cropper from "react-easy-crop"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { GradientControls } from "./gradient-controls"

interface QROptions {
  width: number
  height: number
  margin: number
  data: string
  image?: string
  dotsOptions: {
    type: DotType
    color: string
    gradient?: Gradient
  }
  cornersSquareOptions: {
    type: CornerSquareType
    color: string
    gradient?: Gradient
  }
  cornersDotOptions: {
    type: CornerDotType
    color: string
    gradient?: Gradient
  }
  backgroundOptions: {
    color: string
    gradient?: Gradient
  }
  imageOptions?: {
    hideBackgroundDots: boolean
    imageSize: number
    margin: number
    crossOrigin?: string
  }
  qrOptions: {
    errorCorrectionLevel: ErrorCorrectionLevel
  }
}

const DEFAULT_OPTIONS: QROptions = {
  width: 300,
  height: 300,
  margin: 0,
  data: "https://kiron.dev",
  dotsOptions: {
    type: "dots",
    color: "#000000",
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000",
  },
  cornersDotOptions: {
    type: "dot",
    color: "#000000",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 5,
  },
  qrOptions: {
    errorCorrectionLevel: "H",
  },
}

export function QRGenerator() {
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS)
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)
  const [logoSrc, setLogoSrc] = useState<string>("")
  const [croppedImage, setCroppedImage] = useState<string>("")
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [useGradientDots, setUseGradientDots] = useState(false)
  const [useGradientCorners, setUseGradientCorners] = useState(false)
  const [useGradientBackground, setUseGradientBackground] = useState(false)
  const [useGradientCornerDots, setUseGradientCornerDots] = useState(false)
  const [roundLogo, setRoundLogo] = useState(false)
  const [logoRadiusPercent, setLogoRadiusPercent] = useState(30) // 0-50%

  const qrRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Render cropped logo with optional rounded-rectangle mask
  const renderCroppedLogo = useCallback(
    async (
      source: string,
      area: Area,
      applyRounded: boolean,
      radiusPercent: number
    ): Promise<string> => {
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Logo load failed"))
        img.src = source
      })

      const targetW = Math.max(1, Math.round(area.width))
      const targetH = Math.max(1, Math.round(area.height))
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas context missing")
      canvas.width = targetW
      canvas.height = targetH

      if (applyRounded) {
        const minSide = Math.min(targetW, targetH)
        const r = Math.min(minSide * (radiusPercent / 100), minSide / 2)
        const roundedPath = (c: CanvasRenderingContext2D) => {
          const rr = Math.max(0, Math.min(r, Math.min(targetW, targetH) / 2))
          c.beginPath()
          c.moveTo(rr, 0)
          c.lineTo(targetW - rr, 0)
          c.quadraticCurveTo(targetW, 0, targetW, rr)
          c.lineTo(targetW, targetH - rr)
          c.quadraticCurveTo(targetW, targetH, targetW - rr, targetH)
          c.lineTo(rr, targetH)
          c.quadraticCurveTo(0, targetH, 0, targetH - rr)
          c.lineTo(0, rr)
          c.quadraticCurveTo(0, 0, rr, 0)
          c.closePath()
        }
        ctx.save()
        roundedPath(ctx)
        ctx.clip()
        ctx.drawImage(
          img,
          area.x,
          area.y,
          area.width,
          area.height,
          0,
          0,
          targetW,
          targetH
        )
        ctx.restore()
      } else {
        ctx.drawImage(
          img,
          area.x,
          area.y,
          area.width,
          area.height,
          0,
          0,
          targetW,
          targetH
        )
      }

      return canvas.toDataURL("image/png")
    },
    []
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const qr = new QRCodeStyling(DEFAULT_OPTIONS)
    setQrCode(qr)

    if (qrRef.current) {
      qrRef.current.innerHTML = ""
      qr.append(qrRef.current)
    }
  }, [])

  useEffect(() => {
    if (!qrCode) return
    qrCode.update(options)
  }, [options, qrCode])

  const handleDataChange = (value: string) => {
    setOptions((prev) => ({ ...prev, data: value }))
  }

  const handleSizeChange = (value: number) => {
    setOptions((prev) => ({
      ...prev,
      width: value,
      height: value,
    }))
  }

  const handleMarginChange = (value: number) => {
    setOptions((prev) => ({ ...prev, margin: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setLogoSrc(reader.result as string)
      setShowCropDialog(true)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createCroppedImage = async () => {
    if (!logoSrc || !croppedAreaPixels) return

    try {
      const croppedImageUrl = await renderCroppedLogo(
        logoSrc,
        croppedAreaPixels,
        roundLogo,
        logoRadiusPercent
      )
      setCroppedImage(croppedImageUrl)
      setOptions((prev) => ({ ...prev, image: croppedImageUrl }))
      setShowCropDialog(false)

      toast({
        title: "Logo added",
        description: "Logo has been cropped and added to QR code",
      })
    } catch (error) {
      console.error("Error cropping image:", error)
      toast({
        title: "Error",
        description: "Failed to crop image",
        variant: "destructive",
      })
    }
  }

  // Regenerate masked logo when rounding toggles or radius changes after crop
  useEffect(() => {
    let cancelled = false
    const update = async () => {
      if (!logoSrc || !croppedAreaPixels || !croppedImage) return
      try {
        const url = await renderCroppedLogo(
          logoSrc,
          croppedAreaPixels,
          roundLogo,
          logoRadiusPercent
        )
        if (!cancelled) {
          setCroppedImage(url)
          setOptions((prev) => ({ ...prev, image: url }))
        }
      } catch {
        // ignore
      }
    }
    update()
    return () => {
      cancelled = true
    }
  }, [
    roundLogo,
    logoRadiusPercent,
    logoSrc,
    croppedAreaPixels,
    croppedImage,
    renderCroppedLogo,
  ])

  const removeLogo = () => {
    setLogoSrc("")
    setCroppedImage("")
    // Update state so future renders know logo is removed
    setOptions((prev) => ({
      ...prev,
      image: "",
      imageOptions: prev.imageOptions
        ? { ...prev.imageOptions, hideBackgroundDots: false }
        : undefined,
    }))
    // Proactively clear image on the underlying instance to avoid stale logo
    if (qrCode) {
      try {
        qrCode.update({ image: "" } as unknown as QROptions)
      } catch {
        // ignore
      }
    }
  }

  const handleDownload = async (format: "png" | "jpg") => {
    if (!qrCode) return

    try {
      if (format === "png") {
        await qrCode.download({
          name: `qr-code-${Date.now()}`,
          extension: "png",
        })
      } else {
        await qrCode.download({
          name: `qr-code-${Date.now()}`,
          extension: "jpeg",
        })
      }

      toast({
        title: "Downloaded",
        description: `QR code downloaded as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    setOptions(DEFAULT_OPTIONS)
    removeLogo()
    setUseGradientDots(false)
    setUseGradientCorners(false)
    setUseGradientBackground(false)
  }

  const updateDotsGradient = (
    colorStops: Array<{ offset: number; color: string }>
  ) => {
    setOptions((prev) => ({
      ...prev,
      dotsOptions: {
        ...prev.dotsOptions,
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops,
        },
      },
    }))
  }

  const updateCornersGradient = (
    colorStops: Array<{ offset: number; color: string }>
  ) => {
    setOptions((prev) => ({
      ...prev,
      cornersSquareOptions: {
        ...prev.cornersSquareOptions,
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops,
        },
      },
    }))
  }

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout
      title="QR Code Generator — Custom Logo, Styling & Export"
      description="Build branded QR codes with dot styling, color control, background customization, image cropping, and logo support — all in your browser."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={handleClear} variant="outline">
          <RotateCcw className="h-4 w-4" />
          Clear All
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />

        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
          <Upload className="h-4 w-4" />
          Upload Logo
        </Button>

        <Button onClick={() => handleDownload("png")} variant="default">
          <Download className="h-4 w-4" />
          PNG
        </Button>

        <Button onClick={() => handleDownload("jpg")} variant="outline">
          <Download className="h-4 w-4" />
          JPG
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Data</CardTitle>
              <CardDescription>
                Enter the content to encode in your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="https://kiron.dev"
                value={options.data}
                onChange={(e) => handleDataChange(e.target.value)}
                className="min-h-[80px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Main Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Size (px): {options.width}</Label>
                <Slider
                  min={200}
                  max={800}
                  step={50}
                  value={[options.width]}
                  onValueChange={(v) => handleSizeChange(v[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Margin: {options.margin}</Label>
                <Slider
                  min={0}
                  max={50}
                  step={5}
                  value={[options.margin]}
                  onValueChange={(v) => handleMarginChange(v[0])}
                />
              </div>
            </CardContent>
          </Card>

          {croppedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Logo Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <ImagePreview
                    src={croppedImage}
                    alt="Logo"
                    className="h-16 w-16 rounded border object-cover"
                    width={64}
                    height={64}
                  />
                  <Button variant="destructive" size="sm" onClick={removeLogo}>
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Round logo</Label>
                  <Switch
                    checked={roundLogo}
                    onCheckedChange={(checked) => setRoundLogo(!!checked)}
                  />
                </div>

                {roundLogo && (
                  <div className="space-y-2">
                    <Label>Logo Corner Radius: {logoRadiusPercent}%</Label>
                    <Slider
                      min={0}
                      max={50}
                      step={1}
                      value={[logoRadiusPercent]}
                      onValueChange={(v) => setLogoRadiusPercent(v[0])}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between space-y-2">
                  <Label>Hide dots behind image</Label>
                  <Switch
                    checked={options.imageOptions?.hideBackgroundDots ?? true}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({
                        ...prev,
                        imageOptions: {
                          ...prev.imageOptions!,
                          hideBackgroundDots: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Image Size:{" "}
                    {((options.imageOptions?.imageSize ?? 0.4) * 100).toFixed(
                      0
                    )}
                    %
                  </Label>
                  <Slider
                    min={0.2}
                    max={0.6}
                    step={0.05}
                    value={[options.imageOptions?.imageSize ?? 0.4]}
                    onValueChange={(v) =>
                      setOptions((prev) => ({
                        ...prev,
                        imageOptions: {
                          ...prev.imageOptions!,
                          imageSize: v[0],
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Image Padding: {options.imageOptions?.margin ?? 5}px
                  </Label>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={[options.imageOptions?.margin ?? 5]}
                    onValueChange={(v) =>
                      setOptions((prev) => ({
                        ...prev,
                        imageOptions: {
                          ...prev.imageOptions!,
                          margin: v[0],
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Dot Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Shape</Label>
                <Select
                  value={options.dotsOptions.type}
                  onValueChange={(value) =>
                    setOptions((prev) => ({
                      ...prev,
                      dotsOptions: {
                        ...prev.dotsOptions,
                        type: value as DotType,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dot shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="classy">Classy</SelectItem>
                    <SelectItem value="classy-rounded">
                      Classy Rounded
                    </SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-2">
                <Label>Use Gradient</Label>
                <Switch
                  checked={useGradientDots}
                  onCheckedChange={(checked) => {
                    setUseGradientDots(checked)
                    if (!checked) {
                      setOptions((prev) => ({
                        ...prev,
                        dotsOptions: {
                          ...prev.dotsOptions,
                          gradient: undefined,
                        },
                      }))
                    } else {
                      updateDotsGradient([
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#666666" },
                      ])
                    }
                  }}
                />
              </div>

              {useGradientDots ? (
                <GradientControls
                  gradient={options.dotsOptions.gradient}
                  onChange={(g) =>
                    setOptions((prev) => ({
                      ...prev,
                      dotsOptions: {
                        ...prev.dotsOptions,
                        gradient: g,
                      },
                    }))
                  }
                  defaultStart="#000000"
                  defaultEnd="#666666"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Label className="min-w-20">Color</Label>
                  <input
                    type="color"
                    value={options.dotsOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        dotsOptions: {
                          ...prev.dotsOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-20 cursor-pointer rounded border"
                  />
                  <Input
                    value={options.dotsOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        dotsOptions: {
                          ...prev.dotsOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corner Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Square Shape</Label>
                <Select
                  value={options.cornersSquareOptions.type}
                  onValueChange={(value) =>
                    setOptions((prev) => ({
                      ...prev,
                      cornersSquareOptions: {
                        ...prev.cornersSquareOptions,
                        type: value as CornerSquareType,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select square shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-2">
                <Label>Use Gradient</Label>
                <Switch
                  checked={useGradientCorners}
                  onCheckedChange={(checked) => {
                    setUseGradientCorners(checked)
                    if (!checked) {
                      setOptions((prev) => ({
                        ...prev,
                        cornersSquareOptions: {
                          ...prev.cornersSquareOptions,
                          gradient: undefined,
                        },
                      }))
                    } else {
                      updateCornersGradient([
                        { offset: 0, color: "#000000" },
                        { offset: 1, color: "#666666" },
                      ])
                    }
                  }}
                />
              </div>

              {useGradientCorners ? (
                <GradientControls
                  gradient={options.cornersSquareOptions.gradient}
                  onChange={(g) =>
                    setOptions((prev) => ({
                      ...prev,
                      cornersSquareOptions: {
                        ...prev.cornersSquareOptions,
                        gradient: g,
                      },
                    }))
                  }
                  defaultStart="#000000"
                  defaultEnd="#666666"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Label className="min-w-20">Color</Label>
                  <input
                    type="color"
                    value={options.cornersSquareOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        cornersSquareOptions: {
                          ...prev.cornersSquareOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-20 cursor-pointer rounded border"
                  />
                  <Input
                    value={options.cornersSquareOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        cornersSquareOptions: {
                          ...prev.cornersSquareOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Dot Shape</Label>
                <Select
                  value={options.cornersDotOptions.type}
                  onValueChange={(value) =>
                    setOptions((prev) => ({
                      ...prev,
                      cornersDotOptions: {
                        ...prev.cornersDotOptions,
                        type: value as CornerDotType,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dot shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-2">
                <Label>Use Gradient</Label>
                <Switch
                  checked={useGradientCornerDots}
                  onCheckedChange={(checked) => {
                    setUseGradientCornerDots(checked)
                    if (!checked) {
                      setOptions((prev) => ({
                        ...prev,
                        cornersDotOptions: {
                          ...prev.cornersDotOptions,
                          gradient: undefined,
                        },
                      }))
                    } else {
                      setOptions((prev) => ({
                        ...prev,
                        cornersDotOptions: {
                          ...prev.cornersDotOptions,
                          gradient: {
                            type: "linear",
                            rotation: 0,
                            colorStops: [
                              { offset: 0, color: "#000000" },
                              { offset: 1, color: "#666666" },
                            ],
                          },
                        },
                      }))
                    }
                  }}
                />
              </div>

              {useGradientCornerDots ? (
                <GradientControls
                  label="Dot Gradient"
                  gradient={options.cornersDotOptions.gradient}
                  onChange={(g) =>
                    setOptions((prev) => ({
                      ...prev,
                      cornersDotOptions: {
                        ...prev.cornersDotOptions,
                        gradient: g,
                      },
                    }))
                  }
                  defaultStart="#000000"
                  defaultEnd="#666666"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Label className="min-w-20">Color</Label>
                  <input
                    type="color"
                    value={options.cornersDotOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        cornersDotOptions: {
                          ...prev.cornersDotOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-20 cursor-pointer rounded border"
                  />
                  <Input
                    value={options.cornersDotOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        cornersDotOptions: {
                          ...prev.cornersDotOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <Label>Use Gradient</Label>
                <Switch
                  checked={useGradientBackground}
                  onCheckedChange={(checked) => {
                    setUseGradientBackground(checked)
                    if (!checked) {
                      setOptions((prev) => ({
                        ...prev,
                        backgroundOptions: {
                          ...prev.backgroundOptions,
                          gradient: undefined,
                        },
                      }))
                    } else {
                      setOptions((prev) => ({
                        ...prev,
                        backgroundOptions: {
                          ...prev.backgroundOptions,
                          gradient: {
                            type: "linear",
                            rotation: 0,
                            colorStops: [
                              { offset: 0, color: "#ffffff" },
                              { offset: 1, color: "#f0f0f0" },
                            ],
                          },
                        },
                      }))
                    }
                  }}
                />
              </div>

              {useGradientBackground ? (
                <GradientControls
                  gradient={options.backgroundOptions.gradient}
                  onChange={(g) =>
                    setOptions((prev) => ({
                      ...prev,
                      backgroundOptions: {
                        ...prev.backgroundOptions,
                        gradient: g,
                      },
                    }))
                  }
                  defaultStart="#ffffff"
                  defaultEnd="#f0f0f0"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Label className="min-w-20">Color</Label>
                  <input
                    type="color"
                    value={options.backgroundOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        backgroundOptions: {
                          ...prev.backgroundOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="h-10 w-20 cursor-pointer rounded border"
                  />
                  <Input
                    value={options.backgroundOptions.color}
                    onChange={(e) =>
                      setOptions((prev) => ({
                        ...prev,
                        backgroundOptions: {
                          ...prev.backgroundOptions,
                          color: e.target.value,
                        },
                      }))
                    }
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["L", "M", "Q", "H"] as ErrorCorrectionLevel[]).map(
                    (level) => (
                      <Button
                        key={level}
                        variant={
                          options.qrOptions.errorCorrectionLevel === level
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setOptions((prev) => ({
                            ...prev,
                            qrOptions: {
                              ...prev.qrOptions,
                              errorCorrectionLevel: level,
                            },
                          }))
                        }
                      >
                        {level}
                      </Button>
                    )
                  )}
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  L: ~7% | M: ~15% | Q: ~25% | H: ~30% recovery
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-16 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Preview & Export</CardTitle>
            </CardHeader>
            <CardContent>
              {qrRef ? (
                <div
                  ref={qrRef}
                  className="bg-muted/30 flex items-center justify-center overflow-hidden rounded-md border p-4"
                />
              ) : (
                <div className="bg-muted/30 flex items-center justify-center overflow-hidden rounded-md border p-4">
                  <p className="text-muted-foreground text-xs">
                    No QR code generated
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Error Correction Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <Badge variant="outline" className="mb-1">
                    L (Low)
                  </Badge>
                  <p className="text-muted-foreground text-xs">
                    Recovers ~7% of data, ideal for clean environments
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    M (Medium)
                  </Badge>
                  <p className="text-muted-foreground text-xs">
                    Recovers ~15% of data, balanced choice for most uses
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    Q (Quartile)
                  </Badge>
                  <p className="text-muted-foreground text-xs">
                    Recovers ~25% of data, better tolerance for damage
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    H (High)
                  </Badge>
                  <p className="text-muted-foreground text-xs">
                    Recovers ~30% of data, recommended with logo or damage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Logo</DialogTitle>
            <DialogDescription>
              Adjust the crop area for your logo
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-96 w-full">
            {logoSrc && (
              <Cropper
                image={logoSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCropDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createCroppedImage}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator className="my-12" />

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="mt-0.5">
              1
            </Badge>
            <p>Enter your content — like a URL or message</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="mt-0.5">
              2
            </Badge>
            <p>Customize appearance: dots, corners, colors</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="mt-0.5">
              3
            </Badge>
            <p>Upload & crop your logo (optional)</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="mt-0.5">
              4
            </Badge>
            <p>Preview it live and download as PNG or JPG</p>
          </div>
        </CardContent>
      </Card>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

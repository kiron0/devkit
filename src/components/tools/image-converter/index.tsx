"use client"

import React, { useRef, useState } from "react"
import ImagePreview from "next/image"
import {
  Download,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Upload,
} from "lucide-react"

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
import { FeatureGrid, ToolLayout } from "@/components/common"

interface ImageData {
  file: File
  url: string
  name: string
  size: number
  type: string
}

const SUPPORTED_FORMATS = [
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
  { value: "image/webp", label: "WebP", extension: "webp" },
  { value: "image/svg+xml", label: "SVG", extension: "svg" },
]

export function ImageConverter() {
  const [image, setImage] = useState<ImageData | null>(null)
  const [targetFormat, setTargetFormat] = useState("image/jpeg")
  const [quality, setQuality] = useState([90])
  const [rotation, setRotation] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    const url = URL.createObjectURL(file)
    setImage({
      file,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    })
    setConvertedImage(null)
  }

  const convertImage = async () => {
    if (!image) return

    setIsConverting(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Apply rotation
        const rotatedWidth = rotation % 180 === 0 ? img.width : img.height
        const rotatedHeight = rotation % 180 === 0 ? img.height : img.width

        canvas.width = rotatedWidth
        canvas.height = rotatedHeight

        if (ctx) {
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.rotate((rotation * Math.PI) / 180)
          ctx.drawImage(img, -img.width / 2, -img.height / 2)
          ctx.restore()

          // Convert to target format
          const mimeType = targetFormat
          const qualityValue = quality[0] / 100

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                setConvertedImage(url)
                toast({
                  title: "Conversion complete",
                  description: "Image has been converted successfully",
                })
              }
              setIsConverting(false)
            },
            mimeType,
            qualityValue
          )
        }
      }

      img.src = image.url
    } catch (error) {
      console.error("Conversion error:", error)
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion",
        variant: "destructive",
      })
      setIsConverting(false)
    }
  }

  const downloadImage = () => {
    if (!convertedImage) return

    const link = document.createElement("a")
    link.href = convertedImage
    const format = SUPPORTED_FORMATS.find((f) => f.value === targetFormat)
    const extension = format?.extension || "jpg"
    link.download = `converted.${extension}`
    link.click()
  }

  const resetImage = () => {
    setImage(null)
    setConvertedImage(null)
    setRotation(0)
    setQuality([90])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const features = [
    {
      title: "Multiple Formats",
      description: "Convert images to JPG, PNG, WebP, SVG, and more.",
      icon: "📷",
    },
    {
      title: "Quality Control",
      description: "Adjust image quality with a simple slider.",
      icon: "🎚️",
    },
    {
      title: "Rotation",
      description: "Rotate images by 90-degree increments.",
      icon: "🔄",
    },
    {
      title: "Drag & Drop",
      description: "Easily upload images by dragging and dropping.",
      icon: "📥",
    },
  ]

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images between different formats with quality control and basic editing"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Input Image
              </CardTitle>
              <CardDescription>
                Upload or drag & drop an image to convert
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!image ? (
                <div
                  className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="text-muted-foreground mx-auto mb-4 h-36 w-12" />
                  <p className="text-muted-foreground mb-2 text-sm">
                    Drag & drop an image here or click to browse
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supports: JPG, PNG, WebP, SVG, GIF
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileSelect(e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <ImagePreview
                      width={500}
                      height={500}
                      src={image.url}
                      alt={image.name}
                      className="h-48 w-full rounded-lg border object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={resetImage}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{image.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">
                        {formatFileSize(image.size)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <Badge variant="secondary">
                        {image.type.split("/")[1].toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Conversion Settings
              </CardTitle>
              <CardDescription>
                Configure output format and quality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm">Target Format</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Quality: {quality[0]}%</Label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Rotation: {rotation}°</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRotation(rotation - 90)}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Left
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRotation(rotation + 90)}
                    className="flex-1"
                  >
                    <RotateCw className="h-4 w-4" />
                    Right
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                onClick={convertImage}
                disabled={!image || isConverting}
                className="w-full"
              >
                {isConverting ? "Converting..." : "Convert Image"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        {convertedImage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Converted Image
              </CardTitle>
              <CardDescription>Download your converted image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <ImagePreview
                  width={500}
                  height={500}
                  src={convertedImage}
                  alt="Converted"
                  className="h-48 w-full rounded-lg border object-contain"
                />
              </div>
              <Button onClick={downloadImage} className="w-full">
                <Download className="h-4 w-4" />
                Download Converted Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

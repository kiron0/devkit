"use client"

import { useCallback, useEffect, useState } from "react"
import { Palette, RefreshCw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
}

export function ColorConverter() {
  const [color, setColor] = useState<Color>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
  })
  const [palette, setPalette] = useState<string[]>([])

  const hexToRgb = useCallback(
    (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null
    },
    []
  )

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? "0" + hex : hex
        })
        .join("")
    )
  }, [])

  const rgbToHsl = useCallback(
    (r: number, g: number, b: number): { h: number; s: number; l: number } => {
      r /= 255
      g /= 255
      b /= 255
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0,
        s = 0
      const l = (max + min) / 2

      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
      }
    },
    []
  )

  const hslToRgb = useCallback(
    (h: number, s: number, l: number): { r: number; g: number; b: number } => {
      h /= 360
      s /= 100
      l /= 100

      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      let r, g, b
      if (s === 0) {
        r = g = b = l
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      }
    },
    []
  )

  const rgbToHsv = useCallback(
    (r: number, g: number, b: number): { h: number; s: number; v: number } => {
      r /= 255
      g /= 255
      b /= 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const diff = max - min

      let h = 0
      const s = max === 0 ? 0 : diff / max
      const v = max

      if (diff !== 0) {
        switch (max) {
          case r:
            h = (g - b) / diff + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / diff + 2
            break
          case b:
            h = (r - g) / diff + 4
            break
        }
        h /= 6
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
      }
    },
    []
  )

  const updateColorFromHex = useCallback(
    (hex: string) => {
      const rgb = hexToRgb(hex)
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
        setColor({ hex: hex.toUpperCase(), rgb, hsl, hsv })
      }
    },
    [hexToRgb, rgbToHsl, rgbToHsv]
  )

  const updateColorFromRgb = useCallback(
    (r: number, g: number, b: number) => {
      const hex = rgbToHex(r, g, b)
      const hsl = rgbToHsl(r, g, b)
      const hsv = rgbToHsv(r, g, b)
      setColor({ hex: hex.toUpperCase(), rgb: { r, g, b }, hsl, hsv })
    },
    [rgbToHex, rgbToHsl, rgbToHsv]
  )

  const updateColorFromHsl = useCallback(
    (h: number, s: number, l: number) => {
      const rgb = hslToRgb(h, s, l)
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      setColor({ hex: hex.toUpperCase(), rgb, hsl: { h, s, l }, hsv })
    },
    [hslToRgb, rgbToHex, rgbToHsv]
  )

  const generatePalette = useCallback(() => {
    const baseHue = color.hsl.h
    const colors = []

    // Complementary
    const complementaryRgb = hslToRgb(
      (baseHue + 180) % 360,
      color.hsl.s,
      color.hsl.l
    )
    colors.push(
      rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b)
    )

    // Triadic
    const triadic1Rgb = hslToRgb(
      (baseHue + 120) % 360,
      color.hsl.s,
      color.hsl.l
    )
    colors.push(rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b))
    const triadic2Rgb = hslToRgb(
      (baseHue + 240) % 360,
      color.hsl.s,
      color.hsl.l
    )
    colors.push(rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b))

    // Analogous
    const analogous1Rgb = hslToRgb(
      (baseHue + 30) % 360,
      color.hsl.s,
      color.hsl.l
    )
    colors.push(rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b))
    const analogous2Rgb = hslToRgb(
      (baseHue - 30 + 360) % 360,
      color.hsl.s,
      color.hsl.l
    )
    colors.push(rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b))

    // Monochromatic variations
    const lighterRgb = hslToRgb(
      baseHue,
      color.hsl.s,
      Math.min(color.hsl.l + 20, 100)
    )
    colors.push(rgbToHex(lighterRgb.r, lighterRgb.g, lighterRgb.b))
    const darkerRgb = hslToRgb(
      baseHue,
      color.hsl.s,
      Math.max(color.hsl.l - 20, 0)
    )
    colors.push(rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b))

    setPalette(colors.map((c) => c.toUpperCase()))
  }, [color.hsl, hslToRgb, rgbToHex])

  const randomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    updateColorFromHex(randomHex)
  }

  useEffect(() => {
    generatePalette()
  }, [generatePalette])

  const presetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#B53471",
    "#006BA6",
    "#0496FF",
    "#FFBC42",
    "#D81159",
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Color Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Color Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="h-32 w-full rounded-lg border shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-center">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColorFromHex(e.target.value)}
                  className="h-16 w-16 cursor-pointer rounded-lg border"
                />
              </div>
              <Button
                onClick={randomColor}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Random Color
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Color Values */}
        <div className="space-y-6 lg:col-span-2">
          {/* HEX */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">HEX</CardTitle>
                <CopyButton text={color.hex} />
              </div>
            </CardHeader>
            <CardContent>
              <Input
                value={color.hex}
                onChange={(e) => updateColorFromHex(e.target.value)}
                placeholder="#000000"
                className="font-mono"
              />
            </CardContent>
          </Card>

          {/* RGB */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">RGB</CardTitle>
                <CopyButton
                  text={`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-muted-foreground text-sm">Red</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={color.rgb.r}
                    onChange={(e) =>
                      updateColorFromRgb(
                        parseInt(e.target.value) || 0,
                        color.rgb.g,
                        color.rgb.b
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Green</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={color.rgb.g}
                    onChange={(e) =>
                      updateColorFromRgb(
                        color.rgb.r,
                        parseInt(e.target.value) || 0,
                        color.rgb.b
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Blue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={color.rgb.b}
                    onChange={(e) =>
                      updateColorFromRgb(
                        color.rgb.r,
                        color.rgb.g,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HSL */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">HSL</CardTitle>
                <CopyButton
                  text={`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-muted-foreground text-sm">Hue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={color.hsl.h}
                    onChange={(e) =>
                      updateColorFromHsl(
                        parseInt(e.target.value) || 0,
                        color.hsl.s,
                        color.hsl.l
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Saturation
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={color.hsl.s}
                    onChange={(e) =>
                      updateColorFromHsl(
                        color.hsl.h,
                        parseInt(e.target.value) || 0,
                        color.hsl.l
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Lightness
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={color.hsl.l}
                    onChange={(e) =>
                      updateColorFromHsl(
                        color.hsl.h,
                        color.hsl.s,
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preset Colors */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Preset Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 lg:grid-cols-15">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className="h-8 w-8 rounded border shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: presetColor }}
                onClick={() => updateColorFromHex(presetColor)}
                title={presetColor}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Palette */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Generated Palette</CardTitle>
            <Button onClick={generatePalette} variant="outline" size="sm">
              <Palette className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-7">
            {palette.map((paletteColor, index) => (
              <div key={index} className="space-y-2 text-center">
                <button
                  className="h-16 w-full rounded-lg border shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: paletteColor }}
                  onClick={() => updateColorFromHex(paletteColor)}
                  title={`Use ${paletteColor}`}
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{paletteColor}</span>
                  <CopyButton text={paletteColor} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

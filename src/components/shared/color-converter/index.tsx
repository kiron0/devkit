"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { colorUtils } from "@/utils"
import { Palette, RefreshCw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
  oklch: { l: number; c: number; h: number }
}

// Optimized color conversion utilities

export function ColorConverter() {
  const [color, setColor] = useState<Color>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    oklch: { l: 0.55, c: 0.18, h: 217 },
  })

  const [palette, setPalette] = useState<string[]>([])
  const [autoGenerate, setAutoGenerate] = useState(true)

  // Memoized color update functions for better performance
  const updateColorFromHex = useCallback((hex: string) => {
    const rgb = colorUtils.hexToRgb(hex)
    if (rgb) {
      const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = colorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b)
      const oklch = colorUtils.rgbToOklch(rgb.r, rgb.g, rgb.b)
      setColor({ hex: hex.toUpperCase(), rgb, hsl, hsv, oklch })
    }
  }, [])

  const updateColorFromRgb = useCallback((r: number, g: number, b: number) => {
    const hex = colorUtils.rgbToHex(r, g, b)
    const hsl = colorUtils.rgbToHsl(r, g, b)
    const hsv = colorUtils.rgbToHsv(r, g, b)
    const oklch = colorUtils.rgbToOklch(r, g, b)
    setColor({ hex: hex.toUpperCase(), rgb: { r, g, b }, hsl, hsv, oklch })
  }, [])

  const updateColorFromHsl = useCallback((h: number, s: number, l: number) => {
    const rgb = colorUtils.hslToRgb(h, s, l)
    const hex = colorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
    const hsv = colorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b)
    const oklch = colorUtils.rgbToOklch(rgb.r, rgb.g, rgb.b)
    setColor({ hex: hex.toUpperCase(), rgb, hsl: { h, s, l }, hsv, oklch })
  }, [])

  const updateColorFromOklch = useCallback(
    (l: number, c: number, h: number) => {
      const rgb = colorUtils.oklchToRgb(l, c, h)
      const hex = colorUtils.rgbToHex(rgb.r, rgb.g, rgb.b)
      const hsl = colorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b)
      const hsv = colorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b)
      setColor({ hex: hex.toUpperCase(), rgb, hsl, hsv, oklch: { l, c, h } })
    },
    []
  )

  // Enhanced palette generation with OKLCH-based harmonies
  const generatePalette = useCallback(() => {
    const baseHue = color.oklch.h
    const baseLightness = color.oklch.l
    const baseChroma = color.oklch.c
    const colors = []

    // Complementary
    const compHue = (baseHue + 180) % 360
    const compRgb = colorUtils.oklchToRgb(baseLightness, baseChroma, compHue)
    colors.push(colorUtils.rgbToHex(compRgb.r, compRgb.g, compRgb.b))

    // Triadic
    const triadic1Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue + 120) % 360
    )
    colors.push(
      colorUtils.rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b)
    )
    const triadic2Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue + 240) % 360
    )
    colors.push(
      colorUtils.rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b)
    )

    // Analogous
    const analogous1Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue + 30) % 360
    )
    colors.push(
      colorUtils.rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b)
    )
    const analogous2Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue - 30 + 360) % 360
    )
    colors.push(
      colorUtils.rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b)
    )

    // Monochromatic variations with OKLCH
    const lighterRgb = colorUtils.oklchToRgb(
      Math.min(baseLightness + 0.1, 1),
      baseChroma,
      baseHue
    )
    colors.push(colorUtils.rgbToHex(lighterRgb.r, lighterRgb.g, lighterRgb.b))
    const darkerRgb = colorUtils.oklchToRgb(
      Math.max(baseLightness - 0.1, 0),
      baseChroma,
      baseHue
    )
    colors.push(colorUtils.rgbToHex(darkerRgb.r, darkerRgb.g, darkerRgb.b))

    // Split-complementary
    const split1Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue + 150) % 360
    )
    colors.push(colorUtils.rgbToHex(split1Rgb.r, split1Rgb.g, split1Rgb.b))
    const split2Rgb = colorUtils.oklchToRgb(
      baseLightness,
      baseChroma,
      (baseHue + 210) % 360
    )
    colors.push(colorUtils.rgbToHex(split2Rgb.r, split2Rgb.g, split2Rgb.b))

    setPalette(colors.map((c) => c.toUpperCase()))
  }, [color.oklch])

  // Optimized random color generation
  const randomColor = useCallback(() => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    updateColorFromHex(randomHex)
  }, [updateColorFromHex])

  // Auto-generate palette when color changes
  useEffect(() => {
    if (autoGenerate) {
      generatePalette()
    }
  }, [color, generatePalette, autoGenerate])

  // Memoized preset colors for better performance
  const presetColors = useMemo(
    () => [
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
      "#7209B7",
      "#4361EE",
      "#3A0CA3",
      "#480CA8",
      "#560BAD",
    ],
    []
  )

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              <div className="flex gap-2">
                <Button
                  onClick={randomColor}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4" />
                  Random
                </Button>
              </div>
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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

          {/* OKLCH */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">OKLCH</CardTitle>
                <CopyButton
                  text={`oklch(${color.oklch.l.toFixed(3)}, ${color.oklch.c.toFixed(3)}, ${color.oklch.h.toFixed(1)})`}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Lightness
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    value={color.oklch.l}
                    onChange={(e) =>
                      updateColorFromOklch(
                        parseFloat(e.target.value) || 0,
                        color.oklch.c,
                        color.oklch.h
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Chroma
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    max="0.4"
                    step="0.001"
                    value={color.oklch.c}
                    onChange={(e) =>
                      updateColorFromOklch(
                        color.oklch.l,
                        parseFloat(e.target.value) || 0,
                        color.oklch.h
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Hue</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    step="0.1"
                    value={color.oklch.h}
                    onChange={(e) =>
                      updateColorFromOklch(
                        color.oklch.l,
                        color.oklch.c,
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-generate">Auto-generate palette</Label>
              <Switch
                id="auto-generate"
                checked={autoGenerate}
                onCheckedChange={setAutoGenerate}
              />
            </div>
            {!autoGenerate && (
              <Button onClick={generatePalette} variant="outline">
                <Palette className="h-4 w-4" />
                Generate Palette
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
              <Palette className="h-4 w-4" />
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

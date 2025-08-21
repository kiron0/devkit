"use client"

import { useState } from "react"
import { Code, Copy, Plus, Trash2 } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface ShadowLayer {
  id: string
  offsetX: number
  offsetY: number
  blurRadius: number
  spreadRadius: number
  color: string
  opacity: number
  inset: boolean
}

interface PresetShadow {
  name: string
  description: string
  shadows: ShadowLayer[]
  category: "subtle" | "elevated" | "dramatic" | "neon" | "soft"
}

const SHADOW_PRESETS: PresetShadow[] = [
  {
    name: "Subtle Drop",
    description: "Soft, natural shadow for subtle depth",
    category: "subtle",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadRadius: 0,
        color: "#000000",
        opacity: 0.1,
        inset: false,
      },
    ],
  },
  {
    name: "Elevated Card",
    description: "Medium shadow for card-like elements",
    category: "elevated",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadRadius: -1,
        color: "#000000",
        opacity: 0.1,
        inset: false,
      },
      {
        id: "2",
        offsetX: 0,
        offsetY: 10,
        blurRadius: 15,
        spreadRadius: -3,
        color: "#000000",
        opacity: 0.1,
        inset: false,
      },
    ],
  },
  {
    name: "Dramatic Depth",
    description: "Strong shadow for dramatic effects",
    category: "dramatic",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 20,
        blurRadius: 25,
        spreadRadius: -5,
        color: "#000000",
        opacity: 0.25,
        inset: false,
      },
      {
        id: "2",
        offsetX: 0,
        offsetY: 10,
        blurRadius: 10,
        spreadRadius: -2,
        color: "#000000",
        opacity: 0.15,
        inset: false,
      },
    ],
  },
  {
    name: "Neon Glow",
    description: "Colorful glow effect for modern designs",
    category: "neon",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 0,
        blurRadius: 20,
        spreadRadius: 0,
        color: "#3b82f6",
        opacity: 0.5,
        inset: false,
      },
      {
        id: "2",
        offsetX: 0,
        offsetY: 0,
        blurRadius: 40,
        spreadRadius: 0,
        color: "#3b82f6",
        opacity: 0.3,
        inset: false,
      },
    ],
  },
  {
    name: "Soft Inset",
    description: "Inset shadow for pressed button effect",
    category: "soft",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadRadius: 0,
        color: "#000000",
        opacity: 0.1,
        inset: true,
      },
    ],
  },
  {
    name: "Layered Depth",
    description: "Multiple shadows for complex depth",
    category: "elevated",
    shadows: [
      {
        id: "1",
        offsetX: 0,
        offsetY: 1,
        blurRadius: 3,
        spreadRadius: 0,
        color: "#000000",
        opacity: 0.12,
        inset: false,
      },
      {
        id: "2",
        offsetX: 0,
        offsetY: 1,
        blurRadius: 2,
        spreadRadius: 0,
        color: "#000000",
        opacity: 0.24,
        inset: false,
      },
      {
        id: "3",
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadRadius: 0,
        color: "#000000",
        opacity: 0.12,
        inset: false,
      },
    ],
  },
]

export function CSSBoxShadowGenerator() {
  const [shadows, setShadows] = useState<ShadowLayer[]>([
    {
      id: "1",
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: "#000000",
      opacity: 0.1,
      inset: false,
    },
  ])
  const [activeTab, setActiveTab] = useState("builder")
  const [previewElement, setPreviewElement] = useState("box")

  const addShadow = () => {
    const newId = (shadows.length + 1).toString()
    const newShadow: ShadowLayer = {
      id: newId,
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: "#000000",
      opacity: 0.1,
      inset: false,
    }
    setShadows((prev) => [...prev, newShadow])
  }

  const removeShadow = (id: string) => {
    if (shadows.length > 1) {
      setShadows((prev) => prev.filter((shadow) => shadow.id !== id))
    }
  }

  const updateShadow = (
    id: string,
    key: keyof ShadowLayer,
    value: string | number | boolean
  ) => {
    setShadows((prev) =>
      prev.map((shadow) =>
        shadow.id === id ? { ...shadow, [key]: value } : shadow
      )
    )
  }

  const applyPreset = (preset: PresetShadow) => {
    setShadows(
      preset.shadows.map((shadow, index) => ({
        ...shadow,
        id: (index + 1).toString(),
      }))
    )
    toast({
      title: "Preset applied",
      description: `${preset.name} shadow preset has been applied`,
    })
  }

  const generateCSS = () => {
    if (shadows.length === 0) return ""

    const shadowValues = shadows.map((shadow) => {
      const inset = shadow.inset ? "inset " : ""
      const color =
        shadow.color +
        Math.round(shadow.opacity * 255)
          .toString(16)
          .padStart(2, "0")
      return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${color}`
    })

    return `box-shadow: ${shadowValues.join(", ")};`
  }

  const generateTailwindCSS = () => {
    if (shadows.length === 0) return ""

    // Generate Tailwind-like classes
    const shadowClasses = shadows.map((shadow) => {
      if (shadow.inset) {
        return "shadow-inner"
      }

      // Simple mapping for common shadows
      if (
        shadow.offsetX === 0 &&
        shadow.offsetY === 2 &&
        shadow.blurRadius === 4
      ) {
        return "shadow-sm"
      }
      if (
        shadow.offsetX === 0 &&
        shadow.offsetY === 4 &&
        shadow.blurRadius === 6
      ) {
        return "shadow"
      }
      if (
        shadow.offsetX === 0 &&
        shadow.offsetY === 10 &&
        shadow.blurRadius === 15
      ) {
        return "shadow-lg"
      }
      if (
        shadow.offsetX === 0 &&
        shadow.offsetY === 20 &&
        shadow.blurRadius === 25
      ) {
        return "shadow-xl"
      }

      return "shadow-lg" // fallback
    })

    return shadowClasses.join(" ")
  }

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS())
      toast({
        title: "CSS copied!",
        description: "Box shadow CSS has been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy CSS:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy CSS to clipboard",
        variant: "destructive",
      })
    }
  }

  const copyTailwind = async () => {
    try {
      await navigator.clipboard.writeText(generateTailwindCSS())
      toast({
        title: "Tailwind copied!",
        description: "Tailwind classes have been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy Tailwind classes:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy Tailwind classes to clipboard",
        variant: "destructive",
      })
    }
  }

  const getPreviewStyle = () => {
    return {
      boxShadow: generateCSS().replace("box-shadow: ", "").replace(";", ""),
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "subtle":
        return "🌱"
      case "elevated":
        return "📦"
      case "dramatic":
        return "🎭"
      case "neon":
        return "✨"
      case "soft":
        return "☁️"
      default:
        return "🔤"
    }
  }

  const features = [
    {
      title: "Visual Shadow Builder",
      description: "Intuitive interface to create complex shadows",
      icon: "🛠️",
    },
    {
      title: "Multiple Shadow Layers",
      description: "Add and customize multiple shadow layers",
      icon: "📊",
    },
    {
      title: "Preset Shadows",
      description: "Quickly apply predefined shadow styles",
      icon: "⚡",
    },
    {
      title: "Live Preview",
      description: "See your shadows in action on different elements",
      icon: "👀",
    },
    {
      title: "Copy CSS & Tailwind Classes",
      description: "Easily copy generated CSS or Tailwind classes",
      icon: "📋",
    },
    {
      title: "Customizable Colors & Opacity",
      description: "Fine-tune colors and opacity for perfect shadows",
      icon: "🎨",
    },
  ]

  return (
    <ToolLayout
      title="CSS Box Shadow Generator"
      description="Create beautiful box shadows with visual builder and multiple layers"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea>
            <TabsList>
              <TabsTrigger value="builder">Shadow Builder</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Shadow Controls */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Shadow Layers</CardTitle>
                      <CardDescription>
                        Configure each shadow layer
                      </CardDescription>
                    </div>
                    <Button onClick={addShadow} size="sm">
                      <Plus className="h-4 w-4" />
                      Add Layer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] min-h-[300px] space-y-4 overflow-y-auto">
                  {shadows.map((shadow, index) => (
                    <div
                      key={shadow.id}
                      className="space-y-4 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Layer {index + 1}</Badge>
                        {shadows.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeShadow(shadow.id)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Offset X: {shadow.offsetX}px
                          </Label>
                          <Slider
                            value={[shadow.offsetX]}
                            onValueChange={([value]) =>
                              updateShadow(shadow.id, "offsetX", value)
                            }
                            min={-50}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Offset Y: {shadow.offsetY}px
                          </Label>
                          <Slider
                            value={[shadow.offsetY]}
                            onValueChange={([value]) =>
                              updateShadow(shadow.id, "offsetY", value)
                            }
                            min={-50}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Blur: {shadow.blurRadius}px
                          </Label>
                          <Slider
                            value={[shadow.blurRadius]}
                            onValueChange={([value]) =>
                              updateShadow(shadow.id, "blurRadius", value)
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">
                            Spread: {shadow.spreadRadius}px
                          </Label>
                          <Slider
                            value={[shadow.spreadRadius]}
                            onValueChange={([value]) =>
                              updateShadow(shadow.id, "spreadRadius", value)
                            }
                            min={-50}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={shadow.color}
                            onChange={(e) =>
                              updateShadow(shadow.id, "color", e.target.value)
                            }
                            className="h-10 w-16"
                          />
                          <div className="flex-1">
                            <Input
                              value={shadow.color}
                              onChange={(e) =>
                                updateShadow(shadow.id, "color", e.target.value)
                              }
                              placeholder="#000000"
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">
                          Opacity: {Math.round(shadow.opacity * 100)}%
                        </Label>
                        <Slider
                          value={[shadow.opacity]}
                          onValueChange={([value]) =>
                            updateShadow(shadow.id, "opacity", value)
                          }
                          min={0}
                          max={1}
                          step={0.01}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`inset-${shadow.id}`}
                          checked={shadow.inset}
                          onCheckedChange={(value) =>
                            updateShadow(shadow.id, "inset", value)
                          }
                        />
                        <Label
                          htmlFor={`inset-${shadow.id}`}
                          className="text-sm"
                        >
                          Inset shadow
                        </Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Generated CSS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Generated CSS
                  </CardTitle>
                  <CardDescription>Copy the generated CSS code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>CSS</Label>
                    <CodeHighlighter language="css">
                      {generateCSS()}
                    </CodeHighlighter>
                    <Button onClick={copyCSS} className="w-full">
                      <Copy className="h-4 w-4" />
                      Copy CSS
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Tailwind CSS</Label>
                    <div className="bg-muted rounded-lg p-3">
                      <code className="text-sm">{generateTailwindCSS()}</code>
                    </div>
                    <Button
                      onClick={copyTailwind}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Tailwind
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SHADOW_PRESETS.map((preset, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                >
                  <CardHeader onClick={() => applyPreset(preset)}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(preset.category)}
                      <CardTitle className="text-lg">{preset.name}</CardTitle>
                    </div>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div
                        className="h-20 w-full rounded-lg border bg-white"
                        style={{
                          boxShadow: preset.shadows
                            .map((shadow) => {
                              const inset = shadow.inset ? "inset " : ""
                              const color =
                                shadow.color +
                                Math.round(shadow.opacity * 255)
                                  .toString(16)
                                  .padStart(2, "0")
                              return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spreadRadius}px ${color}`
                            })
                            .join(", "),
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{preset.category}</Badge>
                        <span className="text-muted-foreground text-xs">
                          {preset.shadows.length} layer
                          {preset.shadows.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Button
                        onClick={() => applyPreset(preset)}
                        className="w-full"
                      >
                        Use This Preset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See your shadow in action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview Element Selection */}
                <div className="space-y-2">
                  <Label>Preview Element</Label>
                  <div className="flex gap-2">
                    {["box", "card", "button", "circle"].map((element) => (
                      <Button
                        key={element}
                        variant={
                          previewElement === element ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPreviewElement(element)}
                      >
                        {element.charAt(0).toUpperCase() + element.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Preview Display */}
                <div className="flex justify-center">
                  <div
                    className={` ${previewElement === "box" ? "h-32 w-32 border bg-white" : ""} ${previewElement === "card" ? "h-40 w-64 rounded-lg border bg-white" : ""} ${previewElement === "button" ? "rounded-lg bg-blue-500 px-6 py-3 text-white" : ""} ${previewElement === "circle" ? "h-24 w-24 rounded-full border bg-white" : ""} `}
                    style={getPreviewStyle()}
                  >
                    {previewElement === "button" && "Button"}
                  </div>
                </div>

                {/* Shadow Information */}
                <div className="space-y-2">
                  <Label>Current Shadow</Label>
                  <div className="bg-muted rounded-lg p-3">
                    <code className="text-sm break-all">{generateCSS()}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

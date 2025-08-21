"use client"

import { useState } from "react"
import {
  Copy,
  FileBadgeIcon,
  Move,
  Play,
  RotateCw,
  Scale,
  Square,
  X,
  Zap,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface Keyframe {
  id: string
  percentage: number
  properties: Record<string, string>
}

interface Animation {
  name: string
  duration: number
  timing: string
  delay: number
  iteration: string
  direction: string
  fillMode: string
  keyframes: Keyframe[]
}

const TIMING_FUNCTIONS = [
  { value: "ease", label: "Ease" },
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In Out" },
  { value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", label: "Bounce" },
]

const ITERATION_OPTIONS = [
  { value: "1", label: "Once" },
  { value: "2", label: "Twice" },
  { value: "3", label: "Three times" },
  { value: "infinite", label: "Infinite" },
]

const DIRECTION_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "reverse", label: "Reverse" },
  { value: "alternate", label: "Alternate" },
  { value: "alternate-reverse", label: "Alternate Reverse" },
]

const FILL_MODE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "forwards", label: "Forwards" },
  { value: "backwards", label: "Backwards" },
  { value: "both", label: "Both" },
]

const ANIMATION_PRESETS = [
  {
    name: "Fade In",
    icon: FileBadgeIcon,
    keyframes: [
      { id: "1", percentage: 0, properties: { opacity: "0" } },
      { id: "2", percentage: 100, properties: { opacity: "1" } },
    ],
  },
  {
    name: "Slide In Left",
    icon: Move,
    keyframes: [
      {
        id: "1",
        percentage: 0,
        properties: { transform: "translateX(-100%)" },
      },
      { id: "2", percentage: 100, properties: { transform: "translateX(0)" } },
    ],
  },
  {
    name: "Slide In Right",
    icon: Move,
    keyframes: [
      { id: "1", percentage: 0, properties: { transform: "translateX(100%)" } },
      { id: "2", percentage: 100, properties: { transform: "translateX(0)" } },
    ],
  },
  {
    name: "Scale In",
    icon: Scale,
    keyframes: [
      { id: "1", percentage: 0, properties: { transform: "scale(0)" } },
      { id: "2", percentage: 100, properties: { transform: "scale(1)" } },
    ],
  },
  {
    name: "Rotate In",
    icon: RotateCw,
    keyframes: [
      {
        id: "1",
        percentage: 0,
        properties: { transform: "rotate(-180deg) scale(0)" },
      },
      {
        id: "2",
        percentage: 100,
        properties: { transform: "rotate(0deg) scale(1)" },
      },
    ],
  },
  {
    name: "Bounce In",
    icon: Zap,
    keyframes: [
      {
        id: "1",
        percentage: 0,
        properties: { transform: "scale(0.3)", opacity: "0" },
      },
      { id: "2", percentage: 50, properties: { transform: "scale(1.05)" } },
      { id: "3", percentage: 70, properties: { transform: "scale(0.9)" } },
      {
        id: "4",
        percentage: 100,
        properties: { transform: "scale(1)", opacity: "1" },
      },
    ],
  },
  {
    name: "Pulse",
    icon: Zap,
    keyframes: [
      { id: "1", percentage: 0, properties: { transform: "scale(1)" } },
      { id: "2", percentage: 50, properties: { transform: "scale(1.05)" } },
      { id: "3", percentage: 100, properties: { transform: "scale(1)" } },
    ],
  },
  {
    name: "Shake",
    icon: Move,
    keyframes: [
      { id: "1", percentage: 0, properties: { transform: "translateX(0)" } },
      {
        id: "2",
        percentage: 10,
        properties: { transform: "translateX(-10px)" },
      },
      {
        id: "3",
        percentage: 20,
        properties: { transform: "translateX(10px)" },
      },
      {
        id: "4",
        percentage: 30,
        properties: { transform: "translateX(-10px)" },
      },
      {
        id: "5",
        percentage: 40,
        properties: { transform: "translateX(10px)" },
      },
      {
        id: "6",
        percentage: 50,
        properties: { transform: "translateX(-10px)" },
      },
      {
        id: "7",
        percentage: 60,
        properties: { transform: "translateX(10px)" },
      },
      {
        id: "8",
        percentage: 70,
        properties: { transform: "translateX(-10px)" },
      },
      {
        id: "9",
        percentage: 80,
        properties: { transform: "translateX(10px)" },
      },
      {
        id: "10",
        percentage: 90,
        properties: { transform: "translateX(-10px)" },
      },
      { id: "11", percentage: 100, properties: { transform: "translateX(0)" } },
    ],
  },
]

const CSS_PROPERTIES = [
  "opacity",
  "transform",
  "background-color",
  "color",
  "width",
  "height",
  "margin",
  "padding",
  "border-radius",
  "box-shadow",
  "filter",
  "clip-path",
]

export function CSSAnimationGenerator() {
  const [animation, setAnimation] = useState<Animation>({
    name: "my-animation",
    duration: 1000,
    timing: "ease",
    delay: 0,
    iteration: "1",
    direction: "normal",
    fillMode: "none",
    keyframes: [
      { id: "1", percentage: 0, properties: { opacity: "0" } },
      { id: "2", percentage: 100, properties: { opacity: "1" } },
    ],
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("builder")

  const updateAnimation = <K extends keyof Animation>(
    key: K,
    value: Animation[K]
  ) => {
    setAnimation((prev) => ({ ...prev, [key]: value }))
  }

  const addKeyframe = () => {
    const newId = (animation.keyframes.length + 1).toString()
    const newKeyframe: Keyframe = {
      id: newId,
      percentage: Math.min(
        100,
        animation.keyframes[animation.keyframes.length - 1]?.percentage + 25 ||
          0
      ),
      properties: {},
    }
    updateAnimation("keyframes", [...animation.keyframes, newKeyframe])
  }

  const removeKeyframe = (id: string) => {
    if (animation.keyframes.length > 2) {
      updateAnimation(
        "keyframes",
        animation.keyframes.filter((k) => k.id !== id)
      )
    }
  }

  const updateKeyframe = (
    id: string,
    key: keyof Keyframe,
    value: Keyframe[keyof Keyframe]
  ) => {
    updateAnimation(
      "keyframes",
      animation.keyframes.map((k) => (k.id === id ? { ...k, [key]: value } : k))
    )
  }

  const updateKeyframeProperty = (
    keyframeId: string,
    property: string,
    value: string
  ) => {
    updateAnimation(
      "keyframes",
      animation.keyframes.map((k) =>
        k.id === keyframeId
          ? { ...k, properties: { ...k.properties, [property]: value } }
          : k
      )
    )
  }

  const removeKeyframeProperty = (keyframeId: string, property: string) => {
    updateAnimation(
      "keyframes",
      animation.keyframes.map((k) =>
        k.id === keyframeId ? { ...k, properties: { ...k.properties } } : k
      )
    )
    const newProperties = {
      ...animation.keyframes.find((k) => k.id === keyframeId)?.properties,
    }
    delete newProperties[property]
    updateKeyframe(keyframeId, "properties", newProperties)
  }

  const applyPreset = (preset: (typeof ANIMATION_PRESETS)[0]) => {
    updateAnimation(
      "keyframes",
      preset.keyframes.map((k, index) => ({
        ...k,
        id: (index + 1).toString(),
        properties: Object.fromEntries(
          Object.entries(k.properties).filter(
            ([, v]) => typeof v === "string" && v !== undefined
          )
        ),
      }))
    )
    toast({
      title: "Preset applied",
      description: `${preset.name} animation preset has been applied`,
    })
  }

  const generateCSS = () => {
    const keyframesCSS = animation.keyframes
      .sort((a, b) => a.percentage - b.percentage)
      .map((k) => {
        const propertiesCSS = Object.entries(k.properties)
          .map(([prop, value]) => `  ${prop}: ${value};`)
          .join("\n")
        return `  ${k.percentage}% {\n${propertiesCSS}\n  }`
      })
      .join("\n\n")

    return `@keyframes ${animation.name} {
${keyframesCSS}
}

.animated-element {
  animation: ${animation.name} ${animation.duration}ms ${animation.timing} ${animation.delay}ms ${animation.iteration} ${animation.direction} ${animation.fillMode};
}`
  }

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS())
      toast({
        title: "CSS copied!",
        description: "Animation CSS has been copied to clipboard",
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

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    // Force re-render to reset animation
    setTimeout(() => setIsPlaying(true), 10)
  }

  const features = [
    {
      title: "Custom Keyframes",
      description: "Define precise keyframes for your animations",
      icon: "🎨",
    },
    {
      title: "Animation Presets",
      description: "Quickly apply common animation styles",
      icon: "⚡",
    },
    {
      title: "Live Preview",
      description: "See your animations in action instantly",
      icon: "👀",
    },
    {
      title: "Copy CSS",
      description: "Easily copy generated CSS code to clipboard",
      icon: "📋",
    },
  ]

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">CSS Animation Generator</h1>
          <p className="text-muted-foreground">
            Create custom CSS animations with keyframes, presets, and live
            preview
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">Animation Builder</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Animation Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Animation Settings</CardTitle>
                  <CardDescription>
                    Configure timing and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Animation Name</Label>
                    <Input
                      id="name"
                      value={animation.name}
                      onChange={(e) => updateAnimation("name", e.target.value)}
                      placeholder="my-animation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration: {animation.duration}ms</Label>
                    <Slider
                      value={[animation.duration]}
                      onValueChange={([value]) =>
                        updateAnimation("duration", value)
                      }
                      max={5000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Delay: {animation.delay}ms</Label>
                    <Slider
                      value={[animation.delay]}
                      onValueChange={([value]) =>
                        updateAnimation("delay", value)
                      }
                      max={2000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Timing Function</Label>
                      <Select
                        value={animation.timing}
                        onValueChange={(value) =>
                          updateAnimation("timing", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMING_FUNCTIONS.map((timing) => (
                            <SelectItem key={timing.value} value={timing.value}>
                              {timing.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Iteration Count</Label>
                      <Select
                        value={animation.iteration}
                        onValueChange={(value) =>
                          updateAnimation("iteration", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITERATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Direction</Label>
                      <Select
                        value={animation.direction}
                        onValueChange={(value) =>
                          updateAnimation("direction", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DIRECTION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fill Mode</Label>
                      <Select
                        value={animation.fillMode}
                        onValueChange={(value) =>
                          updateAnimation("fillMode", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FILL_MODE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keyframes Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Keyframes</CardTitle>
                      <CardDescription>Define animation steps</CardDescription>
                    </div>
                    <Button onClick={addKeyframe} size="sm">
                      Add Keyframe
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] min-h-[300px] space-y-4 overflow-y-auto">
                  {animation.keyframes.map((keyframe) => (
                    <div
                      key={keyframe.id}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {keyframe.percentage}%
                          </Badge>
                          {animation.keyframes.length > 2 && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeKeyframe(keyframe.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Percentage:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={keyframe.percentage}
                            onChange={(e) =>
                              updateKeyframe(
                                keyframe.id,
                                "percentage",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Properties:</Label>
                          {Object.entries(keyframe.properties).map(
                            ([prop, value]) => (
                              <div
                                key={prop}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={prop}
                                  onChange={(e) => {
                                    const newProperties = {
                                      ...keyframe.properties,
                                    }
                                    delete newProperties[prop]
                                    newProperties[e.target.value] = value
                                    updateKeyframe(
                                      keyframe.id,
                                      "properties",
                                      newProperties
                                    )
                                  }}
                                  className="w-24 text-xs md:w-40"
                                />
                                <Input
                                  value={value}
                                  onChange={(e) =>
                                    updateKeyframeProperty(
                                      keyframe.id,
                                      prop,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 text-xs"
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    removeKeyframeProperty(keyframe.id, prop)
                                  }
                                  className="h-6 w-6 p-0"
                                >
                                  <X />
                                </Button>
                              </div>
                            )
                          )}
                          <Select
                            onValueChange={(value) =>
                              updateKeyframeProperty(keyframe.id, value, "")
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Add property" />
                            </SelectTrigger>
                            <SelectContent>
                              {CSS_PROPERTIES.map((prop) => (
                                <SelectItem key={prop} value={prop}>
                                  {prop}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Generated CSS */}
            <Card>
              <CardHeader>
                <CardTitle>Generated CSS</CardTitle>
                <CardDescription>Copy the generated CSS code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={copyCSS} size="sm">
                    <Copy className="h-4 w-4" />
                    Copy CSS
                  </Button>
                </div>
                <CodeHighlighter
                  language="css"
                  className="max-h-[300px] overflow-y-auto"
                >
                  {generateCSS()}
                </CodeHighlighter>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ANIMATION_PRESETS.map((preset, index) => {
                const IconComponent = preset.icon
                return (
                  <Card
                    key={index}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <CardHeader onClick={() => applyPreset(preset)}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{preset.name}</CardTitle>
                      </div>
                      <CardDescription>
                        {preset.keyframes.length} keyframes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => applyPreset(preset)}
                        className="w-full"
                      >
                        Use This Preset
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See your animation in action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4 flex items-center gap-4">
                  <Button onClick={toggleAnimation}>
                    {isPlaying ? (
                      <Square className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {isPlaying ? "Stop" : "Play"}
                  </Button>
                  <Button onClick={resetAnimation} variant="outline">
                    <RotateCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>

                <div className="flex justify-center">
                  <div
                    className={`flex h-32 w-32 items-center justify-center rounded-lg bg-blue-500 text-lg font-bold text-white ${
                      isPlaying
                        ? `animate-[${animation.name}_${animation.duration}ms_${animation.timing}_${animation.delay}ms_${animation.iteration}_${animation.direction}_${animation.fillMode}]`
                        : ""
                    }`}
                    style={
                      isPlaying
                        ? {}
                        : {
                            animation: `${animation.name} ${animation.duration}ms ${animation.timing} ${animation.delay}ms ${animation.iteration} ${animation.direction} ${animation.fillMode}`,
                          }
                    }
                  >
                    Preview
                  </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: generateCSS() }} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

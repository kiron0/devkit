"use client"

import { useState } from "react"
import { Code, Copy, Grid3X3, Rows, X } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface LayoutItem {
  id: string
  content: string
  className: string
}

interface LayoutConfig {
  type: "grid" | "flexbox"
  columns: number
  rows: number
  gap: number
  justifyContent: string
  alignItems: string
  flexDirection: string
  flexWrap: string
}

const JUSTIFY_OPTIONS = [
  { value: "flex-start", label: "Flex Start" },
  { value: "flex-end", label: "Flex End" },
  { value: "center", label: "Center" },
  { value: "space-between", label: "Space Between" },
  { value: "space-around", label: "Space Around" },
  { value: "space-evenly", label: "Space Evenly" },
]

const ALIGN_OPTIONS = [
  { value: "flex-start", label: "Flex Start" },
  { value: "flex-end", label: "Flex End" },
  { value: "center", label: "Center" },
  { value: "stretch", label: "Stretch" },
  { value: "baseline", label: "Baseline" },
]

const FLEX_DIRECTIONS = [
  { value: "row", label: "Row" },
  { value: "row-reverse", label: "Row Reverse" },
  { value: "column", label: "Column" },
  { value: "column-reverse", label: "Column Reverse" },
]

const FLEX_WRAP_OPTIONS = [
  { value: "nowrap", label: "No Wrap" },
  { value: "wrap", label: "Wrap" },
  { value: "wrap-reverse", label: "Wrap Reverse" },
]

export function CSSLayoutGenerator() {
  const [layoutType, setLayoutType] = useState<"grid" | "flexbox">("grid")
  const [config, setConfig] = useState<LayoutConfig>({
    type: "grid",
    columns: 3,
    rows: 3,
    gap: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "nowrap",
  })
  const [items, setItems] = useState<LayoutItem[]>([
    { id: "1", content: "Item 1", className: "item-1" },
    { id: "2", content: "Item 2", className: "item-2" },
    { id: "3", content: "Item 3", className: "item-3" },
    { id: "4", content: "Item 4", className: "item-4" },
    { id: "5", content: "Item 5", className: "item-5" },
    { id: "6", content: "Item 6", className: "item-6" },
  ])

  const updateConfig = (key: keyof LayoutConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const addItem = () => {
    const newId = (items.length + 1).toString()
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        content: `Item ${newId}`,
        className: `item-${newId}`,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const updateItemContent = (id: string, content: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content } : item))
    )
  }

  const generateCSS = () => {
    if (layoutType === "grid") {
      return `.container {
  display: grid;
  grid-template-columns: repeat(${config.columns}, 1fr);
  grid-template-rows: repeat(${config.rows}, 1fr);
  gap: ${config.gap}px;
  justify-items: ${config.justifyContent};
  align-items: ${config.alignItems};
  min-height: 400px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

${items
  .map(
    (item) => `.${item.className} {
  background: #007bff;
  color: white;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}`
  )
  .join("\n\n")}`
    } else {
      return `.container {
  display: flex;
  flex-direction: ${config.flexDirection};
  flex-wrap: ${config.flexWrap};
  justify-content: ${config.justifyContent};
  align-items: ${config.alignItems};
  gap: ${config.gap}px;
  min-height: 400px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

${items
  .map(
    (item) => `.${item.className} {
  background: #28a745;
  color: white;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 100px;
  min-height: 60px;
}`
  )
  .join("\n\n")}`
    }
  }

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS())
      toast({
        title: "CSS copied!",
        description: "CSS code has been copied to clipboard",
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

  const getContainerStyle = () => {
    if (layoutType === "grid") {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`,
        gap: `${config.gap}px`,
        justifyItems: config.justifyContent,
        alignItems: config.alignItems,
      }
    } else {
      return {
        display: "flex",
        flexDirection: config.flexDirection,
        flexWrap: config.flexWrap,
        justifyContent: config.justifyContent,
        alignItems: config.alignItems,
        gap: `${config.gap}px`,
      }
    }
  }

  const features = [
    {
      title: "Visual Layout Builder",
      description: "Drag and drop items to create complex layouts with ease.",
      icon: "🎨",
    },
    {
      title: "Live Preview",
      description: "See your layout changes in real-time.",
      icon: "👀",
    },
    {
      title: "CSS Code Generation",
      description: "Generate clean, responsive CSS code for your layouts.",
      icon: "📄",
    },
    {
      title: "Customizable Options",
      description:
        "Adjust grid/flex properties like columns, rows, gaps, and alignment.",
      icon: "⚙️",
    },
  ]

  return (
    <ToolLayout
      title="CSS Layout Generator"
      description="Visual CSS Grid and Flexbox builder with live preview and code generation"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">CSS Layout Generator</h1>
          <p className="text-muted-foreground">
            Visual CSS Grid and Flexbox builder with live preview and code
            generation
          </p>
        </div>

        <Tabs
          value={layoutType}
          onValueChange={(value) => setLayoutType(value as "grid" | "flexbox")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              CSS Grid
            </TabsTrigger>
            <TabsTrigger value="flexbox" className="flex items-center gap-2">
              <Rows className="h-4 w-4" />
              Flexbox
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Grid Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Grid Configuration</CardTitle>
                  <CardDescription>
                    Configure your CSS Grid layout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="columns">Columns</Label>
                      <Input
                        id="columns"
                        type="number"
                        min="1"
                        max="12"
                        value={config.columns}
                        onChange={(e) =>
                          updateConfig("columns", parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rows">Rows</Label>
                      <Input
                        id="rows"
                        type="number"
                        min="1"
                        max="12"
                        value={config.rows}
                        onChange={(e) =>
                          updateConfig("rows", parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-full space-y-2 md:col-span-1">
                      <Label htmlFor="gap">Gap (px)</Label>
                      <Input
                        id="gap"
                        type="number"
                        min="0"
                        max="100"
                        value={config.gap}
                        onChange={(e) =>
                          updateConfig("gap", parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Justify Items</Label>
                      <Select
                        value={config.justifyContent}
                        onValueChange={(value) =>
                          updateConfig("justifyContent", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {JUSTIFY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Align Items</Label>
                      <Select
                        value={config.alignItems}
                        onValueChange={(value) =>
                          updateConfig("alignItems", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALIGN_OPTIONS.map((option) => (
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

              {/* Flexbox Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Flexbox Configuration</CardTitle>
                  <CardDescription>
                    Configure your Flexbox layout
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Flex Direction</Label>
                    <Select
                      value={config.flexDirection}
                      onValueChange={(value) =>
                        updateConfig("flexDirection", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FLEX_DIRECTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Flex Wrap</Label>
                    <Select
                      value={config.flexWrap}
                      onValueChange={(value) => updateConfig("flexWrap", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FLEX_WRAP_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Justify Content</Label>
                    <Select
                      value={config.justifyContent}
                      onValueChange={(value) =>
                        updateConfig("justifyContent", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JUSTIFY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Align Items</Label>
                    <Select
                      value={config.alignItems}
                      onValueChange={(value) =>
                        updateConfig("alignItems", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALIGN_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Layout Items Management */}
        <Card>
          <CardHeader>
            <CardTitle>Layout Items</CardTitle>
            <CardDescription>Manage the items in your layout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {items.length} items
              </span>
              <Button onClick={addItem} size="sm">
                Add Item
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border p-3"
                >
                  <Input
                    value={item.content}
                    onChange={(e) => updateItemContent(item.id, e.target.value)}
                    className="flex-1"
                  />
                  <Badge variant="secondary">{item.className}</Badge>
                  {items.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See your layout in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="container"
              style={getContainerStyle() as React.CSSProperties}
            >
              {items.map((item) => (
                <div key={item.id} className={item.className}>
                  {item.content}
                </div>
              ))}
            </div>
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
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

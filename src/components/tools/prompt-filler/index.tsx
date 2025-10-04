"use client"

import { useState } from "react"
import { Config } from "@/config"
import {
  Copy,
  Download,
  FileText,
  MessageSquare,
  Save,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FeatureGrid, ToolLayout } from "@/components/common"

interface PromptTemplate {
  id: string
  name: string
  template: string
  variables: string[]
  description: string
}

interface PromptVariable {
  name: string
  value: string
  placeholder: string
}

export function PromptFiller() {
  const [promptTemplate, setPromptTemplate] = useState("")
  const [variables, setVariables] = useState<PromptVariable[]>([])
  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: "ai-blog-post",
      name: "AI Blog Post",
      template:
        "Write a [content_type] about [topic] in [tone] tone for [audience] audience. The post should be [length] words and include [key_points].",
      variables: [
        "content_type",
        "topic",
        "tone",
        "audience",
        "length",
        "key_points",
      ],
      description: "AI blog post generator with customizable parameters",
    },
    {
      id: "email-template",
      name: "Professional Email",
      template:
        "Hi [recipient_name],\n\nI hope this email finds you well. I'm reaching out regarding [subject].\n\n[main_content]\n\nBest regards,\n[sender_name]",
      variables: ["recipient_name", "subject", "main_content", "sender_name"],
      description: "Professional email template with personalization",
    },
    {
      id: "social-media-post",
      name: "Social Media Post",
      template:
        "🚀 [announcement]\n\n[main_message]\n\n[call_to_action]\n\n#[hashtag1] #[hashtag2] #[hashtag3]",
      variables: [
        "announcement",
        "main_message",
        "call_to_action",
        "hashtag1",
        "hashtag2",
        "hashtag3",
      ],
      description: "Engaging social media post template",
    },
    {
      id: "content-brief",
      name: "Content Brief",
      template:
        "Create a [format] about [topic] targeting [audience] with [style] style. Include [requirements] and focus on [key_objective].",
      variables: [
        "format",
        "topic",
        "audience",
        "style",
        "requirements",
        "key_objective",
      ],
      description: "Comprehensive content brief template",
    },
    {
      id: "product-description",
      name: "Product Description",
      template:
        "Introducing [product_name] - the perfect solution for [problem_solved].\n\nKey Features:\n• [feature1]\n• [feature2]\n• [feature3]\n\n[benefit_statement]",
      variables: [
        "product_name",
        "problem_solved",
        "feature1",
        "feature2",
        "feature3",
        "benefit_statement",
      ],
      description: "Compelling product description template",
    },
  ])

  const extractVariables = (template: string): string[] => {
    const variableRegex = /\[([^\]]+)\]/g
    const matches = template.match(variableRegex) || []
    return [...new Set(matches.map((match) => match.slice(1, -1)))]
  }

  const handleTemplateChange = (template: string) => {
    setPromptTemplate(template)
    const extractedVars = extractVariables(template)

    // Update variables array
    const newVariables: PromptVariable[] = extractedVars.map((varName) => {
      const existing = variables.find((v) => v.name === varName)
      return (
        existing || {
          name: varName,
          value: "",
          placeholder: `Enter ${varName.replace(/_/g, " ")}`,
        }
      )
    })

    setVariables(newVariables)
  }

  const handleVariableChange = (name: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.name === name ? { ...v, value } : v))
    )
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setPromptTemplate(template.template)
      setVariables(
        template.variables.map((name) => ({
          name,
          value: "",
          placeholder: `Enter ${name.replace(/_/g, " ")}`,
        }))
      )
    }
  }

  const saveTemplate = () => {
    if (!promptTemplate.trim()) return

    const template: PromptTemplate = {
      id: Date.now().toString(),
      name: `Template ${templates.length + 1}`,
      template: promptTemplate,
      variables: variables.map((v) => v.name),
      description: `Template with ${variables.length} variables`,
    }

    setTemplates((prev) => [...prev, template])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportPrompt = () => {
    let filledPrompt = promptTemplate
    variables.forEach((variable) => {
      const regex = new RegExp(`\\[${variable.name}\\]`, "g")
      filledPrompt = filledPrompt.replace(
        regex,
        variable.value || `[${variable.name}]`
      )
    })

    const wordCount = filledPrompt
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characterCount = filledPrompt.length
    const estimatedTokens = Math.ceil(characterCount / 4)

    const content = `Filled Prompt:
${filledPrompt}

Variables Used:
${variables.map((v) => `${v.name}: ${v.value}`).join("\n")}

Statistics:
- Word Count: ${wordCount}
- Character Count: ${characterCount}
- Estimated Tokens: ${estimatedTokens}

Generated on: ${new Date().toLocaleString()}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${Date.now()}-filled-prompt-by-${Config.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const features = [
    {
      title: "Prompt Templates",
      description:
        "Create and save reusable prompt templates with customizable variables and placeholders.",
      icon: "📝",
    },
    {
      title: "Variable Management",
      description:
        "Easily manage variables with placeholders, validation, and real-time preview.",
      icon: "🔧",
    },
    {
      title: "Smart Detection",
      description:
        "Automatically detect variables in your templates using [variable] syntax.",
      icon: "🔍",
    },
    {
      title: "Real-Time Preview",
      description:
        "See your filled prompt in real-time as you type variable values.",
      icon: "👁️",
    },
    {
      title: "Export & Share",
      description:
        "Export filled prompts and share templates with others easily.",
      icon: "📤",
    },
    {
      title: "Template Library",
      description:
        "Save and organize your favorite prompt templates for quick access.",
      icon: "📚",
    },
    {
      title: "Statistics",
      description:
        "Get word count, character count, and estimated token usage for your prompts.",
      icon: "📊",
    },
    {
      title: "User-Friendly Interface",
      description:
        "Intuitive interface designed for both beginners and advanced users.",
      icon: "🖥️",
    },
  ]

  return (
    <ToolLayout
      title="Prompt Filler"
      description="Create and fill prompt templates with variables using [variable] syntax. Perfect for AI prompts, email templates, and more."
    >
      <TooltipProvider>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Your Prompt
              </CardTitle>
              <CardDescription>
                Create your prompt template using [variable] syntax for dynamic
                content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {templates.map((template) => (
                  <Badge
                    key={template.id}
                    variant="outline"
                    className="hover:bg-muted cursor-pointer transition-colors duration-200"
                    onClick={() => loadTemplate(template.id)}
                  >
                    {template.name}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Textarea
                    placeholder="Enter your prompt template here... Use [variable_name] for dynamic content"
                    value={promptTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="max-h-[300px] min-h-[300px] resize-none text-base md:text-sm"
                  />
                  <div className="text-muted-foreground text-xs">
                    💡 Use [variable_name] syntax to create dynamic placeholders
                  </div>
                </div>

                {/* Real-time Preview */}
                <div className="space-y-2">
                  <Label> Preview</Label>
                  <div className="bg-muted/30 max-h-[300px] min-h-[300px] overflow-y-auto rounded-md border p-4 text-base md:text-sm">
                    {promptTemplate ? (
                      <div className="whitespace-pre-wrap">
                        {promptTemplate
                          .split(/(\[[^\]]+\])/)
                          .map((part, index) => {
                            if (part.startsWith("[") && part.endsWith("]")) {
                              const varName = part.slice(1, -1)
                              const variable = variables.find(
                                (v) => v.name === varName
                              )
                              const isFilled =
                                variable && variable.value.trim().length > 0

                              return (
                                <span
                                  key={index}
                                  className={cn(
                                    "bg-muted rounded border border-dotted px-1 py-0.5 font-medium",
                                    isFilled
                                      ? "border-green-500"
                                      : "border-red-500"
                                  )}
                                  title={
                                    isFilled
                                      ? `Filled: ${variable?.value}`
                                      : `Variable: ${varName}`
                                  }
                                >
                                  {isFilled ? variable?.value : part}
                                </span>
                              )
                            }
                            return part
                          })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground py-8 text-center">
                        Start typing your template to see the live preview...
                      </div>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    🎯 Dynamic fields are highlighted:{" "}
                    <span className="text-red-600 dark:text-red-400">red</span>{" "}
                    for unfilled,{" "}
                    <span className="text-green-600 dark:text-green-400">
                      green
                    </span>{" "}
                    for filled
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {promptTemplate.trim().length > 0 && (
                  <Button onClick={saveTemplate} variant="outline" size="sm">
                    <Save className="h-4 w-4" />
                    Save Template
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const defaultTemplate = templates[0]
                    if (defaultTemplate) {
                      loadTemplate(defaultTemplate.id)
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="h-4 w-4" />
                  Load Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Variables Section */}
          {variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Variables ({variables.length})
                </CardTitle>
                <CardDescription>
                  Fill in the values for your template variables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {variables.map((variable) => (
                    <div
                      key={variable.name}
                      className={cn(
                        "space-y-2",
                        variable.value.length > 50 ? "col-span-full" : ""
                      )}
                    >
                      <Label>
                        {variable.name
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Label>
                      {variable.value.length > 50 ? (
                        <Textarea
                          placeholder={variable.placeholder}
                          value={variable.value}
                          onChange={(e) =>
                            handleVariableChange(variable.name, e.target.value)
                          }
                          className="min-h-[100px] resize-none text-sm"
                        />
                      ) : (
                        <Input
                          placeholder={variable.placeholder}
                          value={variable.value}
                          onChange={(e) =>
                            handleVariableChange(variable.name, e.target.value)
                          }
                          className="text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      const filledPrompt = promptTemplate
                        .split(/(\[[^\]]+\])/)
                        .map((part) => {
                          if (part.startsWith("[") && part.endsWith("]")) {
                            const varName = part.slice(1, -1)
                            const variable = variables.find(
                              (v) => v.name === varName
                            )
                            return variable && variable.value.trim().length > 0
                              ? variable.value
                              : part
                          }
                          return part
                        })
                        .join("")

                      copyToClipboard(filledPrompt)
                    }}
                    disabled={variables.some((v) => !v.value.trim())}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Filled Prompt
                  </Button>
                  <Button
                    onClick={exportPrompt}
                    variant="outline"
                    size="sm"
                    disabled={variables.some((v) => !v.value.trim())}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Library */}
          {templates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Saved Templates
                </CardTitle>
                <CardDescription>
                  Your saved prompt templates for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {template.description}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {template.variables.length} variables
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => loadTemplate(template.id)}
                            variant="outline"
                            size="sm"
                          >
                            Load
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

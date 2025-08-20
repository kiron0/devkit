"use client"

import React, { useState } from "react"
import {
  CommandBuilder,
  COMMON_WORKFLOWS,
  GIT_FLAGS,
  GIT_OPERATIONS,
} from "@/utils"
import { Copy, GitBranch } from "lucide-react"

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

export function GitCommandGenerator() {
  const [commandBuilder, setCommandBuilder] = useState<CommandBuilder>({
    operation: "",
    target: "",
    flags: [],
    options: {},
  })
  const [activeTab, setActiveTab] = useState("builder")

  const generateCommand = () => {
    if (!commandBuilder.operation) return ""

    let command = `git ${commandBuilder.operation}`

    if (commandBuilder.target) {
      command += ` ${commandBuilder.target}`
    }

    if (commandBuilder.flags.length > 0) {
      command += ` ${commandBuilder.flags.join(" ")}`
    }

    Object.entries(commandBuilder.options).forEach(([key, value]) => {
      if (value) {
        command += ` ${key} ${value}`
      }
    })

    return command
  }

  const copyCommand = async () => {
    const command = generateCommand()
    if (!command) return

    try {
      await navigator.clipboard.writeText(command)
      toast({
        title: "Command copied!",
        description: "Git command has been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy command:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy command to clipboard",
        variant: "destructive",
      })
    }
  }

  const updateCommandBuilder = (
    key: keyof CommandBuilder,
    value: string | string[] | Record<string, string>
  ) => {
    setCommandBuilder((prev) => ({ ...prev, [key]: value }))
  }

  const addFlag = (flag: string) => {
    if (!commandBuilder.flags.includes(flag)) {
      updateCommandBuilder("flags", [...commandBuilder.flags, flag])
    }
  }

  const removeFlag = (flag: string) => {
    updateCommandBuilder(
      "flags",
      commandBuilder.flags.filter((f) => f !== flag)
    )
  }

  const getOperationFlags = () => {
    return GIT_FLAGS[commandBuilder.operation as keyof typeof GIT_FLAGS] || []
  }

  const getOperationDescription = () => {
    const operation = GIT_OPERATIONS.find(
      (op) => op.value === commandBuilder.operation
    )
    return operation?.label || ""
  }

  const getOperationIcon = () => {
    const operation = GIT_OPERATIONS.find(
      (op) => op.value === commandBuilder.operation
    )
    return operation?.icon || GitBranch
  }

  const features = [
    {
      title: "Real-time Command Generation",
      description: "Instantly build Git commands as you select options",
      icon: "🔧",
    },
    {
      title: "Common Workflows",
      description: "Access frequently used Git workflows with examples",
      icon: "📚",
    },
    {
      title: "Quick Reference",
      description: "View common flags and options for each Git command",
      icon: "📖",
    },
    {
      title: "Copy to Clipboard",
      description: "Easily copy generated commands with one click",
      icon: "📋",
    },
  ]

  return (
    <ToolLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Git Command Generator</h1>
          <p className="text-muted-foreground">
            Interactive Git command builder with common workflows and
            explanations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">Command Builder</TabsTrigger>
            <TabsTrigger value="workflows">Common Workflows</TabsTrigger>
            <TabsTrigger value="reference">Quick Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Command Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Build Your Command</CardTitle>
                  <CardDescription>
                    Select operation and configure options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Operation</Label>
                    <Select
                      value={commandBuilder.operation}
                      onValueChange={(value) =>
                        updateCommandBuilder("operation", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Git operation" />
                      </SelectTrigger>
                      <SelectContent>
                        {GIT_OPERATIONS.map((operation) => {
                          const IconComponent = operation.icon
                          return (
                            <SelectItem
                              key={operation.value}
                              value={operation.value}
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                {operation.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {commandBuilder.operation && (
                    <>
                      <div className="space-y-2">
                        <Label>Target/Path</Label>
                        <Input
                          placeholder="e.g., . (current directory), filename, branch-name"
                          value={commandBuilder.target}
                          onChange={(e) =>
                            updateCommandBuilder("target", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Flags</Label>
                        <div className="flex flex-wrap gap-2">
                          {getOperationFlags().map((flag) => (
                            <Button
                              key={flag.flag}
                              size="sm"
                              variant={
                                commandBuilder.flags.includes(flag.flag)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                commandBuilder.flags.includes(flag.flag)
                                  ? removeFlag(flag.flag)
                                  : addFlag(flag.flag)
                              }
                              className="text-xs"
                            >
                              {flag.flag}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {commandBuilder.flags.length > 0 && (
                        <div className="space-y-2">
                          <Label>Selected Flags</Label>
                          <div className="flex flex-wrap gap-2">
                            {commandBuilder.flags.map((flag) => (
                              <Badge
                                key={flag}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {flag}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => removeFlag(flag)}
                                >
                                  ×
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Generated Command */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {commandBuilder.operation &&
                      React.createElement(getOperationIcon(), {
                        className: "h-5 w-5",
                      })}
                    Generated Command
                  </CardTitle>
                  <CardDescription>
                    {commandBuilder.operation
                      ? getOperationDescription()
                      : "Select an operation to generate a command"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {commandBuilder.operation ? (
                    <>
                      <div className="bg-muted rounded-lg p-4">
                        <code className="text-sm break-all">
                          {generateCommand()}
                        </code>
                      </div>
                      <Button onClick={copyCommand} className="w-full">
                        <Copy className="h-4 w-4" />
                        Copy Command
                      </Button>
                    </>
                  ) : (
                    <div className="text-muted-foreground py-8 text-center">
                      Select an operation to start building your command
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-6">
              {COMMON_WORKFLOWS.map((workflow, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            {stepIndex + 1}
                          </Badge>
                          <code className="bg-muted flex-1 rounded px-2 py-1 text-sm">
                            {step}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigator.clipboard.writeText(step)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reference" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(GIT_FLAGS).map(([operation, flags]) => (
                <Card key={operation}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      git {operation}
                    </CardTitle>
                    <CardDescription>Common flags and options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {flags.map((flag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {flag.flag}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {flag.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

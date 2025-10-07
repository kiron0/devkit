"use client"

import { useState } from "react"
import { Copy, Download } from "lucide-react"

import { toast } from "@/hooks/use-toast"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

interface CopyrightData {
  author: string
  fromYear: string
  toYear: string
  symbol: string
  text: string
  language: string
  useYearRange: boolean
}

const COPYRIGHT_SYMBOLS = [
  { value: "©", label: "© (Copyright symbol)" },
  { value: "&copy;", label: "&copy; (HTML entity)" },
  { value: "Copyright", label: "Copyright (Text)" },
]

const COPYRIGHT_TEMPLATES = [
  {
    label: "Standard with author & years",
    text: "© {from-year}–{to-year} {author}. All rights reserved.",
  },
  {
    label: "Minimal",
    text: "© {current-year} {author}",
  },
  {
    label: "Creative Commons",
    text: "© {current-year} {author}. Some rights reserved.",
  },
  {
    label: "MIT License Style",
    text: "© {current-year} {author}. Licensed under the MIT License.",
  },
  {
    label: "Apache License Style",
    text: "© {from-year}–{to-year} {author}. Licensed under the Apache License 2.0.",
  },
  {
    label: "GPL License Style",
    text: "© {current-year} {author}. This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License.",
  },
  {
    label: "BSD License Style",
    text: "© {from-year}–{to-year} {author}. All rights reserved. Redistribution and use in source and binary forms are permitted.",
  },
  {
    label: "Year Range Only",
    text: "© {from-year}–{to-year}",
  },
  {
    label: "Current Year Only",
    text: "© {current-year}",
  },
  {
    label: "Author Only",
    text: "© {author}",
  },
  {
    label: "No Rights Reserved",
    text: "© {current-year} {author}. No rights reserved.",
  },
  {
    label: "Public Domain",
    text: "© {current-year} {author}. This work is in the public domain.",
  },
  {
    label: "Attribution Required",
    text: "© {from-year}–{to-year} {author}. Attribution required when using this work.",
  },
  {
    label: "Commercial Use Allowed",
    text: "© {current-year} {author}. Commercial use is permitted with attribution.",
  },
  {
    label: "Educational Use",
    text: "© {from-year}–{to-year} {author}. Educational use is encouraged.",
  },
  {
    label: "Open Source",
    text: "© {current-year} {author}. Open source - contributions welcome.",
  },
  {
    label: "Website Footer",
    text: "© {from-year}–{to-year} {author}. All rights reserved. | Privacy Policy | Terms of Service",
  },
  {
    label: "Software License",
    text: "© {current-year} {author}. This software is provided 'as is' without warranty.",
  },
  {
    label: "Creative Work",
    text: "© {from-year}–{to-year} {author}. This creative work is protected by copyright.",
  },
  {
    label: "Documentation",
    text: "© {current-year} {author}. Documentation is available under Creative Commons license.",
  },
  {
    label: "Custom",
    text: "",
  },
]

const LANGUAGES = [
  { value: "html", label: "HTML" },
  { value: "javascript", label: "JavaScript" },
  { value: "nodejs", label: "Node.js (Express)" },
  { value: "php", label: "PHP" },
  { value: "wordpress", label: "WordPress" },
  { value: "laravel", label: "Laravel (Blade)" },
  { value: "django", label: "Django (Template)" },
  { value: "go", label: "Go (HTML Template)" },
  { value: "react", label: "React (JSX)" },
  { value: "vue", label: "Vue (SFC)" },
  { value: "angular", label: "Angular" },
]

export function CopyrightGenerator() {
  const [copyrightData, setCopyrightData] = useState<CopyrightData>({
    author: "",
    fromYear: (new Date().getFullYear() - 5).toString(),
    toYear: new Date().getFullYear().toString(),
    symbol: "©",
    text: "© {from-year}-{to-year} {author}. All rights reserved.",
    language: "javascript",
    useYearRange: true,
  })
  const [activeTab, setActiveTab] = useState("generator")

  const updateCopyrightData = (
    key: keyof CopyrightData,
    value: string | boolean
  ) => {
    if (key === "useYearRange") {
      setCopyrightData((prev) => {
        let newText = prev.text
        const boolValue = value as boolean

        if (boolValue === true) {
          newText = newText.replace(/{current-year}/g, "{from-year}-{to-year}")
        } else {
          newText = newText.replace(/{from-year}-{to-year}/g, "{current-year}")
        }

        return {
          ...prev,
          [key]: boolValue,
          text: newText,
        }
      })
    } else {
      setCopyrightData((prev) => ({
        ...prev,
        [key]: value,
      }))
    }
  }

  const applyTemplate = (template: (typeof COPYRIGHT_TEMPLATES)[0]) => {
    if (template.label === "Custom") {
      updateCopyrightData("text", "")
    } else {
      let templateText = template.text

      const hasYearRange =
        templateText.includes("{from-year}") &&
        templateText.includes("{to-year}")
      const hasCurrentYear = templateText.includes("{current-year}")

      if (hasYearRange && !hasCurrentYear) {
        setCopyrightData((prev) => ({
          ...prev,
          useYearRange: true,
          text: templateText,
        }))
      } else if (hasCurrentYear && !hasYearRange) {
        setCopyrightData((prev) => ({
          ...prev,
          useYearRange: false,
          text: templateText,
        }))
      } else {
        if (!copyrightData.useYearRange) {
          templateText = templateText.replace(
            /{from-year}-{to-year}/g,
            "{current-year}"
          )
        } else {
          templateText = templateText.replace(
            /{current-year}/g,
            "{from-year}-{to-year}"
          )
        }
        updateCopyrightData("text", templateText)
      }
    }
    setActiveTab("generator")
  }

  const getCurrentYear = () => new Date().getFullYear().toString()

  const processText = (text: string): string => {
    const currentYear = getCurrentYear()
    if (copyrightData.useYearRange) {
      return text
        .replace(/{current-year}/g, currentYear)
        .replace(/{from-year}/g, copyrightData.fromYear)
        .replace(/{to-year}/g, currentYear)
        .replace(/{author}/g, copyrightData.author)
    } else {
      let processed = text
        .replace(/{current-year}/g, currentYear)
        .replace(/{from-year}/g, currentYear)
        .replace(/{to-year}/g, currentYear)
        .replace(/{author}/g, copyrightData.author)

      processed = processed.replace(/\d{4}-\d{4}/g, currentYear)

      return processed
    }
  }

  const generateCopyright = (): string => {
    const processedText = processText(copyrightData.text)
    return processedText.replace(/©/g, copyrightData.symbol)
  }

  const generateCodeForLanguage = (language: string): string => {
    const copyright = generateCopyright()
    const fromYear = copyrightData.fromYear
    const author = copyrightData.author

    const createTemplateString = (template: string) => {
      let processedTemplate = template.replace(/©/g, copyrightData.symbol)

      if (copyrightData.useYearRange) {
        return processedTemplate
          .replace(/{current-year}/g, "${year}")
          .replace(/{from-year}/g, fromYear)
          .replace(/{to-year}/g, "${year}")
          .replace(/{author}/g, author)
      } else {
        processedTemplate = processedTemplate
          .replace(/{current-year}/g, "${year}")
          .replace(/{from-year}/g, "${year}")
          .replace(/{to-year}/g, "${year}")
          .replace(/{author}/g, author)

        processedTemplate = processedTemplate.replace(
          /\$\{year\}[–-]\$\{year\}/g,
          "${year}"
        )

        return processedTemplate
      }
    }

    switch (language) {
      case "html":
        const htmlCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `<!-- Copyright Notice -->
<!-- ${htmlCopyright} -->
<footer>
  <p id="copyright"></p>
</footer>

<script>
const year = new Date().getFullYear();
const copyright = \`${createTemplateString(copyrightData.text)}\`;
document.getElementById('copyright').textContent = copyright;
</script>`

      case "php":
        const phpFromYear = copyrightData.useYearRange
          ? fromYear
          : "$currentYear"
        return `<?php
/**
 * Copyright Notice
 * ${copyright}
 */

// Dynamic copyright with current year
$currentYear = date('Y');
$copyright = str_replace(['{current-year}', '{from-year}', '{to-year}', '{author}'],
                        [$currentYear, '${phpFromYear}', $currentYear, '${author}'],
                        '${copyright}');
echo "<p>$copyright</p>";
?>`

      case "javascript":
        const jsCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `/**
 * Copyright Notice
 * ${jsCopyright}
 */

// Dynamic copyright with current year
const year = new Date().getFullYear();
const copyright = \`${createTemplateString(copyrightData.text)}\`;
console.log(copyright);`

      case "react":
        const reactCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `/**
 * Copyright Notice
 * ${reactCopyright}
 */

import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  const copyright = \`${createTemplateString(copyrightData.text)}\`;

  return (
    <footer>
      <p>{copyright}</p>
    </footer>
  );
};

export default Footer;`

      case "vue":
        const vueCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `<!--
  Copyright Notice
  ${vueCopyright}
-->

<template>
  <footer>
    <p>{{ copyright }}</p>
  </footer>
</template>

<script>
export default {
  computed: {
    copyright() {
      const year = new Date().getFullYear();
      return \`${createTemplateString(copyrightData.text)}\`;
    }
  }
}
</script>`

      case "angular":
        const angularCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `/**
 * Copyright Notice
 * ${angularCopyright}
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: \`
    <footer>
      <p>{{ copyright }}</p>
    </footer>
  \`
})
export class FooterComponent {
  get copyright(): string {
    const year = new Date().getFullYear();
    return \`${createTemplateString(copyrightData.text)}\`;
  }
}`

      case "wordpress":
        const wpFromYear = copyrightData.useYearRange
          ? fromYear
          : "$currentYear"
        const wpCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `<?php
/**
 * Copyright Notice
 * ${wpCopyright}
 */

// Add to your theme's functions.php
function get_dynamic_copyright() {
    $currentYear = date('Y');
    $copyright = str_replace(['{current-year}', '{from-year}', '{to-year}', '{author}'],
                            [$currentYear, '${wpFromYear}', $currentYear, '${author}'],
                            '${copyright}');
    return $copyright;
}

// Add to your theme's footer.php
echo '<p>' . get_dynamic_copyright() . '</p>';`

      case "laravel":
        const laravelFromYear = copyrightData.useYearRange
          ? fromYear
          : "$currentYear"
        const laravelCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `<?php
/**
 * Copyright Notice
 * ${laravelCopyright}
 */

// Add to your Blade template
@php
    $currentYear = date('Y');
    $copyright = str_replace(['{current-year}', '{from-year}', '{to-year}', '{author}'],
                            [$currentYear, '${laravelFromYear}', $currentYear, '${author}'],
                            '${copyright}');
@endphp
<p>{{ $copyright }}</p>`

      case "django":
        const djangoFromYear = copyrightData.useYearRange
          ? `'${fromYear}'`
          : "str(current_year)"
        const djangoCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `# Copyright Notice
# ${djangoCopyright}

# In your template
from datetime import datetime

def get_copyright():
    current_year = datetime.now().year
    copyright_text = '${copyright}'.replace('{current-year}', str(current_year))
    copyright_text = copyright_text.replace('{from-year}', ${djangoFromYear})
    copyright_text = copyright_text.replace('{to-year}', str(current_year))
    copyright_text = copyright_text.replace('{author}', '${author}')
    return copyright_text

# In your template
<p>{{ get_copyright() }}</p>`

      case "nodejs":
        const nodeCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `/**
 * Copyright Notice
 * ${nodeCopyright}
 */

// Express.js example
const express = require('express');
const app = express();

const getCopyright = () => {
  const year = new Date().getFullYear();
  return \`${createTemplateString(copyrightData.text)}\`;
};

// In your route or middleware
app.get('/', (req, res) => {
  res.send(\`
    <footer>
      <p>\${getCopyright()}</p>
    </footer>
  \`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`

      case "go":
        const goFromYear = copyrightData.useYearRange
          ? `"${fromYear}"`
          : 'fmt.Sprintf("%d", currentYear)'
        const goCopyright = copyrightData.useYearRange
          ? copyright
          : copyright.replace(/\d{4}[–-]\d{4}/g, getCurrentYear())
        return `// Copyright Notice
// ${goCopyright}

package main

import (
    "fmt"
    "html/template"
    "strings"
    "time"
    "os"
)

func getCopyright() string {
    currentYear := time.Now().Year()
    copyright := "${copyright}"
    // Replace placeholders
    copyright = strings.ReplaceAll(copyright, "{current-year}", fmt.Sprintf("%d", currentYear))
    copyright = strings.ReplaceAll(copyright, "{from-year}", ${goFromYear})
    copyright = strings.ReplaceAll(copyright, "{to-year}", fmt.Sprintf("%d", currentYear))
    copyright = strings.ReplaceAll(copyright, "{author}", "${author}")
    return copyright
}

// HTML Template usage
const htmlTemplate = \`
<footer>
    <p>{{.Copyright}}</p>
</footer>
\`

func main() {
    tmpl := template.Must(template.New("footer").Parse(htmlTemplate))
    data := struct {
        Copyright string
    }{
        Copyright: getCopyright(),
    }
    tmpl.Execute(os.Stdout, data)
}`

      case "plain":
      default:
        return copyright
    }
  }

  const copyCode = async () => {
    try {
      const code = generateCodeForLanguage(copyrightData.language)
      await navigator.clipboard.writeText(code)
      toast({
        title: "Code copied!",
        description: "Copyright code has been copied to clipboard",
      })
    } catch (error) {
      console.error("Failed to copy code:", error)
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadCode = () => {
    const code = generateCodeForLanguage(copyrightData.language)

    const getFileExtension = (language: string): string => {
      switch (language) {
        case "html":
          return "html"
        case "javascript":
          return "js"
        case "nodejs":
          return "js"
        case "php":
          return "php"
        case "wordpress":
          return "php"
        case "laravel":
          return "php"
        case "django":
          return "py"
        case "go":
          return "go"
        case "react":
          return "jsx"
        case "vue":
          return "vue"
        case "angular":
          return "ts"
        default:
          return "txt"
      }
    }

    const extension = getFileExtension(copyrightData.language)
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `copyright.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const features = [
    {
      title: "Multiple Formats",
      description:
        "Generate copyright notices for HTML, PHP, JavaScript, React, Vue, and 30+ programming languages.",
      icon: "💻",
    },
    {
      title: "Dynamic Years",
      description:
        "Auto-updating year placeholders that stay current without manual updates.",
      icon: "📅",
    },
    {
      title: "Custom Templates",
      description:
        "Choose from pre-built templates or create your own custom copyright text.",
      icon: "📝",
    },
    {
      title: "Legal Protection",
      description:
        "Proper copyright notices help protect your intellectual property rights.",
      icon: "⚖️",
    },
  ]

  return (
    <ToolLayout
      title="Copyright Code Generator"
      description="Create copyright snippets for your website in seconds. Supports HTML, PHP, JavaScript, WordPress, Laravel, Django, React, and more."
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Copyright Configuration</CardTitle>
                  <CardDescription>
                    Customize your copyright notice details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author/Company Name</Label>
                    <Input
                      id="author"
                      placeholder="Enter author or company name"
                      value={copyrightData.author}
                      onChange={(e) =>
                        updateCopyrightData("author", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="useYearRange"
                      checked={copyrightData.useYearRange}
                      onCheckedChange={(checked: boolean) =>
                        updateCopyrightData("useYearRange", checked)
                      }
                    />
                    <Label htmlFor="useYearRange" className="text-sm">
                      Use year range (e.g., 2020-2024)
                    </Label>
                  </div>

                  {copyrightData.useYearRange && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromYear">From Year</Label>
                        <Input
                          id="fromYear"
                          type="number"
                          placeholder="2020"
                          value={copyrightData.fromYear}
                          onChange={(e) =>
                            updateCopyrightData("fromYear", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toYear">To Year</Label>
                        <Input
                          id="toYear"
                          type="number"
                          placeholder="2024"
                          value={copyrightData.toYear}
                          onChange={(e) =>
                            updateCopyrightData("toYear", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="symbol">Copyright Symbol</Label>
                    <Select
                      value={copyrightData.symbol}
                      onValueChange={(value) =>
                        updateCopyrightData("symbol", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select copyright symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {COPYRIGHT_SYMBOLS.map((symbol) => (
                          <SelectItem key={symbol.value} value={symbol.value}>
                            {symbol.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={copyrightData.language}
                      onValueChange={(value) =>
                        updateCopyrightData("language", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select programming language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Copyright Text</CardTitle>
                  <CardDescription>
                    Customize your copyright notice text with placeholders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Copyright Text</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter your custom copyright text"
                      value={copyrightData.text}
                      onChange={(e) =>
                        updateCopyrightData("text", e.target.value)
                      }
                      className="h-[100px] resize-none overflow-y-auto"
                    />
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="mb-2 text-sm font-medium">
                      Available Placeholders:
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <div>
                        <code className="bg-background rounded px-1">
                          {"{current-year}"}
                        </code>{" "}
                        - Current year
                      </div>
                      <div>
                        <code className="bg-background rounded px-1">
                          {"{from-year}"}
                        </code>{" "}
                        - Start year
                      </div>
                      <div>
                        <code className="bg-background rounded px-1">
                          {"{to-year}"}
                        </code>{" "}
                        - End year
                      </div>
                      <div>
                        <code className="bg-background rounded px-1">
                          {"{author}"}
                        </code>{" "}
                        - Author name
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="mb-2 text-sm font-medium">Preview:</div>
                    <div className="text-muted-foreground text-sm">
                      {generateCopyright() || "Enter text to see preview"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Copyright Templates</CardTitle>
                <CardDescription>
                  Choose from pre-built copyright templates or create your own
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {COPYRIGHT_TEMPLATES.map((template, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted cursor-pointer rounded-lg border p-4 transition-colors"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="mb-2 font-medium">{template.label}</div>
                      <div className="text-muted-foreground text-sm">
                        {template.text || "Create your own custom template"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
            <CardDescription>
              Copy the generated copyright code for your selected language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Copyright Code (
                {
                  LANGUAGES.find((l) => l.value === copyrightData.language)
                    ?.label
                }
                )
              </Label>
              <CodeHighlighter
                language={
                  copyrightData.language === "html"
                    ? "html"
                    : copyrightData.language === "javascript"
                      ? "javascript"
                      : copyrightData.language === "nodejs"
                        ? "javascript"
                        : copyrightData.language === "php"
                          ? "php"
                          : copyrightData.language === "wordpress"
                            ? "php"
                            : copyrightData.language === "laravel"
                              ? "php"
                              : copyrightData.language === "django"
                                ? "python"
                                : copyrightData.language === "go"
                                  ? "go"
                                  : copyrightData.language === "react"
                                    ? "jsx"
                                    : copyrightData.language === "vue"
                                      ? "vue"
                                      : copyrightData.language === "angular"
                                        ? "typescript"
                                        : "plain"
                }
                className="max-h-[300px] min-h-[200px] overflow-y-auto"
              >
                {generateCodeForLanguage(copyrightData.language)}
              </CodeHighlighter>
              <div className="flex gap-2">
                <Button onClick={copyCode} className="flex-1">
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
                <Button onClick={downloadCode} variant="outline">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureGrid, ToolLayout } from "@/components/common"

import { HtmlToPdf } from "./html-to-pdf"
import { PdfToHtml } from "./pdf-to-html"

export function HtmlPdfConverter() {
  const [mode, setMode] = useState<"html-to-pdf" | "pdf-to-html">("html-to-pdf")

  const features = [
    {
      title: "Bidirectional Conversion",
      description: "Convert HTML to PDF or extract content from PDF to HTML",
      icon: "🔄",
    },
    {
      title: "Full Page Control",
      description: "Customize paper size, orientation, margins, DPI, and more",
      icon: "📄",
    },
    {
      title: "Headers & Footers",
      description:
        "Add dynamic headers and footers with page numbers and dates",
      icon: "📋",
    },
    {
      title: "Live Preview",
      description: "See real-time preview of your PDF with debounced updates",
      icon: "👁️",
    },
    {
      title: "Print Backgrounds",
      description: "Option to include or exclude background colors and images",
      icon: "🎨",
    },
    {
      title: "Local Processing",
      description:
        "All conversion happens in your browser - completely private",
      icon: "🔒",
    },
  ]

  return (
    <ToolLayout
      title="HTML ↔ PDF Converter"
      description="Convert HTML to paginated PDF with full control over size, margins, headers/footers, and print backgrounds. Extract text from PDF to basic HTML. Everything runs locally."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Conversion Mode
            </CardTitle>
            <CardDescription>
              Choose between HTML to PDF or PDF to HTML conversion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "html-to-pdf" | "pdf-to-html")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html-to-pdf">HTML → PDF</TabsTrigger>
                <TabsTrigger value="pdf-to-html">PDF → HTML</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {mode === "html-to-pdf" ? (
          <HtmlToPdf />
        ) : mode === "pdf-to-html" ? (
          <PdfToHtml />
        ) : null}
      </div>

      <div className="bg-muted/50 mt-6 rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">How to Use</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>HTML → PDF:</strong> Paste HTML (and optional CSS) to make a
            multi-page PDF. Change options to see debounced updates instantly.
          </p>
          <p>
            <strong>PDF → HTML:</strong> Upload a PDF to extract page text and
            quick image previews.
          </p>
          <p>
            <strong>Variables:</strong> Use {"{page}"} for current page,{" "}
            {"{pages}"} for total pages, and {"{date}"} for current date in
            headers/footers.
          </p>
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

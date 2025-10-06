"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Config } from "@/config"
import * as culori from "culori"
import { jsPDF } from "jspdf"
import { Download, Loader2, RefreshCw } from "lucide-react"

import { useDebouncedValue } from "@/hooks/use-debounced-value"
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Convert CSS Color 4 function strings to rgb() where possible
function normalizeCssColors(input: string): string {
  if (!input) return input
  // Match color(...) or lab()/lch()/oklab()/oklch() occurrences
  const patterns = [
    /lab\(([^)]+)\)/g,
    /lch\(([^)]+)\)/g,
    /oklab\(([^)]+)\)/g,
    /oklch\(([^)]+)\)/g,
  ]
  let output = input

  for (const re of patterns) {
    output = output.replace(re, (match) => {
      try {
        const parsed = culori.parse(match)
        if (!parsed) return match
        const rgb = culori.formatRgb(parsed)
        return rgb || match
      } catch {
        return match
      }
    })
  }
  return output
}

interface PaperSize {
  label: string
  width: number
  height: number
}

const PAPER_SIZES: Record<string, PaperSize> = {
  a4: { label: "A4 (210x297 mm)", width: 210, height: 297 },
  letter: { label: "Letter (8.5x11 in)", width: 215.9, height: 279.4 },
  legal: { label: "Legal (8.5x14 in)", width: 215.9, height: 355.6 },
  custom: { label: "Custom", width: 210, height: 297 },
}

const DPI_OPTIONS = [
  { value: "72", label: "72" },
  { value: "300", label: "300" },
]

export function HtmlToPdf() {
  const [htmlInput, setHtmlInput] = useState(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Demo</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; }
      .page-break { page-break-before: always; }
      h1 { margin: 0 0 8px; }
      p { margin: 0 0 10px; line-height: 1.5; }
      table { border-collapse: collapse; width: 100%; margin-top: 8px; }
      th, td { border: 1px solid #ddd; padding: 6px 8px; }
    </style>
  </head>
  <body>
    <h1>Report — ${Config.title}</h1>
    <p>This is a demo HTML that will paginate into a PDF. Use Options to change page size and margins.</p>
    <table>
      <thead><tr><th>#</th><th>Item</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>Row 1</td><td>0.40687</td></tr><tr><td>2</td><td>Row 2</td><td>0.62527</td></tr><tr><td>3</td><td>Row 3</td><td>0.20983</td></tr><tr><td>4</td><td>Row 4</td><td>0.12603</td></tr><tr><td>5</td><td>Row 5</td><td>0.51709</td></tr><tr><td>6</td><td>Row 6</td><td>0.58856</td></tr><tr><td>7</td><td>Row 7</td><td>0.71811</td></tr><tr><td>8</td><td>Row 8</td><td>0.52290</td></tr><tr><td>9</td><td>Row 9</td><td>0.01699</td></tr><tr><td>10</td><td>Row 10</td><td>0.34310</td></tr><tr><td>11</td><td>Row 11</td><td>0.57367</td></tr><tr><td>12</td><td>Row 12</td><td>0.86104</td></tr><tr><td>13</td><td>Row 13</td><td>0.17870</td></tr><tr><td>14</td><td>Row 14</td><td>0.31545</td></tr><tr><td>15</td><td>Row 15</td><td>0.24790</td></tr><tr><td>16</td><td>Row 16</td><td>0.36570</td></tr><tr><td>17</td><td>Row 17</td><td>0.13696</td></tr><tr><td>18</td><td>Row 18</td><td>0.01468</td></tr><tr><td>19</td><td>Row 19</td><td>0.73699</td></tr><tr><td>20</td><td>Row 20</td><td>0.23187</td></tr><tr><td>21</td><td>Row 21</td><td>0.05275</td></tr><tr><td>22</td><td>Row 22</td><td>0.06465</td></tr><tr><td>23</td><td>Row 23</td><td>0.93018</td></tr><tr><td>24</td><td>Row 24</td><td>0.64395</td></tr><tr><td>25</td><td>Row 25</td><td>0.03863</td></tr><tr><td>26</td><td>Row 26</td><td>0.98528</td></tr><tr><td>27</td><td>Row 27</td><td>0.29358</td></tr><tr><td>28</td><td>Row 28</td><td>0.80231</td></tr><tr><td>29</td><td>Row 29</td><td>0.18110</td></tr><tr><td>30</td><td>Row 30</td><td>0.58631</td></tr><tr><td>31</td><td>Row 31</td><td>0.86933</td></tr><tr><td>32</td><td>Row 32</td><td>0.69196</td></tr><tr><td>33</td><td>Row 33</td><td>0.75439</td></tr><tr><td>34</td><td>Row 34</td><td>0.06227</td></tr><tr><td>35</td><td>Row 35</td><td>0.53178</td></tr><tr><td>36</td><td>Row 36</td><td>0.01549</td></tr><tr><td>37</td><td>Row 37</td><td>0.13721</td></tr><tr><td>38</td><td>Row 38</td><td>0.09223</td></tr><tr><td>39</td><td>Row 39</td><td>0.52866</td></tr><tr><td>40</td><td>Row 40</td><td>0.74490</td></tr>
      </tbody>
    </table>
    <div class="page-break"></div>
    <p>Second page content… You can insert your own CSS too.</p>
  </body>
</html>`)
  const [extraCss, setExtraCss] = useState("")
  const [paperSize, setPaperSize] = useState("a4")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  )
  const [dpi, setDpi] = useState("72")
  const [margins, setMargins] = useState({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  })
  const [headerText, setHeaderText] = useState("")
  const [footerText, setFooterText] = useState("")
  const [printBackgrounds, setPrintBackgrounds] = useState(true)
  const [outputFilename, setOutputFilename] = useState("document")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pdfStats, setPdfStats] = useState({
    pages: 0,
    renderTime: 0,
    estimatedSize: 0,
  })

  const previewRef = useRef<HTMLIFrameElement>(null)
  const lastPreviewUrlRef = useRef<string | null>(null)

  const debouncedHtml = useDebouncedValue(htmlInput, 500)
  const debouncedCss = useDebouncedValue(extraCss, 500)

  const estimatePages = useCallback(
    (html: string): number => {
      const baseHeight =
        orientation === "portrait"
          ? PAPER_SIZES[paperSize].height
          : PAPER_SIZES[paperSize].width
      const contentHeight = html.length / 200
      return Math.max(1, Math.ceil(contentHeight / baseHeight))
    },
    [orientation, paperSize]
  )

  useEffect(() => {
    const hasContent =
      (debouncedHtml && debouncedHtml.trim().length > 0) ||
      (debouncedCss && debouncedCss.trim().length > 0)

    if (!hasContent) {
      if (lastPreviewUrlRef.current) {
        URL.revokeObjectURL(lastPreviewUrlRef.current)
        lastPreviewUrlRef.current = null
      }
      setPreviewUrl(null)
      setPdfStats({ pages: 0, renderTime: 0, estimatedSize: 0 })
      return
    }

    const startTime = performance.now()
    try {
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                margin: 0;
                padding: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
                font-family: Arial, sans-serif;
                ${printBackgrounds ? "" : "print-color-adjust: exact; -webkit-print-color-adjust: exact;"}
              }
              @media print {
                @page {
                  size: ${PAPER_SIZES[paperSize].width}mm ${PAPER_SIZES[paperSize].height}mm;
                  margin: 0;
                }
              }
              ${debouncedCss || ""}
            </style>
          </head>
          <body>
            ${debouncedHtml || "<p>Type or paste HTML to preview.</p>"}
          </body>
        </html>
      `

      const blob = new Blob([fullHtml], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      if (lastPreviewUrlRef.current) {
        URL.revokeObjectURL(lastPreviewUrlRef.current)
      }
      lastPreviewUrlRef.current = url
      setPreviewUrl(url)

      const endTime = performance.now()
      const renderTime = Math.round(endTime - startTime)
      const estimatedSize = Math.round(fullHtml.length * 0.8)

      setPdfStats({
        pages: estimatePages(debouncedHtml || ""),
        renderTime,
        estimatedSize,
      })
    } catch (error) {
      console.error("Preview generation error:", error)
    }

    return () => {}
  }, [
    debouncedHtml,
    debouncedCss,
    margins,
    paperSize,
    printBackgrounds,
    estimatePages,
  ])

  const generatePDF = async () => {
    if (!htmlInput) {
      toast({
        title: "No content",
        description: "Please enter HTML content to convert",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const pageWidth =
        orientation === "portrait"
          ? PAPER_SIZES[paperSize].width
          : PAPER_SIZES[paperSize].height
      const pageHeight =
        orientation === "portrait"
          ? PAPER_SIZES[paperSize].height
          : PAPER_SIZES[paperSize].width

      // Create hidden container for rendering
      const tempContainer = document.createElement("div")
      tempContainer.style.position = "absolute"
      tempContainer.style.left = "-9999px"
      tempContainer.style.top = "0"
      tempContainer.style.width = `${(pageWidth - margins.left - margins.right) * 3.78}px` // mm to px
      tempContainer.style.padding = `${margins.top * 3.78}px ${margins.right * 3.78}px ${margins.bottom * 3.78}px ${margins.left * 3.78}px`
      tempContainer.style.backgroundColor = printBackgrounds
        ? "white"
        : "transparent"
      tempContainer.style.fontFamily = "Arial, sans-serif"

      // Add styles (with unsupported color function replacement)
      const sanitizedCss = normalizeCssColors(extraCss || "").replace(
        /color\([^)]+\)/g,
        (m) => {
          try {
            const p = culori.parse(m)
            return culori.formatRgb(p) || m
          } catch {
            return m
          }
        }
      )

      const styleEl = document.createElement("style")
      styleEl.textContent = `${sanitizedCss}\n* { box-sizing: border-box; }`
      tempContainer.appendChild(styleEl)

      // Add content (sanitize inline styles with unsupported colors)
      const sanitizedHtml = normalizeCssColors(htmlInput).replace(
        /color\([^)]+\)/g,
        (m) => {
          try {
            const p = culori.parse(m)
            return culori.formatRgb(p) || m
          } catch {
            return m
          }
        }
      )

      const contentDiv = document.createElement("div")
      contentDiv.innerHTML = sanitizedHtml
      tempContainer.appendChild(contentDiv)

      document.body.appendChild(tempContainer)

      // Dynamic import of html2canvas (client-side only)
      const html2canvas = (await import("html2canvas")).default

      // Suppress console warnings about unsupported color functions
      const originalWarn = console.warn
      const originalError = console.error
      console.warn = (...args: unknown[]) => {
        const message = args[0]?.toString() || ""
        if (
          !message.includes("unsupported color") &&
          !message.includes("lab") &&
          !message.includes("lch") &&
          !message.includes("oklab") &&
          !message.includes("oklch")
        ) {
          originalWarn(...args)
        }
      }
      console.error = (...args: unknown[]) => {
        const message = args[0]?.toString() || ""
        if (
          !message.includes("unsupported color") &&
          !message.includes("lab") &&
          !message.includes("lch") &&
          !message.includes("oklab") &&
          !message.includes("oklch")
        ) {
          originalError(...args)
        }
      }

      // Capture as canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
        onclone: (clonedDoc) => {
          // Process cloned document to handle unsupported CSS features
          // Sanitize <style> tags content
          const styleTags = clonedDoc.querySelectorAll("style")
          styleTags.forEach((tag) => {
            if (tag.textContent) {
              let txt = tag.textContent
              txt = normalizeCssColors(txt)
              txt = txt.replace(/color\([^)]+\)/g, (m) => {
                try {
                  const p = culori.parse(m)
                  return culori.formatRgb(p) || m
                } catch {
                  return m
                }
              })
              tag.textContent = txt
            }
          })
          const styles = clonedDoc.querySelectorAll("*")
          styles.forEach((element) => {
            const htmlElement = element as HTMLElement

            // Remove all style attributes that might contain unsupported colors
            const styleAttr = htmlElement.getAttribute("style")
            if (styleAttr) {
              let sanitizedStyle = normalizeCssColors(styleAttr)
              sanitizedStyle = sanitizedStyle.replace(
                /color\([^)]+\)/g,
                (m) => {
                  try {
                    const p = culori.parse(m)
                    return culori.formatRgb(p) || m
                  } catch {
                    return m
                  }
                }
              )
              htmlElement.setAttribute("style", sanitizedStyle)
            }

            // Also check and sanitize computed styles
            try {
              const computedStyle = window.getComputedStyle(element)
              const colorProperties = [
                "color",
                "backgroundColor",
                "borderColor",
                "borderTopColor",
                "borderRightColor",
                "borderBottomColor",
                "borderLeftColor",
                "outlineColor",
              ] as const

              colorProperties.forEach((prop) => {
                const value = computedStyle.getPropertyValue(prop)
                const normalized = normalizeCssColors(value)
                if (normalized !== value) {
                  htmlElement.style.setProperty(prop, normalized, "important")
                }
              })
            } catch {
              // Ignore errors from getComputedStyle
            }
          })
        },
      })

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: [pageWidth, pageHeight],
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const imgWidth = pageWidth - margins.left - margins.right
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = margins.top

      // Add first page
      pdf.addImage(
        imgData,
        "JPEG",
        margins.left,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      )
      heightLeft -= pageHeight - margins.top - margins.bottom

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margins.top
        pdf.addPage()
        pdf.addImage(
          imgData,
          "JPEG",
          margins.left,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        )
        heightLeft -= pageHeight - margins.top - margins.bottom
      }

      // Add headers and footers
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)

        if (headerText) {
          const processedHeader = processHeaderFooter(headerText, i, pageCount)
          pdf.setFontSize(10)
          pdf.setTextColor(0, 0, 0)
          pdf.text(processedHeader, margins.left, margins.top - 5)
        }

        if (footerText) {
          const processedFooter = processHeaderFooter(footerText, i, pageCount)
          pdf.setFontSize(10)
          pdf.setTextColor(0, 0, 0)
          pdf.text(
            processedFooter,
            margins.left,
            pageHeight - margins.bottom + 5
          )
        }
      }

      // Save PDF
      pdf.save(`${outputFilename || "document"}.pdf`)

      // Cleanup container after generation
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer)
      }

      toast({
        title: "PDF Generated",
        description: `Successfully created ${pageCount} page${pageCount > 1 ? "s" : ""}`,
      })

      setIsGenerating(false)
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Generation failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate PDF. Please check your HTML.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const processHeaderFooter = (
    text: string,
    page: number,
    totalPages: number
  ): string => {
    return text
      .replace(/{page}/g, page.toString())
      .replace(/{pages}/g, totalPages.toString())
      .replace(/{date}/g, new Date().toLocaleDateString())
  }

  const clearAll = () => {
    setHtmlInput("")
    setExtraCss("")
    setPaperSize("a4")
    setOrientation("portrait")
    setDpi("72")
    setMargins({ top: 10, right: 10, bottom: 10, left: 10 })
    setHeaderText("")
    setFooterText("")
    setPrintBackgrounds(true)
    setOutputFilename("document")
    setPreviewUrl(null)
    setPdfStats({ pages: 0, renderTime: 0, estimatedSize: 0 })
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 KB"
    const k = 1024
    return Math.round(bytes / k) + " KB"
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HTML Input</CardTitle>
              <CardDescription>
                Enter or paste your HTML content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="<div>Your HTML here...</div>"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className="h-[595px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extra CSS (optional)</CardTitle>
              <CardDescription>
                Add custom styles to your document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="h1 { color: blue; }"
                value={extraCss}
                onChange={(e) => setExtraCss(e.target.value)}
                className="h-[200px] resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>
                Configure paper size, orientation, and DPI
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <Select value={paperSize} onValueChange={setPaperSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAPER_SIZES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select
                  value={orientation}
                  onValueChange={(v) =>
                    setOrientation(v as "portrait" | "landscape")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>DPI</Label>
                <Select value={dpi} onValueChange={setDpi}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select DPI" />
                  </SelectTrigger>
                  <SelectContent>
                    {DPI_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Margins (mm)</CardTitle>
              <CardDescription>Set page margins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Top</Label>
                  <Input
                    type="number"
                    value={margins.top}
                    onChange={(e) =>
                      setMargins({ ...margins, top: Number(e.target.value) })
                    }
                    min={0}
                    max={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Right</Label>
                  <Input
                    type="number"
                    value={margins.right}
                    onChange={(e) =>
                      setMargins({ ...margins, right: Number(e.target.value) })
                    }
                    min={0}
                    max={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bottom</Label>
                  <Input
                    type="number"
                    value={margins.bottom}
                    onChange={(e) =>
                      setMargins({ ...margins, bottom: Number(e.target.value) })
                    }
                    min={0}
                    max={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Left</Label>
                  <Input
                    type="number"
                    value={margins.left}
                    onChange={(e) =>
                      setMargins({ ...margins, left: Number(e.target.value) })
                    }
                    min={0}
                    max={50}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header & Footer</CardTitle>
              <CardDescription>
                Use {"{page}"}, {"{pages}"}, {"{date}"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Header</Label>
                <Input
                  placeholder="e.g., Page {page} of {pages}"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Footer</Label>
                <Input
                  placeholder="e.g., Generated on {date}"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Print Backgrounds</Label>
                  <p className="text-muted-foreground text-sm">
                    Include background colors and images
                  </p>
                </div>
                <Switch
                  checked={printBackgrounds}
                  onCheckedChange={setPrintBackgrounds}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Output Filename</Label>
                <Input
                  placeholder="document"
                  value={outputFilename}
                  onChange={(e) => setOutputFilename(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {pdfStats.pages} Page{pdfStats.pages !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary">{pdfStats.renderTime} ms Render</Badge>
              <Badge variant="secondary">
                {formatBytes(pdfStats.estimatedSize)} Est. Size
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>Live preview of your HTML content</CardDescription>
        </CardHeader>
        <CardContent>
          {previewUrl ? (
            <iframe
              ref={previewRef}
              src={previewUrl}
              className="h-[500px] w-full rounded-lg border"
              title="Preview"
            />
          ) : (
            <div className="bg-muted/50 flex h-[500px] items-center justify-center rounded-lg border">
              <div className="text-muted-foreground text-center">
                <p>Type or paste HTML to preview.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={generatePDF}
          disabled={!htmlInput || isGenerating}
          className="flex-1"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={clearAll}
          disabled={isGenerating}
          size="lg"
        >
          <RefreshCw className="h-4 w-4" />
          Clear All
        </Button>
      </div>
    </>
  )
}

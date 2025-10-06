"use client"

import { useRef, useState } from "react"
import { Download, FileText, Loader2, RefreshCw, Upload, X } from "lucide-react"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function PdfToHtml() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [extractedHtml, setExtractedHtml] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePdfUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    setPdfFile(file)
    setIsExtracting(true)

    try {
      // Dynamic import of pdfjs-dist (client-side only)
      const pdfjsLib = await import("pdfjs-dist")

      // Configure PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages

      const pageTexts: Array<{
        pageNum: number
        text: string
        width: number
        height: number
      }> = []

      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const viewport = page.getViewport({ scale: 1.0 })

        // Combine text items
        const pageText = textContent.items
          .map((item) => {
            if (typeof item === "object" && item !== null && "str" in item) {
              return String(item.str)
            }
            return ""
          })
          .join(" ")

        pageTexts.push({
          pageNum,
          text: pageText,
          width: viewport.width,
          height: viewport.height,
        })
      }

      // Generate HTML with extracted content
      let htmlContent = ""

      pageTexts.forEach(({ pageNum, text, width, height }) => {
        htmlContent += `  <div class="page" data-page="${pageNum}" style="width: ${Math.round(width)}px; min-height: ${Math.round(height)}px;">
    <div class="page-header">
      <span class="page-number">Page ${pageNum} of ${numPages}</span>
      <span class="page-size">${Math.round(width)}×${Math.round(height)}px</span>
    </div>
    <div class="page-content">
      ${text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => `<p>${line.trim()}</p>`)
        .join("\n      ")}
    </div>
  </div>

`
      })

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted from ${file.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }

    .document-header {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .document-header h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #1a1a1a;
    }

    .document-meta {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #666;
    }

    .page {
      background: white;
      margin-bottom: 20px;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      page-break-after: always;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }

    .page-number {
      font-weight: 600;
      color: #333;
    }

    .page-content p {
      margin-bottom: 12px;
      line-height: 1.8;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .document-header {
        box-shadow: none;
      }

      .page {
        box-shadow: none;
        margin: 0;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="document-header">
    <h1>Extracted PDF Content</h1>
    <div class="document-meta">
      <span><strong>Source:</strong> ${file.name}</span>
      <span><strong>Pages:</strong> ${numPages}</span>
      <span><strong>Size:</strong> ${formatBytes(file.size)}</span>
    </div>
  </div>

${htmlContent}
</body>
</html>`

      setExtractedHtml(html)

      toast({
        title: "PDF Extracted",
        description: `Successfully extracted ${numPages} page${numPages > 1 ? "s" : ""} with text content`,
      })
    } catch (error) {
      console.error("PDF extraction error:", error)
      toast({
        title: "Extraction failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to extract content from PDF",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const downloadHTML = () => {
    const blob = new Blob([extractedHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${pdfFile?.name.replace(".pdf", "") || "extracted"}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearPdfExtraction = () => {
    setPdfFile(null)
    setExtractedHtml("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 KB"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDF
          </CardTitle>
          <CardDescription>
            Select a PDF file to extract text content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pdfFile ? (
            <div
              className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-muted-foreground text-sm">
                PDF files with text content
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  e.target.files?.[0] && handlePdfUpload(e.target.files[0])
                }
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-muted-foreground h-8 w-8" />
                  <div>
                    <p className="font-medium">{pdfFile.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatBytes(pdfFile.size)}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearPdfExtraction}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isExtracting && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground text-sm">
                    Extracting text from PDF...
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {extractedHtml && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Extracted HTML</CardTitle>
              <CardDescription>
                HTML with extracted text content from PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={extractedHtml}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={downloadHTML} className="flex-1" size="lg">
              <Download className="h-4 w-4" />
              Download HTML
            </Button>
            <Button variant="outline" onClick={clearPdfExtraction} size="lg">
              <RefreshCw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </>
      )}
    </>
  )
}

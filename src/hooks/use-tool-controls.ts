import { useCallback } from "react"

import { useToast } from "./use-toast"

interface UseToolControlsProps {
  hasData?: boolean
}

export function useToolControls({ hasData }: UseToolControlsProps) {
  const { toast } = useToast()

  const handleDownload = useCallback(
    (content: string, filename: string, mimeType = "text/plain") => {
      if (!content.trim()) {
        toast({
          title: "No content",
          description: "Nothing to download",
          variant: "destructive",
        })
        return
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded",
        description: `${filename} has been downloaded`,
      })
    },
    [toast]
  )

  const handleFileUpload = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      onFileContent: (content: string, filename: string) => void
    ) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          onFileContent(content, file.name)
        }
        reader.readAsText(file)
      }
    },
    []
  )

  return {
    handleDownload,
    handleFileUpload,
    clearEnabled: hasData,
    toast,
  }
}

import { FileText, ImageIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FileInfo {
  name: string
  size: number
  type?: string
}

interface FileInfoCardProps {
  fileInfo: FileInfo
  onRemove?: () => void
  className?: string
}

export function FileInfoCard({
  fileInfo,
  onRemove,
  className = "",
}: FileInfoCardProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const getFileIcon = () => {
    if (fileInfo.type?.startsWith("image/")) {
      return <ImageIcon className="text-muted-foreground h-6 w-6" />
    }
    return <FileText className="text-muted-foreground h-6 w-6" />
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>File Info</CardTitle>
        <CardDescription>{fileInfo.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {getFileIcon()}
          <div className="max-w-full overflow-hidden">
            <p className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
              {fileInfo.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {formatFileSize(fileInfo.size)}
              {fileInfo.type && ` • ${fileInfo.type}`}
            </p>
          </div>
          {onRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

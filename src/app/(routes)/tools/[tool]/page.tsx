"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { getToolById, getToolComponent } from "@/utils"

export default function ToolPage() {
  const params = useParams()
  const toolId = params.tool as string
  const [isValidTool, setIsValidTool] = useState(false)

  useEffect(() => {
    const tool = getToolById(toolId)
    if (!tool) {
      notFound()
    }
    setIsValidTool(true)
  }, [toolId])

  if (!isValidTool) {
    return null
  }

  const ToolComponent = getToolComponent(toolId)

  if (!ToolComponent) {
    notFound()
  }

  return <ToolComponent />
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getToolById, getToolComponent, Tool } from "@/utils"

interface ToolPageProps {
  params: Promise<{
    tool: string
  }>
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { tool } = await params
  const toolId = getToolById(tool) as Tool

  if (!toolId) {
    return {
      title: "Tool Not Found",
      description: "The requested tool does not exist.",
    }
  }

  return {
    title: toolId.title,
    description: toolId.description,
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool } = await params

  const toolId = getToolById(tool) as Tool

  if (!toolId) {
    notFound()
  }

  const ToolComponent = getToolComponent(tool)

  if (!ToolComponent) {
    notFound()
  }

  return <ToolComponent />
}

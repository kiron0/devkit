import { notFound } from "next/navigation"
import { TOOLS } from "@/utils"

interface ToolPageProps {
  params: Promise<{ tool: string }>
}

export const generateMetadata = async ({ params }: ToolPageProps) => {
  const { tool: toolId } = await params

  const tool = TOOLS.find((t) => t.id === toolId)

  return {
    title: tool?.title,
    description: tool?.description,
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params

  const tool = TOOLS.find((t) => t.id === toolId)

  if (!tool) {
    notFound()
  }

  const ToolComponent = tool.component

  return <ToolComponent />
}

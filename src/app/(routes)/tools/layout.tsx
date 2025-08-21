import { ToolsLayout } from "@/components/tools-layout"

export default function ToolsLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToolsLayout>{children}</ToolsLayout>
}

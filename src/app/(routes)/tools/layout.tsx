import { ToolsLayout } from "@/components/shared/tools-layout"

export default function ToolsLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <ToolsLayout>{children}</ToolsLayout>
}

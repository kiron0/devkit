"use client"

import Link from "next/link"
import { Config } from "@/config"
import { getToolsGroupedByCategory } from "@/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface ToolsSidebarProps {
  selectedTool?: string | null
  onToolSelect: (toolId: string | null) => void
}

export function ToolsSidebar({
  selectedTool,
  onToolSelect,
}: ToolsSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleToolClick = (toolId: string | null) => {
    onToolSelect(toolId)
    // Close mobile sidebar when tool is selected
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  // Get tools grouped by category from centralized utils
  const toolsByCategory = getToolsGroupedByCategory()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <Link
          href="/tools"
          onClick={() => handleToolClick(null)}
          className="flex items-center gap-2 px-2 py-1"
        >
          <div className="from-primary/90 to-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r">
            <span className="text-sm font-bold">DH</span>
          </div>
          <span className="font-semibold">{Config.title}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel>{category}</SidebarGroupLabel>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.id}>
                  <SidebarMenuButton
                    isActive={selectedTool === tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    tooltip={tool.title}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span>{tool.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

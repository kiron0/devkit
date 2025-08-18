"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Config } from "@/config"
import { getToolsGroupedByCategory } from "@/utils"
import { useTheme } from "next-themes"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
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
  const pathname = usePathname()

  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  const isToolsPage = pathname === "/tools"

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
          href="/"
          onClick={() => handleToolClick(null)}
          className="flex flex-col items-center gap-2 px-2 py-6 text-center"
        >
          <div className="from-primary/90 to-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r">
            <span
              role="img"
              aria-label="dev"
              className="text-primary-foreground text-sm font-bold"
            >
              💻
            </span>
          </div>
          <span className="text-base font-bold md:text-xl">{Config.title}</span>
          <span className="text-muted-foreground text-xs md:text-sm">
            {Config.shortDescription}
          </span>
        </Link>
      </SidebarHeader>
      <Separator className="mb-2" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="tools">
              <SidebarMenuButton
                isActive={isToolsPage}
                onClick={() => handleToolClick("")}
                tooltip="Tools"
              >
                <span className="text-lg">🔧</span>
                <span>All Tools</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
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

      <SidebarFooter>
        <div className="p-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleTheme}
                tooltip="Toggle Theme"
                className="border"
              >
                <span className="text-lg">
                  {resolvedTheme === "dark" ? "🌞" : "🌜"}
                </span>
                <span>
                  {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

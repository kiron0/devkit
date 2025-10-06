"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Config } from "@/config"
import {
  getCategoryIcon,
  getToolsGroupedByCategory,
  isToolCompleted,
} from "@/utils"
import { HouseHeartIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Badge } from "@/components/ui/badge"
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
import { Logo } from "@/components/common"

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
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const toolsByCategory = getToolsGroupedByCategory()
  const isDevelopment = Config.env.nodeEnv === "development"

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <Link
          href="/"
          onClick={() => handleToolClick(null)}
          className="group flex flex-col items-center gap-3 px-4 py-6 text-center transition-all"
        >
          <Logo className="w-14 object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 md:w-16" />
          <div className="space-y-1">
            <span className="text-sidebar-primary text-xl font-bold transition-colors md:text-2xl">
              {Config.title}
            </span>
            <p className="text-sidebar-foreground/70 text-xs leading-relaxed md:text-sm">
              {Config.shortDescription}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 px-4 py-2 text-xs font-semibold tracking-wider uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="home">
              <Link href="/" onClick={() => handleToolClick(null)}>
                <SidebarMenuButton
                  tooltip="Home"
                  className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                >
                  <HouseHeartIcon className="h-4 w-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem key="tools">
              <SidebarMenuButton
                isActive={isToolsPage}
                onClick={() => handleToolClick("")}
                tooltip="All Tools"
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground transition-all"
              >
                <span className="text-base">🔧</span>
                <span className="font-medium">All Tools</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="bg-sidebar-border my-2" />

        {Object.entries(toolsByCategory).map(([category, tools]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel className="text-sidebar-foreground/60 flex items-center justify-between px-4 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <span className="text-base">{getCategoryIcon(category)}</span>
                {category}
              </span>
              <Badge
                variant="secondary"
                className="bg-sidebar-accent text-sidebar-accent-foreground h-5 px-2 text-xs"
              >
                {tools.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.id}>
                  <SidebarMenuButton
                    isActive={selectedTool === tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    tooltip={tool.title}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground group transition-all"
                  >
                    <span className="text-base transition-transform group-hover:scale-110">
                      {tool.icon}
                    </span>
                    <span className="flex-1 text-sm">{tool.title}</span>
                    {isDevelopment && isToolCompleted(tool) && (
                      <Badge
                        variant="default"
                        className="h-5 bg-green-600 px-1.5 text-[10px] hover:bg-green-700"
                      >
                        Done
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border from-sidebar to-sidebar/95 border-t bg-gradient-to-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={
                resolvedTheme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group border-sidebar-border/50 border transition-all"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
              ) : (
                <Moon className="h-4 w-4 transition-transform group-hover:rotate-12" />
              )}
              <span className="font-medium">
                {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

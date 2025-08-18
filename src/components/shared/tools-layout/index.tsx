"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getToolById } from "@/utils"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { ToolsSidebar } from "../tools-sidebar"

export function ToolsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  // Get tool from URL path
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/")
      const toolFromPath = pathSegments[pathSegments.length - 1]

      if (
        toolFromPath &&
        toolFromPath !== "tools" &&
        getToolById(toolFromPath)
      ) {
        setSelectedTool(toolFromPath)
      } else if (toolFromPath === "tools") {
        setSelectedTool(null)
      }
    }
  }, [pathname])

  const handleToolSelect = (toolId: string | null) => {
    setSelectedTool(toolId)
    router.push(`/tools/${toolId}`)
  }

  const currentTool = selectedTool ? getToolById(selectedTool) : null

  return (
    <SidebarProvider>
      <ToolsSidebar
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
      />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="hover:bg-accent -ml-1 rounded-md p-1 transition-colors" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList className="flex items-center space-x-1">
                {currentTool && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center gap-2">
                        <span className="size-4">{currentTool.icon}</span>
                        <span className="font-medium">{currentTool.title}</span>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0 md:p-4">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

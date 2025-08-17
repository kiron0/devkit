"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getToolById } from "@/utils"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
  const [selectedTool, setSelectedTool] = useState<string | undefined>()

  // Get tool from URL path
  useEffect(() => {
    const pathSegments = pathname.split("/")
    const toolFromPath = pathSegments[pathSegments.length - 1]

    if (toolFromPath && toolFromPath !== "tools" && getToolById(toolFromPath)) {
      setSelectedTool(toolFromPath)
    }
  }, [pathname])

  const handleToolSelect = (toolId: string) => {
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
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {currentTool ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/tools">
                        Developer Tools
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentTool.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Developer Tools</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl p-6 md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

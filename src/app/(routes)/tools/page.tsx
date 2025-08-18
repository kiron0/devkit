import Link from "next/link"
import { Config } from "@/config"
import { TOOL_CATEGORIES, TOOLS } from "@/utils"
import { ArrowRight, Grid3X3, Search, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ToolsDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-10 p-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">{Config.title}</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Professional-grade development tools designed to streamline your
          workflow and boost productivity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl">🛠️</div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Tools
              </p>
              <p className="text-2xl font-bold text-blue-600">{TOOLS.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:border-purple-800 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl">📊</div>
              <p className="text-muted-foreground text-sm font-medium">
                Categories
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {TOOL_CATEGORIES.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-950/50 dark:to-green-900/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl">⭐</div>
              <p className="text-muted-foreground text-sm font-medium">
                Featured
              </p>
              <p className="text-2xl font-bold text-green-600">
                {TOOLS.filter((t) => t.featured).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:border-orange-800 dark:from-orange-950/50 dark:to-orange-900/50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl">🚀</div>
              <p className="text-muted-foreground text-sm font-medium">
                Popular
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {TOOLS.filter((t) => t.featured).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools by Category */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Tools by Category</h2>
          <p className="text-muted-foreground">
            Organized by functionality for easy discovery
          </p>
        </div>

        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = TOOLS.filter(
            (tool) => tool.category === category
          )
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  {category}
                </h3>
                <Badge variant="secondary">{categoryTools.length} tools</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <Link key={tool.id} href={tool.path}>
                    <Card className="group from-background to-muted/30 border-0 bg-gradient-to-br transition-all duration-200 hover:scale-105 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
                            {tool.icon}
                          </div>
                          <div className="flex gap-1">
                            {tool.featured && (
                              <Badge variant="default" className="text-xs">
                                <Sparkles className="h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                            {tool.featured && (
                              <Badge
                                variant="secondary"
                                className="bg-orange-600 text-xs"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-primary text-lg transition-colors">
                          {tool.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4 text-sm leading-relaxed">
                          {tool.description}
                        </CardDescription>
                        <div className="text-primary flex items-center text-sm font-medium transition-transform duration-200 group-hover:translate-x-1">
                          Try Tool
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 border-t pt-8 text-center">
        <h3 className="text-xl font-semibold">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/tools/regex-tester">
            <Button variant="default">
              <Search className="h-4 w-4" />
              Test Regex
            </Button>
          </Link>
          <Link href="/tools/json-formatter">
            <Button variant="outline">
              <Grid3X3 className="h-4 w-4" />
              Format JSON
            </Button>
          </Link>
          <Link href="/tools/password-generator">
            <Button variant="outline">
              <Sparkles className="h-4 w-4" />
              Generate Password
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to get category icons
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Text & Data": "📝",
    Development: "💻",
    Utilities: "🔧",
    Converters: "🔄",
    Security: "🔒",
    Design: "🎨",
  }
  return icons[category] || "🛠️"
}

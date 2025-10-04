"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Link from "next/link"
import { Config } from "@/config"
import { TOOL_CATEGORIES, TOOLS } from "@/utils"
import { ArrowRight, Code, Search, Sparkles, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/common"

export default function ToolsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    let filtered = TOOLS

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query) ||
          tool.id.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // Group filtered tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof TOOLS> = {}

    filteredTools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = []
      }
      grouped[tool.category].push(tool)
    })

    // Sort tools alphabetically by title within each category
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.title.localeCompare(b.title))
    })

    return grouped
  }, [filteredTools])

  // Get unique categories from filtered tools
  const availableCategories = useMemo(() => {
    return Array.from(new Set(filteredTools.map((tool) => tool.category)))
  }, [filteredTools])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-6">
      <div className="space-y-4 text-center">
        <div className="group flex flex-col items-center justify-center gap-2">
          <Logo className="w-20 object-cover transition-transform duration-300 group-hover:scale-110 md:w-24" />
          <h1 className="text-primary text-3xl font-bold">{Config.title}</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Professional-grade development tools designed to streamline your
          workflow and boost productivity
        </p>
      </div>

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

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tools by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {TOOL_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryIcon(category)} {category}
            </Button>
          ))}
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="text-muted-foreground text-center text-sm">
            Found {filteredTools.length} tool
            {filteredTools.length !== 1 ? "s" : ""}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Tools Display */}
      {filteredTools.length > 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">
              {searchQuery ? "Search Results" : "Tools by Category"}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Found ${filteredTools.length} tool${filteredTools.length !== 1 ? "s" : ""}`
                : "Organized by functionality for easy discovery"}
            </p>
          </div>

          {/* Show tools grouped by category or as a flat list for search results */}
          {searchQuery ? (
            // Flat list for search results
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={tool.path as Route}>
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
                          <Badge variant="secondary" className="text-xs">
                            {tool.category}
                          </Badge>
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
          ) : (
            // Grouped by category for normal view
            availableCategories.map((category) => {
              const categoryTools = toolsByCategory[category]
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-semibold">
                      <span className="text-2xl">
                        {getCategoryIcon(category)}
                      </span>
                      {category}
                    </h3>
                    <Badge variant="secondary">
                      {categoryTools.length} tools
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryTools.map((tool) => (
                      <Link key={tool.id} href={tool.path as Route}>
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
                                    className="bg-orange-600 text-xs text-white"
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
            })
          )}
        </div>
      ) : (
        // No results found
        <div className="space-y-4 py-12 text-center">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold">No tools found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter
          </p>
          <Button onClick={clearSearch} variant="outline">
            Clear Search
          </Button>
        </div>
      )}

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
              <Code className="h-4 w-4" />
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
    "Text & Content": "📝",
    "Encoding & Conversion": "🔄",
    "Generators & Utilities": "🔧",
    "Development Tools": "💻",
    Formatting: "✨",
    Design: "🎨",
  }
  return icons[category] || "🛠️"
}

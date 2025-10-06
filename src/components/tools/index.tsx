"use client"

import * as React from "react"
import { Route } from "next"
import Link from "next/link"
import { Config } from "@/config"
import {
  getCategoryIcon,
  isToolCompleted,
  TOOL_CATEGORIES,
  TOOLS,
} from "@/utils"
import { ArrowRight, Code, Search, SearchIcon, Sparkles, X } from "lucide-react"

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

export function Tools() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  )
  const isDevelopment = Config.env.nodeEnv === "development"

  const filteredTools = React.useMemo(() => {
    let filtered = TOOLS

    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }

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

  const toolsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof TOOLS> = {}

    filteredTools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = []
      }
      grouped[tool.category].push(tool)
    })

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.title.localeCompare(b.title))
    })

    return grouped
  }, [filteredTools])

  const availableCategories = React.useMemo(() => {
    return Array.from(new Set(filteredTools.map((tool) => tool.category)))
  }, [filteredTools])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="space-y-4 text-center">
        <div className="group flex flex-col items-center justify-center gap-2">
          <Logo className="w-20 object-cover transition-transform duration-300 group-hover:scale-110 md:w-24" />
          <h1 className="text-primary text-3xl font-bold">{Config.title}</h1>
        </div>
        <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
          Professional-grade development tools designed to streamline your
          workflow and boost productivity
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="group border-accent/10 bg-card/50 hover:border-accent/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl transition-transform group-hover:scale-110">
                🛠️
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Tools
              </p>
              <p className="text-primary text-2xl font-bold">
                {Math.floor(TOOLS.length / 5) * 5}+
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-accent/10 bg-card/50 hover:border-accent/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl transition-transform group-hover:scale-110">
                📊
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Categories
              </p>
              <p className="text-accent-foreground text-2xl font-bold">
                {TOOL_CATEGORIES.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-secondary/10 bg-card/50 hover:border-secondary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl transition-transform group-hover:scale-110">
                ⭐
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Featured
              </p>
              <p className="text-primary text-2xl font-bold">
                {TOOLS.filter((t) => t.featured).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group border-muted bg-card/50 hover:border-muted-foreground/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-3xl transition-transform group-hover:scale-110">
                🚀
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Popular
              </p>
              <p className="text-foreground text-2xl font-bold">
                {TOOLS.filter((t) => t.featured).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tools by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border/50 focus:border-primary/50 focus:ring-primary/20 h-12 pr-12 pl-12 text-base transition-all"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="hover:bg-destructive/10 hover:text-destructive absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 rounded-full p-0 transition-all"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="transition-all hover:scale-105"
          >
            All Categories
          </Button>
          {TOOL_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="border-border/50 hover:border-primary/30 gap-1.5 transition-all hover:scale-105"
            >
              <span className="text-base">{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </Button>
          ))}
        </div>

        {(searchQuery || selectedCategory) && (
          <div className="text-muted-foreground flex items-center justify-center gap-2 text-center text-sm">
            <Badge variant="secondary" className="px-3 py-1">
              {filteredTools.length} tool
              {filteredTools.length !== 1 ? "s" : ""} found
            </Badge>
            {selectedCategory && (
              <span className="text-xs">
                in <span className="font-semibold">{selectedCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span className="text-xs">
                matching{" "}
                <span className="font-semibold">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {filteredTools.length > 0 ? (
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
              {searchQuery ? "Search Results" : "Tools by Category"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {searchQuery
                ? `Found ${filteredTools.length} tool${filteredTools.length !== 1 ? "s" : ""}`
                : "Organized by functionality for easy discovery"}
            </p>
          </div>

          {searchQuery ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={tool.path as Route}>
                  <Card className="group border-border/40 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="from-primary/0 via-accent/0 to-secondary/0 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                          {tool.icon}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tool.featured && (
                            <Badge variant="default" className="gap-1 text-xs">
                              <Sparkles className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                          {isDevelopment && isToolCompleted(tool) && (
                            <Badge
                              variant="default"
                              className="bg-green-600 text-xs hover:bg-green-700"
                            >
                              Done
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary mt-3 text-lg font-bold transition-colors">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {tool.description}
                      </CardDescription>
                      <div className="text-primary flex items-center gap-2 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-2">
                        Try Tool
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            availableCategories.map((category: string) => {
              const categoryTools = toolsByCategory[category]
              return (
                <div key={category} className="space-y-6">
                  <div className="border-border/40 flex items-center justify-between border-b pb-3">
                    <h3 className="flex items-center gap-3 text-xl font-bold md:text-2xl">
                      <span className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg text-2xl">
                        {getCategoryIcon(category)}
                      </span>
                      {category}
                    </h3>
                    <Badge variant="secondary" className="px-3 py-1">
                      {categoryTools.length} tools
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryTools.map((tool) => (
                      <Link key={tool.id} href={tool.path as Route}>
                        <Card className="group border-border/40 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                          <div className="from-primary/0 via-accent/0 to-secondary/0 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                                {tool.icon}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {tool.featured && (
                                  <Badge
                                    variant="default"
                                    className="gap-1 text-xs"
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    Featured
                                  </Badge>
                                )}
                                {isDevelopment && isToolCompleted(tool) && (
                                  <Badge
                                    variant="default"
                                    className="bg-green-600 text-xs hover:bg-green-700"
                                  >
                                    Done
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardTitle className="group-hover:text-primary mt-3 text-lg font-bold transition-colors">
                              {tool.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-muted-foreground mb-4 text-sm leading-relaxed">
                              {tool.description}
                            </CardDescription>
                            <div className="text-primary flex items-center gap-2 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-2">
                              Try Tool
                              <ArrowRight className="h-4 w-4" />
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
        <Card className="border-border/40 bg-card/50 mx-auto max-w-md backdrop-blur-sm">
          <CardContent className="space-y-4 py-12 text-center">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-bold">No tools found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search terms or category filter
            </p>
            <Button
              onClick={clearSearch}
              variant="outline"
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="space-y-6 py-8 text-center">
          <div>
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              Quick Actions
            </h3>
            <p className="text-muted-foreground text-sm">
              Popular tools for your everyday workflow
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tools/regex-tester">
              <Button
                variant="default"
                className="gap-2 transition-all hover:scale-105"
              >
                <Search className="h-4 w-4" />
                Test Regex
              </Button>
            </Link>
            <Link href="/tools/json-formatter">
              <Button
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2 transition-all hover:scale-105"
              >
                <Code className="h-4 w-4" />
                Format JSON
              </Button>
            </Link>
            <Link href="/tools/password-generator">
              <Button
                variant="outline"
                className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 gap-2 transition-all hover:scale-105"
              >
                <Sparkles className="h-4 w-4" />
                Generate Password
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

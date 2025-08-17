"use client"

import { useState } from "react"
import Link from "next/link"
import { Config } from "@/config"
import { TOOL_CATEGORIES, TOOLS } from "@/utils"
import { ArrowRight, Github, Home, Search } from "lucide-react"

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
import { ThemeSwitcher } from "@/components/theme-switcher"

export function ToolsDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTools = TOOLS.filter((tool) => tool.featured)

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-sm font-bold text-white">DH</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {Config.title}
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="hover:text-foreground/80 transition-colors"
            >
              <Home className="mr-1 inline h-4 w-4" />
              Home
            </Link>
            <Link href="/tools" className="text-foreground">
              Tools
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <a
              href={Config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="bg-muted mb-4 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
            <span className="mr-2">🛠️</span>
            Developer Tools
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
            Professional Development Tools
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Complete suite of utilities designed to streamline your development
            workflow
          </p>
        </div>

        {/* Featured Tools */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">⭐ Featured Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <Card
                key={tool.id}
                className="group from-background to-muted/50 relative overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{tool.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg transition-colors group-hover:text-blue-600">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-sm">
                    {tool.description}
                  </CardDescription>
                  <Link href={tool.path}>
                    <Button className="w-full transition-colors group-hover:bg-blue-600">
                      Open Tool
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </Button>
              {TOOL_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* All Tools Grid */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">
            All Tools ({filteredTools.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="group relative overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-2xl">{tool.icon}</div>
                    {tool.featured && (
                      <Badge variant="secondary" className="text-xs">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base transition-colors group-hover:text-blue-600">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3 line-clamp-2 text-xs">
                    {tool.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                    <Link href={tool.path}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 text-xs"
                      >
                        Open <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold">No tools found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="rounded-lg border bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8">
            <h2 className="mb-4 text-2xl font-bold">Need a specific tool?</h2>
            <p className="text-muted-foreground mx-auto mb-6 max-w-md">
              We&apos;re constantly adding new tools. Let us know what you need!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={Config.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Request Feature
                </Button>
              </a>
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import { CATEGORY_COLORS, CATEGORY_ICONS, HTTP_STATUSES } from "@/utils"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureGrid, ToolLayout } from "@/components/common"

export function HTTPStatusLookup() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredStatuses = useMemo(() => {
    return HTTP_STATUSES.filter((status) => {
      const matchesSearch =
        searchQuery === "" ||
        status.code.toString().includes(searchQuery) ||
        status.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.commonUseCases.some((useCase) =>
          useCase.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        status.troubleshooting.some((tip) =>
          tip.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        selectedCategory === "all" || status.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const getCategoryIcon = (category: string) => {
    const IconComponent =
      CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  const features = [
    {
      title: "Search by Code, Name, or Description",
      description:
        "Quickly find specific HTTP status codes using the search bar.",
      icon: "🔎",
    },
    {
      title: "Filter by Category",
      description:
        "Narrow down results to specific categories like 2xx Success or 4xx Client Error.",
      icon: "🔍",
    },
    {
      title: "Common Use Cases and Troubleshooting",
      description:
        "Get practical examples and troubleshooting tips for each status code.",
      icon: "💡",
    },
    {
      title: "Quick Reference",
      description: "Common HTTP status code ranges to quickly reference.",
      icon: "🔍",
    },
  ]

  return (
    <ToolLayout
      title="HTTP Status Code Lookup"
      description="Search and understand HTTP status codes with common use cases and troubleshooting tips"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search by code, name, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="informational">
                    1xx Informational
                  </SelectItem>
                  <SelectItem value="success">2xx Success</SelectItem>
                  <SelectItem value="redirection">3xx Redirection</SelectItem>
                  <SelectItem value="client-error">4xx Client Error</SelectItem>
                  <SelectItem value="server-error">5xx Server Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredStatuses.length === 0 ? (
            <Card>
              <CardContent className="text-muted-foreground pt-6 text-center">
                No status codes found matching your search criteria.
              </CardContent>
            </Card>
          ) : (
            filteredStatuses.map((status) => (
              <Card key={status.code}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`px-3 py-1 text-lg ${CATEGORY_COLORS[status.category]}`}
                        >
                          {status.code}
                        </Badge>
                        <h3 className="text-xl font-semibold">{status.name}</h3>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {getCategoryIcon(status.category)}
                          {status.category.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {status.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {status.rfc}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="use-cases" className="w-full">
                    <ScrollArea>
                      <TabsList>
                        <TabsTrigger value="use-cases">
                          Common Use Cases
                        </TabsTrigger>
                        <TabsTrigger value="troubleshooting">
                          Troubleshooting
                        </TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                      </TabsList>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <TabsContent value="use-cases" className="space-y-2">
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        {status.commonUseCases.map((useCase, index) => (
                          <li key={index} className="text-muted-foreground">
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="troubleshooting" className="space-y-2">
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        {status.troubleshooting.map((tip, index) => (
                          <li key={index} className="text-muted-foreground">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span>
                          <Badge variant="outline" className="ml-2">
                            {status.category.replace("-", " ")}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">RFC:</span>
                          <span className="text-muted-foreground ml-2">
                            {status.rfc}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Description:
                        </span>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {status.description}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
            <CardDescription>Common HTTP status code ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">1xx</div>
                <div className="text-muted-foreground text-sm">
                  Informational
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-green-600">2xx</div>
                <div className="text-muted-foreground text-sm">Success</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">3xx</div>
                <div className="text-muted-foreground text-sm">Redirection</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-red-600">4xx</div>
                <div className="text-muted-foreground text-sm">
                  Client Error
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">5xx</div>
                <div className="text-muted-foreground text-sm">
                  Server Error
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

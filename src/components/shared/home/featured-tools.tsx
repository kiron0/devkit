import { Route } from "next"
import Link from "next/link"
import { getFeaturedTools } from "@/utils"
import { ArrowRight, Code } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function FeaturedTools() {
  const featuredTools = getFeaturedTools().slice(0, 6)

  return (
    <section id="tools" className="py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary bg-muted text-primary mb-4"
          >
            <Code className="h-3 w-3" />
            Featured Tools
          </Badge>
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            🛠️ Essential Developer Tools
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed sm:text-2xl">
            Professional-grade tools designed for modern development
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Card
              key={tool.id}
              className="group from-background to-muted/30 relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link href={tool.path as Route} className="block p-6">
                <CardHeader className="pb-3">
                  <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
                    {tool.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary text-lg transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                  <div className="text-primary mt-4 flex items-center text-sm font-medium transition-transform duration-200 group-hover:translate-x-1">
                    Try Tool
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tools">
            <Button size="lg" variant="outline" className="group">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

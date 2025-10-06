import { Route } from "next"
import Link from "next/link"
import { getFeaturedTools } from "@/utils"
import { ArrowRight, Code, Sparkles } from "lucide-react"

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
    <section id="featured-tools" className="relative py-20 sm:py-28">
      <div className="from-background via-muted/10 to-background absolute inset-0 -z-10 bg-gradient-to-b" />

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 mb-4 gap-1.5 border-2 px-4 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Featured Tools
          </Badge>
          <h2 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            <span className="text-primary">Essential Developer Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl lg:text-2xl">
            Professional-grade tools designed for modern development
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link key={tool.id} href={tool.path as Route}>
              <Card className="group border-border/40 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {/* Gradient overlay on hover */}
                <div className="from-primary/0 via-accent/0 to-secondary/0 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                <CardHeader className="pb-3">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-3 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {tool.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary text-lg font-bold transition-colors">
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

        <div className="mt-12 text-center">
          <Link href="/tools">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 group h-12 gap-2 px-8 transition-all duration-300 hover:scale-105 sm:h-14 sm:px-10 sm:text-base"
            >
              <Code className="h-5 w-5" />
              View All Tools
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

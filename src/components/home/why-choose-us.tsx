import { Config } from "@/config"
import { CheckCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="border-border/40 relative border-t py-20 sm:py-28"
    >
      <div className="from-muted/20 via-background to-background absolute inset-0 -z-10 bg-gradient-to-b" />

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 mb-4 gap-1.5 border-2 px-4 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Why Choose Us
          </Badge>
          <h2 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Powerful Features for{" "}
            <span className="text-primary">Developers</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl lg:text-2xl">
            Everything you need for professional development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {Config.features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border/40 bg-card/50 hover:border-primary/30 hover:shadow-primary/5 relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Gradient overlay on hover */}
              <div className="from-primary/0 via-accent/0 to-secondary/0 absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

              <CardHeader className="relative pb-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <CardTitle className="group-hover:text-primary text-xl font-bold transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

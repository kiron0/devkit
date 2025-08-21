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

export function Features() {
  return (
    <section id="features" className="bg-muted/30 border-t py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary bg-muted text-primary mb-4"
          >
            <CheckCircle className="h-3 w-3" />
            Why Choose Us
          </Badge>
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Powerful Features for
            <span className="from-primary/90 to-primary/50 bg-gradient-to-r bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed sm:text-2xl">
            Everything you need for professional development workflow
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Config.features.map((feature, index) => (
            <Card
              key={index}
              className="from-background to-muted/30 group relative overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="relative z-10 pb-3">
                <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <CardTitle className="group-hover:text-primary text-xl transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed">
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

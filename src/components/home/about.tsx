import { Config } from "@/config"
import { Shield } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="from-background via-muted/10 to-background absolute inset-0 -z-10 bg-gradient-to-b" />

      <div className="container mx-auto px-4">
        <div className="mx-auto w-full text-center">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 mb-4 gap-1.5 border-2 px-4 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Shield className="h-3.5 w-3.5" />
            About {Config.title}
          </Badge>
          <h2 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Built for <span className="text-primary">Developers</span>, by
            Developers
          </h2>
          <p className="text-muted-foreground mb-12 text-lg leading-relaxed sm:text-xl lg:text-2xl">
            A comprehensive suite of professional development tools designed to
            streamline your workflow and boost productivity.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group border-border/40 bg-card/50 hover:border-primary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  🚀
                </div>
                <h3 className="mb-2 text-xl font-bold">Fast & Efficient</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Lightning-fast tools with zero server latency
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/40 bg-card/50 hover:border-accent/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 group-hover:bg-accent/20 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  🔒
                </div>
                <h3 className="mb-2 text-xl font-bold">Privacy First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your data stays on your device, always
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border/40 bg-card/50 hover:border-secondary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="bg-secondary/10 group-hover:bg-secondary/20 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  💡
                </div>
                <h3 className="mb-2 text-xl font-bold">Smart Features</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  AI-powered suggestions and real-time validation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

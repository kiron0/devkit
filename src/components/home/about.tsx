import { Config } from "@/config"
import { Shield } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function About() {
  return (
    <section id="about" className="py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary bg-muted text-primary mb-4"
          >
            <Shield className="h-3 w-3" />
            About {Config.title}
          </Badge>
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            Built for Developers, by Developers
          </h2>
          <p className="text-muted-foreground mb-8 text-xl leading-relaxed sm:text-2xl">
            A comprehensive suite of professional development tools designed to
            streamline your workflow and boost productivity.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">🚀</div>
              <h3 className="mb-2 text-xl font-semibold">Fast & Efficient</h3>
              <p className="text-muted-foreground">
                Lightning-fast tools with zero server latency
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data stays on your device, always
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">💡</div>
              <h3 className="mb-2 text-xl font-semibold">Smart Features</h3>
              <p className="text-muted-foreground">
                AI-powered suggestions and real-time validation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

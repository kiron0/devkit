import Link from "next/link"
import { Config } from "@/config"
import { TOOLS } from "@/utils"
import { ArrowRight, Rocket, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="from-primary/20 via-secondary/20 to-primary/20 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
        <div className="from-primary/10 to-secondary/10 absolute top-1/4 right-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-r blur-2xl delay-1000" />
        <div className="from-primary/10 to-secondary/10 absolute bottom-1/4 left-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-r blur-2xl delay-2000" />
      </div>
      <div className="container mx-auto text-center">
        <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
          <Badge
            variant="outline"
            className="bg-muted text-primary border-primary mx-auto w-fit border transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            Professional Developer Tools Suite
          </Badge>
          <h1 className="from-primary/90 to-primary/50 bg-gradient-to-r bg-clip-text text-5xl leading-tight font-bold text-transparent sm:text-6xl lg:text-7xl xl:text-8xl">
            {Config.title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base leading-relaxed sm:text-lg lg:text-xl">
            {Config.shortDescription}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/tools"
              className={buttonVariants({
                size: "lg",
                className:
                  "from-primary/90 to-primary/30 transform gap-2 bg-gradient-to-r shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:w-auto",
              })}
            >
              <Rocket className="h-5 w-5" />
              Explore Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4">
            <div className="group text-center">
              <div className="text-primary text-3xl font-bold transition-transform duration-200 group-hover:scale-110 sm:text-4xl">
                {TOOLS.length - 1}+
              </div>
              <div className="text-muted-foreground text-sm">
                Developer Tools
              </div>
            </div>
            <div className="group text-center">
              <div className="text-3xl font-bold text-green-600 transition-transform duration-200 group-hover:scale-110 sm:text-4xl">
                100%
              </div>
              <div className="text-muted-foreground text-sm">
                Privacy Focused
              </div>
            </div>
            <div className="group text-center">
              <div className="text-3xl font-bold text-purple-600 transition-transform duration-200 group-hover:scale-110 sm:text-4xl">
                0ms
              </div>
              <div className="text-muted-foreground text-sm">
                Server Latency
              </div>
            </div>
            <div className="group text-center">
              <div className="text-3xl font-bold text-orange-600 transition-transform duration-200 group-hover:scale-110 sm:text-4xl">
                24/7
              </div>
              <div className="text-muted-foreground text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

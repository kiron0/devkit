import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { RegexTesterCompact } from "@/components/tools/regex-tester/regex-tester-compact"

export function Demo() {
  return (
    <section className="bg-muted/30 border-t py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 mb-4 gap-1.5 border-2 px-4 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Try It Now
          </Badge>
          <h2 className="mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            <span className="text-primary">Experience the Power</span>
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed sm:text-2xl">
            Test our regex tool with real-time highlighting and validation
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <RegexTesterCompact />
        </div>
      </div>
    </section>
  )
}

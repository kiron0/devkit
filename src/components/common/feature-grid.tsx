import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface Feature {
  icon: string
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  className?: string
}

export function FeatureGrid({ features, className = "" }: FeatureGridProps) {
  return (
    <div className={cn("mt-12", className)}>
      <h2 className="mb-6 text-xl font-bold">Features</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="mb-2 text-2xl">{feature.icon}</div>
              <h3 className="mb-1 font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

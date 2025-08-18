"use client"

import Link from "next/link"
import { Config } from "@/config"
import { TOOLS } from "@/utils"
import {
  ArrowRight,
  CheckCircle,
  Code,
  Github,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RegexTesterCompact } from "@/components/regex"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function Home() {
  const featuredTools = TOOLS.filter((tool) => tool.featured).slice(0, 6)

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Fixed Header */}
      <header className="bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="from-primary/90 to-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-transform duration-200 group-hover:scale-105">
              <span className="text-sm font-bold text-white">DH</span>
            </div>
            <span className="group-hover:text-primary hidden font-bold transition-colors sm:inline-block">
              {Config.title}
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-primary cursor-pointer transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("tools")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-primary cursor-pointer transition-colors duration-200"
            >
              Tools
            </button>
            <Link
              href="/tools"
              className="hover:text-primary transition-colors duration-200"
            >
              All Tools
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-primary cursor-pointer transition-colors duration-200"
            >
              About
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <Link
              href={Config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="from-primary/20 via-secondary/20 to-primary/20 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r blur-3xl" />
          <div className="from-primary/10 to-secondary/10 absolute top-1/4 right-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-r blur-2xl delay-1000" />
          <div className="from-primary/10 to-secondary/10 absolute bottom-1/4 left-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-r blur-2xl delay-2000" />
        </div>

        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
            {/* Badge */}
            <Badge
              variant="outline"
              className="bg-primary text-primary-foreground border-primary mx-auto w-fit border transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Professional Developer Tools Suite
            </Badge>

            {/* Main Heading */}
            <h1 className="from-primary/90 to-primary/50 bg-gradient-to-r bg-clip-text text-5xl leading-tight font-bold text-transparent sm:text-6xl lg:text-7xl xl:text-8xl">
              {Config.title}
            </h1>

            {/* Subheading */}
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed sm:text-2xl lg:text-3xl">
              {Config.shortDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "from-primary/90 to-primary/30 w-full transform gap-2 bg-gradient-to-r shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:w-auto",
                })}
              >
                <Rocket className="h-5 w-5" />
                Explore Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4">
              <div className="group text-center">
                <div className="text-primary text-3xl font-bold transition-transform duration-200 group-hover:scale-110 sm:text-4xl">
                  {TOOLS.length}+
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

      {/* Features Section */}
      <section id="features" className="bg-muted/30 border-t py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-green-200 bg-green-50 text-green-700"
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

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Featured Tools Section */}
      <section id="tools" className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-purple-200 bg-purple-50 text-purple-700"
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <Card
                key={tool.id}
                className="group from-background to-muted/30 relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href={tool.path} className="block p-6">
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

      {/* Interactive Demo Section */}
      <section className="bg-muted/30 border-t py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <Badge
              variant="outline"
              className="mb-4 border-orange-200 bg-orange-50 text-orange-700"
            >
              <Zap className="h-3 w-3" />
              Try It Now
            </Badge>
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Experience the Power
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

      {/* About Section */}
      <section id="about" className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="outline"
              className="border-primary bg-primary text-primary-foreground mb-4 border"
            >
              <Shield className="h-3 w-3" />
              About DevTools Hub
            </Badge>
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Built for Developers, by Developers
            </h2>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed sm:text-2xl">
              A comprehensive suite of professional development tools designed
              to streamline your workflow and boost productivity.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
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

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="from-primary/90 to-primary/50 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
              <span className="text-primary-foreground text-sm font-bold">
                DH
              </span>
            </div>
            <span className="font-bold">{Config.title}</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Professional development tools for modern developers
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href={Config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 transition-colors duration-200"
          >
            <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
            Back to Top
          </button>
        </div>
      </footer>
    </div>
  )
}

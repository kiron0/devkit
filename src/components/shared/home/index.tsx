"use client"

import Link from "next/link"
import { Config } from "@/config"
import { TOOLS } from "@/utils"
import {
  ArrowRight,
  ExternalLink,
  Github,
  Shield,
  Star,
  Users,
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
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Fixed Header */}
      <header className="bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-sm font-bold text-white">DH</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              {Config.title}
            </span>
          </Link>

          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="#features"
              className="hover:text-foreground/80 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#tools"
              className="hover:text-foreground/80 transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/tools"
              className="hover:text-foreground/80 transition-colors"
            >
              All Tools
            </Link>
            <Link
              href="#about"
              className="hover:text-foreground/80 transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <a
              href={Config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-pink-500/10 to-orange-500/10 blur-2xl" />
        </div>

        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="mx-auto w-fit">
              <Star className="mr-1 h-3 w-3" />
              Professional Developer Tools
            </Badge>

            {/* Main Heading */}
            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-4xl leading-tight font-bold text-transparent sm:text-5xl lg:text-7xl">
              {Config.title}
            </h1>

            {/* Subheading */}
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl lg:text-2xl">
              {Config.shortDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/tools/regex-tester">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Start Testing Regex
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={Config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">
                  {TOOLS.length}+
                </div>
                <div className="text-muted-foreground text-sm">
                  Developer Tools
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">100%</div>
                <div className="text-muted-foreground text-sm">
                  Privacy Focused
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">0ms</div>
                <div className="text-muted-foreground text-sm">
                  Server Latency
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">24/7</div>
                <div className="text-muted-foreground text-sm">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 border-t py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Powerful Features
            </h2>
            <p className="text-muted-foreground mt-4 text-lg sm:text-xl">
              Everything you need for professional regex development
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Config.features.map((feature, index) => (
              <Card
                key={index}
                className="bg-background/50 relative overflow-hidden border-0 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 text-4xl">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section id="tools" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              🛠️ Featured Developer Tools
            </h2>
            <p className="text-muted-foreground mt-4 text-lg sm:text-xl">
              Professional utilities to streamline your development workflow
            </p>
          </div>

          {/* Featured Tools Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.filter((tool) => tool.featured).map((tool) => (
              <Card
                key={tool.id}
                className="group from-background to-muted/50 relative overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{tool.icon}</div>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg transition-colors group-hover:text-blue-600">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-sm">
                    {tool.description}
                  </p>
                  <Link href={tool.path}>
                    <Button className="w-full transition-colors group-hover:bg-blue-600">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Demo */}
          <div className="mt-16">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <h3 className="mb-4 text-2xl font-bold">
                🔍 Try Our Regex Tester
              </h3>
              <p className="text-muted-foreground">
                Test regular expressions in real-time with instant feedback
              </p>
            </div>
            <RegexTesterCompact />
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Explore all {TOOLS.length} professional tools in our comprehensive
              suite
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/tools">
                <Button size="lg" className="gap-2">
                  View All Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools/regex-tester">
                <Button variant="outline" size="lg" className="gap-2">
                  Advanced Regex Tester
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted/30 border-t py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Trusted by Developers
            </h2>
            <p className="text-muted-foreground mt-4 sm:text-lg">
              Built with modern web standards and best practices
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Optimized for performance with Web Workers and efficient
                algorithms
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Privacy First</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                All processing happens in your browser. Your data never leaves
                your device
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Open Source</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Transparent, community-driven development with regular updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <span className="text-sm font-bold text-white">DH</span>
                </div>
                <span className="font-bold">{Config.title}</span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                {Config.slogan}
              </p>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold">Tools</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/tools" className="hover:text-foreground">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/regex-tester"
                    className="hover:text-foreground"
                  >
                    Regex Tester
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/json-formatter"
                    className="hover:text-foreground"
                  >
                    JSON Formatter
                  </Link>
                </li>
                <li>
                  <Link href="/base64" className="hover:text-foreground">
                    Base64 Tool
                  </Link>
                </li>
                <li>
                  <Link
                    href="/password-generator"
                    className="hover:text-foreground"
                  >
                    Password Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/color-converter"
                    className="hover:text-foreground"
                  >
                    Color Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/timestamp-converter"
                    className="hover:text-foreground"
                  >
                    Timestamp Converter
                  </Link>
                </li>
                <li>
                  <Link href="/qr-generator" className="hover:text-foreground">
                    QR Generator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold">Resources</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href={Config.social.github}
                    className="hover:text-foreground"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href={Config.social.github}
                    className="hover:text-foreground"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href={Config.social.github}
                    className="hover:text-foreground"
                  >
                    Examples
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold">Connect</h3>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href={Config.social.github}
                    className="hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={Config.social.twitter}
                    className="hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={Config.social.linkedin}
                    className="hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>
              © 2024 {Config.title}. Built with ❤️ using Next.js and
              TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

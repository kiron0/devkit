import { Route } from "next"
import Link from "next/link"
import { Config } from "@/config"
import { ArrowUp, Github, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/common"

export function Footer() {
  return (
    <footer className="border-border/40 from-background to-muted/20 relative border-t bg-gradient-to-b py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <Logo className="w-10 object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 md:w-12" />
              <span className="text-primary text-xl font-bold md:text-2xl">
                {Config.title}
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              {Config.shortDescription}
            </p>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              Made with <Heart className="fill-primary text-primary h-4 w-4" />{" "}
              by{" "}
              <Link
                href={Config.author.url as Route}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary font-medium transition-colors"
              >
                {Config.author.name}
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-primary w-fit text-left transition-colors"
              >
                Features
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("tools")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-primary w-fit text-left transition-colors"
              >
                Featured Tools
              </button>
              <Link
                href="/tools"
                className="text-muted-foreground hover:text-primary w-fit transition-colors"
              >
                All Tools
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-primary w-fit text-left transition-colors"
              >
                About
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex flex-col gap-2">
              <Link
                href={Config.social.github as Route}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-center text-xs sm:text-left">
            © {new Date().getFullYear()} {Config.title}. All rights reserved.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:bg-primary/10 hover:text-primary group transition-all duration-300"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  )
}

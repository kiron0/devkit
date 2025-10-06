"use client"

import * as React from "react"
import { Route } from "next"
import Link from "next/link"
import { Config } from "@/config"
import { Github, PanelRightIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo, ThemeSwitcher } from "@/components/common"

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <header className="bg-background/80 border-border/40 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-18">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo className="w-9 object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 md:w-10" />
          <span className="text-primary text-xl font-bold transition-colors md:text-2xl">
            {Config.title}
          </span>
        </Link>

        <nav className="hidden items-center space-x-1 md:flex lg:space-x-2">
          <Button
            variant="ghost"
            onClick={() =>
              document
                .getElementById("why-choose-us")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:bg-primary/10 hover:text-primary text-sm font-medium transition-all duration-200"
          >
            Why <span className="text-primary">{Config.title}</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              document
                .getElementById("featured-tools")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:bg-primary/10 hover:text-primary text-sm font-medium transition-all duration-200"
          >
            Featured Tools
          </Button>
          <Link href="/tools">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary text-sm font-medium transition-all duration-200"
            >
              All Tools
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover:bg-primary/10 hover:text-primary text-sm font-medium transition-all duration-200"
          >
            About
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Link
            href={Config.social.github as Route}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className:
                "hover:bg-primary/10 hover:text-primary hidden transition-all duration-200 sm:flex",
            })}
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <PanelRightIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[calc(100%-2rem)] sm:w-full"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Logo className="w-8 object-cover" />
                  <span className="text-primary text-lg font-bold">
                    {Config.title}
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-3 px-4">
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("why-choose-us")}
                  className="hover:bg-primary/10 hover:text-primary justify-start text-base font-medium"
                >
                  Why <span className="text-primary">{Config.title}</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("featured-tools")}
                  className="hover:bg-primary/10 hover:text-primary justify-start text-base font-medium"
                >
                  Featured Tools
                </Button>
                <Link href="/tools" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="hover:bg-primary/10 hover:text-primary w-full justify-start text-base font-medium"
                  >
                    All Tools
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection("about")}
                  className="hover:bg-primary/10 hover:text-primary justify-start text-base font-medium"
                >
                  About
                </Button>
                <div className="border-border border-t pt-4">
                  <Link
                    href={Config.social.github as Route}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="hover:bg-primary/10 hover:text-primary w-full justify-start gap-2"
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

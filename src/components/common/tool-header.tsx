"use client"

import Link from "next/link"
import { Config } from "@/config"
import { ArrowLeft, Github, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface ToolHeaderProps {
  title: string
  description: string
  icon: string
  backLink?: string
}

export function ToolHeader({
  title,
  description,
  icon,
  backLink = "/tools",
}: ToolHeaderProps) {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href={backLink} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Tools</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{icon}</div>
            <div>
              <h1 className="font-bold">{title}</h1>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <ThemeSwitcher />
          <a
            href={Config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}

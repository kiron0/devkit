import { Route } from "next"
import Link from "next/link"
import { Config } from "@/config"
import { Github } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Logo, ThemeSwitcher } from "@/components/common"

export function Header() {
  return (
    <header className="bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className="w-9 object-cover transition-transform duration-300 group-hover:scale-110 md:w-10" />
          <span className="text-primary text-xl font-bold md:text-2xl">
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
            href={Config.social.github as Route}
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
  )
}

import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Config } from "@/config"
import { ArrowRight, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="group mb-4 flex items-center justify-center">
          <Image
            src={Config.logo}
            alt="Logo"
            width={1024}
            height={1024}
            className="w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 md:w-12"
          />
          <span className="text-primary text-xl font-bold md:text-2xl">
            {Config.title}
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Professional development tools for modern developers
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link
            href={Config.social.github as Route}
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
  )
}

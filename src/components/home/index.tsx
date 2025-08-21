"use client"

import { About } from "./about"
import { Demo } from "./demo"
import { FeaturedTools } from "./featured-tools"
import { Features } from "./features"
import { Footer } from "./footer"
import { Header } from "./header"
import { Hero } from "./hero"

export function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Features />
      <FeaturedTools />
      <Demo />
      <About />
      <Footer />
    </div>
  )
}

"use client"

import { About } from "./about"
import { Demo } from "./demo"
import { FeaturedTools } from "./featured-tools"
import { Footer } from "./footer"
import { Header } from "./header"
import { Hero } from "./hero"
import { WhyChooseUs } from "./why-choose-us"

export function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <Hero />
      <WhyChooseUs />
      <FeaturedTools />
      <Demo />
      <About />
      <Footer />
    </div>
  )
}

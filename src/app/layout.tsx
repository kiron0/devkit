import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Config } from "@/config"
import { Providers } from "@/providers"

import { cn } from "@/lib/utils"

import "@/styles/globals.css"

import { getBaseURL } from "@/utils"

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const BASE_URL = await getBaseURL()

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: `%s | ${Config.title} - ${Config.slogan}`,
      absolute: `${Config.title} - ${Config.slogan}`,
    },
    description: Config.description,
    openGraph: {
      images: [
        {
          url: new URL(Config.ogImage, BASE_URL),
          width: 800,
          height: 600,
          alt: Config.title,
        },
        {
          url: new URL(Config.ogImage, BASE_URL),
          width: 1200,
          height: 900,
          alt: Config.title,
        },
        {
          url: new URL(Config.ogImage, BASE_URL),
          width: 1920,
          height: 1440,
          alt: Config.title,
        },
        {
          url: new URL(Config.ogImage, BASE_URL),
          width: 4000,
          height: 3000,
          alt: Config.title,
        },
      ],
    },
    keywords: Config.keywords,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", spaceGrotesk.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

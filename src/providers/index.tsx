import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from "nextjs-toploader"

import { Toaster } from "@/components/ui/toaster"

import { ThemeProvider } from "@/providers/theme-provider"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <main>{children}</main>
      <Toaster />
      <NextTopLoader showForHashAnchor={false} />
      <Analytics />
    </ThemeProvider>
  )
}

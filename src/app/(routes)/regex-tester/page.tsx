import { Metadata } from "next"

import { RegexTester } from "@/components/regex-tester"

export const metadata: Metadata = {
  title: "Advanced Regex Tester | Real-time Regular Expression Testing",
  description:
    "Test, analyze, and understand regular expressions with real-time feedback, performance metrics, and comprehensive explanations. Built with Next.js and TypeScript.",
  keywords: [
    "regex",
    "regular expression",
    "pattern matching",
    "regex tester",
    "regex analyzer",
    "javascript regex",
    "regex performance",
    "regex explanation",
  ],
  authors: [{ name: "Regex Tester Team" }],
  openGraph: {
    title: "Advanced Regex Tester",
    description:
      "Professional regex testing tool with real-time analysis and performance metrics",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Regex Tester",
    description:
      "Professional regex testing tool with real-time analysis and performance metrics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RegexTesterPage() {
  return <RegexTester />
}

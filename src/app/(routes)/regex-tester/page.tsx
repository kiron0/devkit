import { Metadata } from "next"

import { RegexTesterFull } from "@/components/regex"

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="mx-auto max-w-7xl">
        <RegexTesterFull showExport={true} />

        {/* Footer */}
        <div className="text-muted-foreground mt-12 text-center text-sm">
          <p>
            Built with ❤️ using{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://www.typescriptlang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              TypeScript
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

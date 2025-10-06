const title = "DevKit"

export const Config = {
  title,
  slogan: "Essential Tools for Modern Developers",
  description: `${title} offers a powerful suite of development utilities designed for productivity and efficiency. Access regex testing, JSON formatting, encoding/decoding, generators, and more—all in a sleek, responsive interface powered by Next.js 15 and the latest web technologies.`,
  shortDescription:
    "All-in-one toolkit for web developers: regex, JSON, encoding, generators, and more.",
  keywords: [
    "regex tester",
    "json formatter",
    "base64 encoder",
    "url encoder",
    "password generator",
    "hash generator",
    "color converter",
    "text utilities",
    "uuid generator",
    "developer tools",
    "next.js",
    "typescript",
    "web development",
    "code validation",
    "tailwindcss",
    "shadcn-ui",
    "development utilities",
  ],
  features: [
    {
      title: "Comprehensive Toolset",
      description:
        "12+ essential tools for regex, JSON, encoding, security, and more—all in one place.",
      icon: "🛠️",
    },
    {
      title: "Modern User Experience",
      description:
        "Intuitive, responsive design that adapts seamlessly to any device.",
      icon: "✨",
    },
    {
      title: "Privacy First",
      description:
        "All processing is done locally in your browser—your data stays private.",
      icon: "🔒",
    },
    {
      title: "Easy Export & Sharing",
      description:
        "Quickly export results, share via URL, or copy to clipboard. No sign-up required.",
      icon: "📤",
    },
  ],
  author: {
    name: "Toufiq Hasan Kiron",
    url: "https://github.com/kiron0",
  },
  defaultAvatar: "/favicon.ico",
  logo: "/logo.png",
  ogImage: "/og.png",
  social: {
    github: "https://github.com/kiron0/devkit",
    twitter: "#",
    linkedin: "#",
  },
  env: {
    nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV as "development" | "production",
  },
}

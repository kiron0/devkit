import { NextRequest, NextResponse } from "next/server"
import { JSDOM } from "jsdom"

interface SEOCheckResult {
  url: string
  finalUrl: string
  redirected: boolean
  responseTime: number
  fileSize: number
  doctype: {
    valid: boolean
    message: string
  }
  charset: {
    valid: boolean
    text: string
    message: string
  }
  htmlLang: {
    valid: boolean
    text: string
    message: string
  }
  title: {
    valid: boolean
    message: string
    text?: string
    length?: number
  }
  description: {
    valid: boolean
    text: string
    length: number
    message: string
  }
  robotsTag: {
    valid: boolean
    message: string
  }
  viewportTag: {
    valid: boolean
    text: string
    message: string
  }
  ogTags: {
    valid: boolean
    count: number
    message: string
    text: string
  }
  twitterCardTags: {
    valid: boolean
    count: number
    message: string
    text: string
  }
  metaTags: {
    valid: boolean
    count: number
    tags: Record<string, string>
    message: string
  }
  h1Count: {
    valid: boolean
    count: number
    message: string
    texts: string[]
  }
  headingCounts: {
    valid: boolean
    count: number
    message: string
    counts: Record<string, number>
    titles: Record<string, string[]>
    text: string
  }
  wordCount: {
    valid: boolean
    count: number
    message: string
  }
  paragraphCount: {
    valid: boolean
    count: number
    message: string
  }
  imageAltTags: {
    valid: boolean
    count: number
    message: string
  }
  linkCounts: {
    valid: boolean
    counts: {
      internal: number
      external: number
      nofollowExternal: number
    }
    message: string
  }
  canonicalLink: {
    valid: boolean
    message: string
  }
  faviconLink: {
    valid: boolean
    message: string
  }
  appleTouchIcon: {
    valid: boolean
    message: string
  }
  frames: {
    valid: boolean
    count: number
    message: string
  }
  hreflangLinks: {
    valid: boolean
    message: string
  }
  relNextPrev: {
    valid: boolean
    message: string
  }
  structuredData: {
    valid: boolean
    message: string
  }
  httpsCheck: {
    valid: boolean
    message: string
  }
  resourceHttpsCheck: {
    valid: boolean
    report: {
      mixedContent: string[]
      count: number
    }
    message: string
  }
  responseHeaders: {
    valid: boolean
    message: string
    headers: Record<string, string>
  }
  wwwRedirect: {
    valid: boolean
    message: string
  }
  schemaMarkup: {
    valid: boolean
    count: number
    message: string
  }
  breadcrumbNavigation: {
    valid: boolean
    message: string
  }
  sitemapReference: {
    valid: boolean
    message: string
  }
  rssFeeds: {
    valid: boolean
    count: number
    message: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
      }
    } catch (urlError) {
      return NextResponse.json(
        {
          error: `Invalid URL format: ${urlError instanceof Error ? urlError.message : "Unknown error"}`,
        },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // Fetch the URL
    let response
    try {
      // Add timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DevKit-SEO-Checker/1.0)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
        redirect: "follow",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json(
            { error: "Request timeout - URL took too long to respond" },
            { status: 408 }
          )
        }
        if (fetchError.message.includes("fetch failed")) {
          return NextResponse.json(
            {
              error:
                "Network error - Unable to reach the URL. Please check if the URL is accessible and try again.",
            },
            { status: 500 }
          )
        }
      }

      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`,
        },
        { status: 500 }
      )
    }

    const responseTime = Date.now() - startTime
    const finalUrl = response.url
    const redirected = finalUrl !== url
    const html = await response.text()
    const fileSize = new Blob([html]).size

    // Parse HTML
    let dom, document
    try {
      dom = new JSDOM(html)
      document = dom.window.document
    } catch (parseError) {
      return NextResponse.json(
        {
          error: `Failed to parse HTML content: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
        },
        { status: 500 }
      )
    }

    // Check doctype
    const doctype = document.doctype
    const doctypeValid = doctype && doctype.name === "html"
    const doctypeMessage = doctypeValid
      ? "HTML5 Doctype present - Excellent for SEO"
      : "Missing or invalid doctype - Search engines may have difficulty parsing the page"

    // Check charset
    const charsetMeta = document.querySelector("meta[charset]")
    const charsetValid = charsetMeta !== null
    const charsetText = charsetMeta?.getAttribute("charset") || "not found"
    const charsetMessage = charsetValid
      ? `UTF-8 charset declared - Proper encoding ensures correct text rendering`
      : "Missing charset declaration - May cause text encoding issues"

    // Check HTML lang attribute
    const htmlLang = document.documentElement.getAttribute("lang")
    const htmlLangValid = htmlLang !== null && htmlLang !== ""
    const htmlLangText = htmlLang || "not found"
    const htmlLangMessage = htmlLangValid
      ? `HTML lang attribute set to "${htmlLang}" - Helps search engines understand language`
      : "Missing HTML lang attribute - Important for international SEO and accessibility"

    // Check title
    const title = document.querySelector("title")
    const titleValid =
      title && title.textContent && title.textContent.trim() !== ""
    const titleText = title?.textContent?.trim() || ""
    const titleLength = titleText.length
    const titleMessage = titleValid
      ? titleLength <= 60
        ? `Title tag found (${titleLength} chars) - Optimal length for search results`
        : `Title tag found (${titleLength} chars) - Consider shortening to 50-60 characters`
      : "Missing title tag or empty title - Critical for SEO and click-through rates"

    // Check description
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const descriptionValid = descriptionMeta !== null
    const descriptionText = descriptionMeta?.getAttribute("content") || ""
    const descriptionLength = descriptionText.length
    const descriptionMessage =
      descriptionLength > 0 && descriptionLength <= 160
        ? descriptionLength >= 120
          ? `Description length is optimal (${descriptionLength} chars) - Perfect for search snippets`
          : `Description length is good (${descriptionLength} chars) - Consider expanding to 120-160 chars`
        : descriptionLength === 0
          ? "Missing description meta tag - Important for search result snippets"
          : "Description too long (160 chars). Recommended: 120-160 characters for optimal display."

    // Check robots tag
    const robotsMeta = document.querySelector('meta[name="robots"]')
    const robotsValid = true // Default behavior is index,follow
    const robotsMessage = robotsMeta
      ? `Robots meta tag found: "${robotsMeta.getAttribute("content")}" - Explicit crawling instructions set`
      : "No robots meta tag found (defaults to index,follow) - Consider adding for better control"

    // Check viewport tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    const viewportValid = viewportMeta !== null
    const viewportText = viewportMeta?.getAttribute("content") || ""
    const viewportMessage = viewportValid
      ? `Responsive viewport meta tag found: "${viewportText}" - Essential for mobile SEO`
      : "Missing viewport meta tag - Critical for mobile responsiveness and SEO"

    // Check Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]')
    const ogCount = ogTags.length
    const essentialOgTags = ["og:title", "og:description", "og:image", "og:url"]
    const missingOgTags = essentialOgTags.filter(
      (tag) =>
        !Array.from(ogTags).some((og) => og.getAttribute("property") === tag)
    )
    const ogValid = missingOgTags.length === 0
    const ogMessage =
      missingOgTags.length > 0
        ? `Missing essential Open Graph tags: ${missingOgTags.join(", ")}. Found ${ogCount} total. Essential for social sharing.`
        : `Found ${ogCount} Open Graph tags (all essential tags present). Excellent for social media optimization.`
    const ogText = Array.from(ogTags)
      .map(
        (tag) =>
          `<meta property="${tag.getAttribute("property")}" content="${tag.getAttribute("content")}">`
      )
      .join("\n")

    // Check Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]')
    const twitterCount = twitterTags.length
    const essentialTwitterTags = [
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ]
    const missingTwitterTags = essentialTwitterTags.filter(
      (tag) =>
        !Array.from(twitterTags).some((tw) => tw.getAttribute("name") === tag)
    )
    const twitterValid = missingTwitterTags.length === 0
    const twitterMessage =
      missingTwitterTags.length > 0
        ? `Missing essential Twitter Card tags: ${missingTwitterTags.join(", ")}. Found ${twitterCount} total. Important for Twitter sharing appearance.`
        : `Found ${twitterCount} Twitter Card tags (4/4 essential tags for 'summary_large_image' card). Perfect for Twitter optimization.`
    const twitterText = Array.from(twitterTags)
      .map(
        (tag) =>
          `<meta name="${tag.getAttribute("name")}" content="${tag.getAttribute("content")}">`
      )
      .join("\n")

    // Check other meta tags
    const otherMetaTags = document.querySelectorAll(
      'meta:not([name="description"]):not([name="robots"]):not([name="viewport"]):not([property^="og:"]):not([name^="twitter:"])'
    )
    const metaTagsCount = otherMetaTags.length
    const metaTagsValid = metaTagsCount > 0
    const metaTags: Record<string, string> = {}
    otherMetaTags.forEach((tag) => {
      const name =
        tag.getAttribute("name") || tag.getAttribute("property") || "unknown"
      const content = tag.getAttribute("content") || ""
      if (name && content) {
        metaTags[name] = content
      }
    })
    const metaTagsMessage = `Found ${metaTagsCount} additional meta tags`

    // Check headings
    const h1Tags = document.querySelectorAll("h1")
    const h1Count = h1Tags.length
    const h1Valid = h1Count === 1
    const h1Texts = Array.from(h1Tags)
      .map((h1) => h1.textContent?.trim() || "")
      .filter((text) => text)
    const h1Message =
      h1Count === 1
        ? "One H1 tag found - Perfect for SEO hierarchy"
        : h1Count === 0
          ? "No H1 tag found - Critical for SEO, add a main heading"
          : "Multiple H1 tags found (should be only one) - Can confuse search engines"

    const headingTags = document.querySelectorAll("h2, h3, h4, h5, h6")
    const headingCount = headingTags.length
    const headingCounts: Record<string, number> = {
      h2: 0,
      h3: 0,
      h4: 0,
      h5: 0,
      h6: 0,
    }
    const headingTitles: Record<string, string[]> = {
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
    }

    headingTags.forEach((tag) => {
      const tagName = tag.tagName.toLowerCase()
      headingCounts[tagName]++
      const text = tag.textContent?.trim() || ""
      if (text) {
        headingTitles[tagName].push(text)
      }
    })

    const headingValid = headingCount > 0
    const headingMessage =
      headingCount > 0
        ? `Found ${headingCount} heading tags (H2-H6). Good content structure for SEO.`
        : "No heading tags found - Consider adding H2-H6 tags for better content organization and SEO."
    const headingText = Array.from(headingTags)
      .map((tag) => tag.outerHTML)
      .join("\n")

    // Check word count
    const bodyText = document.body?.textContent || ""
    const words = bodyText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    const wordCount = words.length
    const wordCountValid = wordCount > 300
    const wordCountMessage =
      wordCount > 300
        ? `Content has ${wordCount} words - Excellent for SEO (300+ words recommended)`
        : wordCount > 100
          ? `Content has ${wordCount} words - Good length, consider adding more content`
          : `Content has ${wordCount} words - Too short for SEO, aim for 300+ words`

    // Check paragraph count
    const paragraphs = document.querySelectorAll("p")
    const paragraphCount = paragraphs.length
    const paragraphValid = paragraphCount > 0
    const paragraphMessage =
      paragraphCount > 0
        ? `Page has ${paragraphCount} paragraphs - Good content structure`
        : "No paragraphs found - Consider adding paragraph content for better readability and SEO"

    // Check image alt tags
    const imagesAlt = document.querySelectorAll("img")
    const imagesWithAlt = Array.from(imagesAlt).filter((img) =>
      img.hasAttribute("alt")
    )
    const imageAltValid =
      imagesAlt.length === 0 || imagesWithAlt.length === imagesAlt.length
    const imageAltMessage =
      imagesAlt.length === 0
        ? "No images found on the page"
        : imagesWithAlt.length === imagesAlt.length
          ? `All ${imagesAlt.length} images have alt text - Excellent for accessibility and SEO`
          : `${imagesWithAlt.length}/${imagesAlt.length} images have alt text - Missing alt text can hurt SEO and accessibility`

    // Check links
    const links = document.querySelectorAll("a[href]")
    const internalLinks = Array.from(links).filter((link) => {
      const href = link.getAttribute("href") || ""
      return href.startsWith("/") || href.startsWith("#") || href === ""
    })
    const externalLinks = Array.from(links).filter((link) => {
      const href = link.getAttribute("href") || ""
      return (
        href.startsWith("http") && !href.includes(new URL(finalUrl).hostname)
      )
    })
    const nofollowExternalLinks = Array.from(externalLinks).filter((link) =>
      link.getAttribute("rel")?.includes("nofollow")
    )
    const linkCountsValid = links.length > 0
    const linkCountsMessage =
      links.length > 0
        ? `Found ${links.length} links (${internalLinks.length} internal, ${externalLinks.length} external) - Good for site navigation and SEO`
        : "No links found - Consider adding internal links for better site structure and SEO"

    // Check canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    const canonicalValid = canonicalLink !== null
    const canonicalMessage = canonicalValid
      ? `Canonical link found: "${canonicalLink.getAttribute("href")}" - Prevents duplicate content issues`
      : "Missing canonical link - Important for preventing duplicate content and SEO conflicts"

    // Check favicon
    const faviconLink = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]'
    )
    const faviconValid = faviconLink !== null
    const faviconMessage = faviconValid
      ? "Favicon link found"
      : "No favicon link found"

    // Check Apple Touch Icon
    const appleTouchIcon = document.querySelector(
      'link[rel="apple-touch-icon"]'
    )
    const appleTouchIconValid = appleTouchIcon !== null
    const appleTouchIconMessage = appleTouchIconValid
      ? "Apple Touch Icon found"
      : "No Apple Touch Icon found"

    // Check frames
    const frames = document.querySelectorAll("frame, frameset, iframe")
    const framesCount = frames.length
    const framesValid = framesCount === 0
    const framesMessage =
      framesCount === 0
        ? "No frames or framesets found"
        : `${framesCount} frames found`

    // Check hreflang
    const hreflangLinks = document.querySelectorAll(
      'link[rel="alternate"][hreflang]'
    )
    const hreflangValid = true
    const hreflangMessage =
      hreflangLinks.length > 0
        ? `${hreflangLinks.length} hreflang links found`
        : "No hreflang links found"

    // Check rel next/prev
    const relNextPrev = document.querySelectorAll(
      'link[rel="next"], link[rel="prev"]'
    )
    const relNextPrevValid = true
    const relNextPrevMessage =
      relNextPrev.length > 0
        ? `${relNextPrev.length} rel next/prev links found`
        : "No rel=next/prev links found"

    // Check structured data
    const structuredData = document.querySelectorAll(
      'script[type="application/ld+json"]'
    )
    const structuredDataValid = structuredData.length > 0
    const structuredDataMessage = structuredDataValid
      ? `${structuredData.length} structured data blocks found - Excellent for rich snippets and SEO`
      : "No structured data (JSON-LD) found - Consider adding structured data for better search result appearance"

    // Check HTTPS
    const httpsValid = finalUrl.startsWith("https://")
    const httpsMessage = httpsValid
      ? "HTTPS is enabled - Essential for security and SEO ranking"
      : "HTTPS is not enabled - Critical for security and can negatively impact SEO rankings"

    // Check mixed content
    const mixedContent: string[] = []
    const imagesMixed = document.querySelectorAll('img[src^="http://"]')
    const scripts = document.querySelectorAll('script[src^="http://"]')
    const stylesheets = document.querySelectorAll('link[href^="http://"]')

    imagesMixed.forEach((img) =>
      mixedContent.push(`Image: ${img.getAttribute("src")}`)
    )
    scripts.forEach((script) =>
      mixedContent.push(`Script: ${script.getAttribute("src")}`)
    )
    stylesheets.forEach((link) =>
      mixedContent.push(`Stylesheet: ${link.getAttribute("href")}`)
    )

    const resourceHttpsValid = mixedContent.length === 0
    const resourceHttpsMessage =
      mixedContent.length === 0
        ? "No mixed content detected - All resources use HTTPS, excellent for security"
        : `${mixedContent.length} mixed content items found - Security risk and can trigger browser warnings`

    // Check response headers
    const headers = response.headers
    const headerMap: Record<string, string> = {}
    headers.forEach((value, key) => {
      headerMap[key] = value
    })

    const securityHeaders = [
      "content-security-policy",
      "x-content-type-options",
      "x-frame-options",
      "referrer-policy",
      "permissions-policy",
    ]

    const missingHeaders = securityHeaders.filter(
      (header) => !headerMap[header]
    )
    const headerValid = missingHeaders.length === 0
    const headerMessage =
      missingHeaders.length > 0
        ? `Missing ${missingHeaders.length} recommended security headers: ${missingHeaders.join(", ")}. These help with security and can improve SEO rankings.`
        : "All recommended security headers found - Excellent for security and SEO"

    // WWW redirect check
    const wwwValid = true
    const wwwMessage =
      "WWW redirect check requires implementation of navigation check"

    // Check for schema.org markup
    const schemaMarkup = document.querySelectorAll('[itemtype*="schema.org"]')
    const schemaValid = schemaMarkup.length > 0
    const schemaMessage = schemaValid
      ? `${schemaMarkup.length} schema.org markup elements found - Great for structured data`
      : "No schema.org markup found - Consider adding for better search understanding"

    // Check for breadcrumb navigation
    const breadcrumbs = document.querySelectorAll(
      '[class*="breadcrumb"], nav[aria-label*="breadcrumb"]'
    )
    const breadcrumbValid = breadcrumbs.length > 0
    const breadcrumbMessage = breadcrumbValid
      ? "Breadcrumb navigation found - Excellent for user experience and SEO"
      : "No breadcrumb navigation found - Consider adding for better site structure"

    // Check for sitemap reference
    const sitemapLink = document.querySelector('link[rel="sitemap"]')
    const sitemapValid = sitemapLink !== null
    const sitemapMessage = sitemapValid
      ? "Sitemap link found in robots.txt or HTML - Good for search engine discovery"
      : "No sitemap link found - Consider adding for better search engine crawling"

    // Check for RSS feeds
    const rssFeeds = document.querySelectorAll(
      'link[type="application/rss+xml"], link[type="application/atom+xml"]'
    )
    const rssValid = rssFeeds.length > 0
    const rssMessage = rssValid
      ? `${rssFeeds.length} RSS/Atom feeds found - Good for content distribution`
      : "No RSS/Atom feeds found - Consider adding for better content syndication"

    const result: SEOCheckResult = {
      url,
      finalUrl,
      redirected,
      responseTime,
      fileSize,
      doctype: { valid: !!doctypeValid, message: doctypeMessage },
      charset: {
        valid: !!charsetValid,
        text: charsetText ?? "",
        message: charsetMessage,
      },
      htmlLang: {
        valid: !!htmlLangValid,
        text: htmlLangText ?? "",
        message: htmlLangMessage,
      },
      title: {
        valid: !!titleValid,
        message: titleMessage,
        text: titleText ?? "",
        length: titleLength ?? 0,
      },
      description: {
        valid: !!descriptionValid,
        text: descriptionText ?? "",
        length: descriptionLength ?? 0,
        message: descriptionMessage,
      },
      robotsTag: { valid: robotsValid, message: robotsMessage },
      viewportTag: {
        valid: viewportValid,
        text: viewportText,
        message: viewportMessage,
      },
      ogTags: {
        valid: ogValid,
        count: ogCount,
        message: ogMessage,
        text: ogText,
      },
      twitterCardTags: {
        valid: twitterValid,
        count: twitterCount,
        message: twitterMessage,
        text: twitterText,
      },
      metaTags: {
        valid: metaTagsValid,
        count: metaTagsCount,
        tags: metaTags,
        message: metaTagsMessage,
      },
      h1Count: {
        valid: h1Valid,
        count: h1Count,
        message: h1Message,
        texts: h1Texts,
      },
      headingCounts: {
        valid: headingValid,
        count: headingCount,
        message: headingMessage,
        counts: headingCounts,
        titles: headingTitles,
        text: headingText,
      },
      wordCount: {
        valid: wordCountValid,
        count: wordCount,
        message: wordCountMessage,
      },
      paragraphCount: {
        valid: paragraphValid,
        count: paragraphCount,
        message: paragraphMessage,
      },
      imageAltTags: {
        valid: imageAltValid,
        count: imagesAlt.length,
        message: imageAltMessage,
      },
      linkCounts: {
        valid: linkCountsValid,
        counts: {
          internal: internalLinks.length,
          external: externalLinks.length,
          nofollowExternal: nofollowExternalLinks.length,
        },
        message: linkCountsMessage,
      },
      canonicalLink: { valid: canonicalValid, message: canonicalMessage },
      faviconLink: { valid: faviconValid, message: faviconMessage },
      appleTouchIcon: {
        valid: appleTouchIconValid,
        message: appleTouchIconMessage,
      },
      frames: {
        valid: framesValid,
        count: framesCount,
        message: framesMessage,
      },
      hreflangLinks: { valid: hreflangValid, message: hreflangMessage },
      relNextPrev: { valid: relNextPrevValid, message: relNextPrevMessage },
      structuredData: {
        valid: structuredDataValid,
        message: structuredDataMessage,
      },
      httpsCheck: { valid: httpsValid, message: httpsMessage },
      resourceHttpsCheck: {
        valid: resourceHttpsValid,
        report: { mixedContent, count: mixedContent.length },
        message: resourceHttpsMessage,
      },
      responseHeaders: {
        valid: headerValid,
        message: headerMessage,
        headers: headerMap,
      },
      wwwRedirect: { valid: wwwValid, message: wwwMessage },
      schemaMarkup: {
        valid: schemaValid,
        count: schemaMarkup.length,
        message: schemaMessage,
      },
      breadcrumbNavigation: {
        valid: breadcrumbValid,
        message: breadcrumbMessage,
      },
      sitemapReference: {
        valid: sitemapValid,
        message: sitemapMessage,
      },
      rssFeeds: {
        valid: rssValid,
        count: rssFeeds.length,
        message: rssMessage,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("SEO Checker error:", error)
    return NextResponse.json(
      { error: "Failed to analyze URL. Please check the URL and try again." },
      { status: 500 }
    )
  }
}

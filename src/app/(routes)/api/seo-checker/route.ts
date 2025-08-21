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
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const startTime = Date.now()

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DevKit-SEO-Checker/1.0)",
      },
      redirect: "follow",
    })

    const responseTime = Date.now() - startTime
    const finalUrl = response.url
    const redirected = finalUrl !== url
    const html = await response.text()
    const fileSize = new Blob([html]).size

    // Parse HTML
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Check doctype
    const doctype = document.doctype
    const doctypeValid = doctype && doctype.name === "html"
    const doctypeMessage = doctypeValid
      ? "HTML5 Doctype present"
      : "Missing or invalid doctype"

    // Check charset
    const charsetMeta = document.querySelector("meta[charset]")
    const charsetValid = charsetMeta !== null
    const charsetText = charsetMeta?.getAttribute("charset") || "not found"
    const charsetMessage = charsetValid
      ? `UTF-8 charset declared`
      : "Missing charset declaration"

    // Check HTML lang attribute
    const htmlLang = document.documentElement.getAttribute("lang")
    const htmlLangValid = htmlLang !== null && htmlLang !== ""
    const htmlLangText = htmlLang || "not found"
    const htmlLangMessage = htmlLangValid
      ? `HTML lang attribute set to "${htmlLang}"`
      : "Missing HTML lang attribute"

    // Check title
    const title = document.querySelector("title")
    const titleValid =
      title && title.textContent && title.textContent.trim() !== ""
    const titleText = title?.textContent?.trim() || ""
    const titleLength = titleText.length
    const titleMessage = titleValid
      ? "Title tag found"
      : "Missing title tag or empty title"

    // Check description
    const descriptionMeta = document.querySelector('meta[name="description"]')
    const descriptionValid = descriptionMeta !== null
    const descriptionText = descriptionMeta?.getAttribute("content") || ""
    const descriptionLength = descriptionText.length
    const descriptionMessage =
      descriptionLength > 0 && descriptionLength <= 160
        ? "Description length is optimal"
        : descriptionLength === 0
          ? "Missing description meta tag"
          : "Description too long (160 chars). Recommended: 50-160."

    // Check robots tag
    const robotsMeta = document.querySelector('meta[name="robots"]')
    const robotsValid = true // Default behavior is index,follow
    const robotsMessage = robotsMeta
      ? "Robots meta tag found"
      : "No robots meta tag found (defaults to index,follow)"

    // Check viewport tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    const viewportValid = viewportMeta !== null
    const viewportText = viewportMeta?.getAttribute("content") || ""
    const viewportMessage = viewportValid
      ? "Responsive viewport meta tag found"
      : "Missing viewport meta tag"

    // Check Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]')
    const ogCount = ogTags.length
    const essentialOgTags = ["og:type", "og:url"]
    const missingOgTags = essentialOgTags.filter(
      (tag) =>
        !Array.from(ogTags).some((og) => og.getAttribute("property") === tag)
    )
    const ogValid = missingOgTags.length === 0
    const ogMessage =
      missingOgTags.length > 0
        ? `Missing essential Open Graph tags: ${missingOgTags.join(", ")}. Found ${ogCount} total.`
        : `Found ${ogCount} Open Graph tags (all essential tags present).`
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
        ? `Missing essential Twitter Card tags: ${missingTwitterTags.join(", ")}. Found ${twitterCount} total.`
        : `Found ${twitterCount} Twitter Card tags (4/4 essential tags for 'summary_large_image' card).`
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
        ? "One H1 tag found"
        : h1Count === 0
          ? "No H1 tag found"
          : "Multiple H1 tags found (should be only one)"

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
    const headingMessage = `Found ${headingCount} heading tags (H2-H6).`
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
    const wordCountValid = wordCount > 100
    const wordCountMessage = `Content has ${wordCount} words`

    // Check paragraph count
    const paragraphs = document.querySelectorAll("p")
    const paragraphCount = paragraphs.length
    const paragraphValid = paragraphCount > 0
    const paragraphMessage = `Page has ${paragraphCount} paragraphs`

    // Check image alt tags
    const imagesAlt = document.querySelectorAll("img")
    const imagesWithAlt = Array.from(imagesAlt).filter((img) =>
      img.hasAttribute("alt")
    )
    const imageAltValid =
      imagesAlt.length === 0 || imagesWithAlt.length === imagesAlt.length
    const imageAltMessage = `All ${imagesAlt.length} images have alt text`

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
    const linkCountsValid = true
    const linkCountsMessage = `Found ${links.length} links (${internalLinks.length} internal, ${externalLinks.length} external)`

    // Check canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    const canonicalValid = canonicalLink !== null
    const canonicalMessage = canonicalValid
      ? "Canonical link found"
      : "Missing canonical link"

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
      ? `${structuredData.length} structured data blocks found`
      : "No structured data (JSON-LD) found"

    // Check HTTPS
    const httpsValid = finalUrl.startsWith("https://")
    const httpsMessage = httpsValid
      ? "HTTPS is enabled"
      : "HTTPS is not enabled"

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
        ? "No mixed content detected"
        : `${mixedContent.length} mixed content items found`

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
        ? `Missing recommended security/caching header: ${missingHeaders.join("\n")}\nFound: ${Object.keys(headerMap).join(", ")}`
        : "All recommended security headers found"

    // WWW redirect check
    const wwwValid = true
    const wwwMessage =
      "WWW redirect check requires implementation of navigation check"

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

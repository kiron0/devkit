export const colorUtils = {
  // Enhanced hex validation and conversion
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleanHex = hex.replace("#", "").toLowerCase()
    if (!/^[0-9a-f]{6}$/.test(cleanHex)) return null

    return {
      r: parseInt(cleanHex.slice(0, 2), 16),
      g: parseInt(cleanHex.slice(2, 4), 16),
      b: parseInt(cleanHex.slice(4, 6), 16),
    }
  },

  rgbToHex(r: number, g: number, b: number): string {
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
    return (
      "#" +
      [clamp(r), clamp(g), clamp(b)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    )
  },

  // Optimized RGB to HSL conversion
  rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const sum = max + min

    let h = 0
    const l = sum / 2
    const s = l === 0 || l === 1 ? 0 : diff / (l < 0.5 ? sum : 2 - sum)

    if (diff !== 0) {
      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / diff + 2
          break
        case b:
          h = (r - g) / diff + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  },

  // Optimized HSL to RGB conversion
  hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    h = (h % 360) / 360
    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    if (s === 0) {
      const value = Math.round(l * 255)
      return { r: value, g: value, b: value }
    }

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    }
  },

  // Optimized RGB to HSV conversion
  rgbToHsv(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number } {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    const s = max === 0 ? 0 : diff / max
    const v = max

    if (diff !== 0) {
      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / diff + 2
          break
        case b:
          h = (r - g) / diff + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  },

  // RGB to OKLCH conversion (simplified approximation)
  rgbToOklch(
    r: number,
    g: number,
    b: number
  ): { l: number; c: number; h: number } {
    // Convert to linear RGB
    const toLinear = (c: number) => {
      c = c / 255
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    }

    const rLinear = toLinear(r)
    const gLinear = toLinear(g)
    const bLinear = toLinear(b)

    // Convert to XYZ (simplified D65 white point)
    const x = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805
    const y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722
    const z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505

    // Convert to OKLab (simplified)
    const l = Math.pow(y, 1 / 3)
    const a = Math.pow(x, 1 / 3) - Math.pow(y, 1 / 3)
    const bLab = Math.pow(y, 1 / 3) - Math.pow(z, 1 / 3)

    // Convert to OKLCH
    const c = Math.sqrt(a * a + bLab * bLab)
    const h = Math.atan2(bLab, a) * (180 / Math.PI)

    return {
      l: Math.max(0, Math.min(1, l)),
      c: Math.max(0, c),
      h: h < 0 ? h + 360 : h,
    }
  },

  // OKLCH to RGB conversion (simplified approximation)
  oklchToRgb(
    l: number,
    c: number,
    h: number
  ): { r: number; g: number; b: number } {
    // Convert to OKLab
    const hRad = h * (Math.PI / 180)
    const a = Math.cos(hRad) * c
    const bLab = Math.sin(hRad) * c

    // Convert to XYZ (simplified)
    const x = Math.pow(l + a * 0.3963377774 + bLab * 0.2158037573, 3)
    const y = Math.pow(l + a * -0.1055613458 + bLab * -0.0638541728, 3)
    const z = Math.pow(l + a * -0.0894841775 + bLab * -1.291485548, 3)

    // Convert to linear RGB
    const rLinear = x * 3.2406 + y * -1.5372 + z * -0.4986
    const gLinear = x * -0.9689 + y * 1.8758 + z * 0.0415
    const bLinear = x * 0.0557 + y * -0.204 + z * 1.057

    // Convert to sRGB
    const toSRGB = (c: number) => {
      c = Math.max(0, Math.min(1, c))
      return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
    }

    return {
      r: Math.round(toSRGB(rLinear) * 255),
      g: Math.round(toSRGB(gLinear) * 255),
      b: Math.round(toSRGB(bLinear) * 255),
    }
  },
}

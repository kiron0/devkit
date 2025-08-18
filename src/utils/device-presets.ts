import { Monitor, Smartphone, Tablet } from "lucide-react"

export interface DevicePreset {
  name: string
  width: number
  height: number
  category: "mobile" | "tablet" | "desktop" | "custom"
  icon: React.ComponentType<{ className?: string }>
}

export const devicePresets: DevicePreset[] = [
  // Mobile Devices
  {
    name: "iPhone SE",
    width: 375,
    height: 667,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 12 Mini",
    width: 375,
    height: 812,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 12/13/14",
    width: 390,
    height: 844,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 12/13/14 Pro",
    width: 393,
    height: 852,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 14 Plus",
    width: 428,
    height: 926,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "iPhone 14 Pro Max",
    width: 430,
    height: 932,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Samsung Galaxy S8",
    width: 360,
    height: 740,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Samsung Galaxy S20",
    width: 360,
    height: 800,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Samsung Galaxy S21",
    width: 384,
    height: 854,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Google Pixel 5",
    width: 393,
    height: 851,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "Google Pixel 6",
    width: 411,
    height: 823,
    category: "mobile",
    icon: Smartphone,
  },
  {
    name: "OnePlus 9",
    width: 412,
    height: 869,
    category: "mobile",
    icon: Smartphone,
  },

  // Tablets
  {
    name: "iPad Mini",
    width: 768,
    height: 1024,
    category: "tablet",
    icon: Tablet,
  },
  { name: "iPad", width: 820, height: 1180, category: "tablet", icon: Tablet },
  {
    name: "iPad Air",
    width: 834,
    height: 1194,
    category: "tablet",
    icon: Tablet,
  },
  {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    category: "tablet",
    icon: Tablet,
  },
  {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    category: "tablet",
    icon: Tablet,
  },
  {
    name: "Samsung Galaxy Tab",
    width: 800,
    height: 1280,
    category: "tablet",
    icon: Tablet,
  },
  {
    name: "Surface Pro",
    width: 912,
    height: 1368,
    category: "tablet",
    icon: Tablet,
  },

  // Desktop
  {
    name: "Small Desktop",
    width: 1024,
    height: 768,
    category: "desktop",
    icon: Monitor,
  },
  {
    name: "Medium Desktop",
    width: 1280,
    height: 720,
    category: "desktop",
    icon: Monitor,
  },
  {
    name: "Large Desktop",
    width: 1366,
    height: 768,
    category: "desktop",
    icon: Monitor,
  },
  {
    name: "Full HD",
    width: 1920,
    height: 1080,
    category: "desktop",
    icon: Monitor,
  },
  { name: "4K", width: 3840, height: 2160, category: "desktop", icon: Monitor },
]

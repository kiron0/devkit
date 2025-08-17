// Common patterns for tools to reduce duplication

export const COMMON_FEATURES = {
  REAL_TIME: {
    icon: "⚡",
    title: "Real-time",
    description: "Instant processing and results",
  },
  FILE_SUPPORT: {
    icon: "📁",
    title: "File Support",
    description: "Upload and download files",
  },
  COPY_READY: {
    icon: "📋",
    title: "Copy Ready",
    description: "One-click copy to clipboard",
  },
  VALIDATION: {
    icon: "✅",
    title: "Validation",
    description: "Real-time input validation",
  },
  CUSTOMIZABLE: {
    icon: "🎨",
    title: "Customizable",
    description: "Flexible options and settings",
  },
  HISTORY: {
    icon: "📋",
    title: "History",
    description: "Track recent operations",
  },
  EXPORT: {
    icon: "📤",
    title: "Export",
    description: "Download results in various formats",
  },
  PRIVACY: {
    icon: "🔒",
    title: "Privacy Focused",
    description: "All processing happens locally",
  },
}

export const getCommonFeatures = (
  featureKeys: (keyof typeof COMMON_FEATURES)[]
): Array<{ icon: string; title: string; description: string }> => {
  return featureKeys.map((key) => COMMON_FEATURES[key])
}

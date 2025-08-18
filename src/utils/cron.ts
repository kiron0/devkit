export function describeCron(
  min: string,
  hour: string,
  dom: string,
  mon: string,
  dow: string
) {
  // Helper to humanize a single field
  function fieldDesc(
    field: string,
    name: string,
    all: string,
    unit: string,
    range: [number, number],
    map?: Record<string, string>
  ) {
    if (field === all) return null
    if (/^\d+$/.test(field)) {
      if (map && map[field]) return `${name} ${map[field]}`
      return `${name} ${field}` + (unit ? ` ${unit}` : "")
    }
    if (/^\d+(,\d+)+$/.test(field)) {
      const vals = field.split(",").map((v) => (map && map[v] ? map[v] : v))
      return `${name}s ${vals.join(", ")}` + (unit ? ` ${unit}` : "")
    }
    if (/^(\d+)-(\d+)$/.test(field)) {
      const [, start, end] = field.match(/(\d+)-(\d+)/) || []
      return (
        `${name}s ${map && map[start] ? map[start] : start} to ${map && map[end] ? map[end] : end}` +
        (unit ? ` ${unit}` : "")
      )
    }
    if (/^\*\/(\d+)$/.test(field)) {
      const [, step] = field.match(/\*\/(\d+)/) || []
      return `Every ${step} ${unit}${step === "1" ? "" : "s"}`
    }
    return `${name} ${field}`
  }

  // Special cases for common patterns
  if (min === "*" && hour === "*" && dom === "*" && mon === "*" && dow === "*")
    return "Every minute"
  if (
    /^\d+$/.test(min) &&
    hour === "*" &&
    dom === "*" &&
    mon === "*" &&
    dow === "*"
  )
    return `Every hour at minute ${min}`
  if (
    /^\d+$/.test(min) &&
    /^\d+$/.test(hour) &&
    dom === "*" &&
    mon === "*" &&
    dow === "*"
  )
    return `Every day at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`
  if (
    /^\d+$/.test(min) &&
    /^\d+$/.test(hour) &&
    dom === "*" &&
    mon === "*" &&
    dow === "1-5"
  )
    return `Weekdays at ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`
  if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "0")
    return "Every Sunday at midnight"
  if (min === "0" && hour === "0" && dom === "1" && mon === "*" && dow === "*")
    return "Every month on the 1st at midnight"
  if (
    min === "0" &&
    hour === "9" &&
    dom === "*" &&
    mon === "*" &&
    dow === "1-5"
  )
    return "Weekdays at 9:00"
  if (min === "0" && hour === "0" && dom === "*" && mon === "*" && dow === "*")
    return "Every day at midnight"
  if (
    min === "*/5" &&
    hour === "*" &&
    dom === "*" &&
    mon === "*" &&
    dow === "*"
  )
    return "Every 5 minutes"
  if (
    min === "*/15" &&
    hour === "*" &&
    dom === "*" &&
    mon === "*" &&
    dow === "*"
  )
    return "Every 15 minutes"

  // Build up a human description for more complex cases
  const parts = [
    fieldDesc(min, "minute", "*", "minute", [0, 59]),
    fieldDesc(hour, "hour", "*", "hour", [0, 23]),
    fieldDesc(dom, "day", "*", "of the month", [1, 31]),
    fieldDesc(mon, "month", "*", "", [1, 12]),
    fieldDesc(dow, "on", "*", "", [0, 6], {
      "0": "Sunday",
      "1": "Monday",
      "2": "Tuesday",
      "3": "Wednesday",
      "4": "Thursday",
      "5": "Friday",
      "6": "Saturday",
    }),
  ].filter(Boolean)

  if (parts.length === 0) return "Every minute"
  return (
    "At " +
    parts
      .map((p, i) =>
        i === 0
          ? p
          : i === 1 && parts[0]?.startsWith("Every")
            ? p
              ? p.replace(/^hour/, "on hour")
              : p
            : p
      )
      .join(", ")
  )
}

export function isValidField(v: string) {
  // Accept *, number, range, list, step, range/step, list/step
  return /^((\*|\d+)(\/\d+)?|\d+-\d+(\/\d+)?|\d+(,\d+)*|\d+-\d+|\d+(,\d+)*(\/\d+)?|\*\/\d+)$/.test(
    v.trim()
  )
}

export const presets = [
  { label: "Every minute", m: "*", h: "*", dom: "*", mon: "*", dow: "*" },
  {
    label: "Every 5 minutes",
    m: "*/5",
    h: "*",
    dom: "*",
    mon: "*",
    dow: "*",
  },
  { label: "Every hour", m: "0", h: "*", dom: "*", mon: "*", dow: "*" },
  {
    label: "Every day at midnight",
    m: "0",
    h: "0",
    dom: "*",
    mon: "*",
    dow: "*",
  },
  {
    label: "Every day at noon",
    m: "0",
    h: "12",
    dom: "*",
    mon: "*",
    dow: "*",
  },
  {
    label: "Every Monday at 9 AM",
    m: "0",
    h: "9",
    dom: "*",
    mon: "*",
    dow: "1",
  },
  {
    label: "Weekdays at 9 AM",
    m: "0",
    h: "9",
    dom: "*",
    mon: "*",
    dow: "1-5",
  },
  {
    label: "Every month on 1st at midnight",
    m: "0",
    h: "0",
    dom: "1",
    mon: "*",
    dow: "*",
  },
  {
    label: "Every week on Sunday at midnight",
    m: "0",
    h: "0",
    dom: "*",
    mon: "*",
    dow: "0",
  },
]

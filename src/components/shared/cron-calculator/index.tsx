"use client"

import { useMemo, useState } from "react"
import { RotateCcw, Zap } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

function describeCron(
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

function isValidField(v: string) {
  // Accept *, number, range, list, step, range/step, list/step
  return /^((\*|\d+)(\/\d+)?|\d+-\d+(\/\d+)?|\d+(,\d+)*|\d+-\d+|\d+(,\d+)*(\/\d+)?|\*\/\d+)$/.test(
    v.trim()
  )
}

export function CronCalculator() {
  const [m, setM] = useState("*")
  const [h, setH] = useState("*")
  const [dom, setDom] = useState("*")
  const [mon, setMon] = useState("*")
  const [dow, setDow] = useState("*")

  const expr = useMemo(
    () => `${m} ${h} ${dom} ${mon} ${dow}`,
    [m, h, dom, mon, dow]
  )
  const valid = [m, h, dom, mon, dow].every(isValidField)
  const desc = useMemo(
    () => (valid ? describeCron(m, h, dom, mon, dow) : "Invalid cron field(s)"),
    [m, h, dom, mon, dow, valid]
  )

  const clear = () => {
    setM("*")
    setH("*")
    setDom("*")
    setMon("*")
    setDow("*")
  }

  // Preset schedules
  const presets = [
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

  const handlePreset = (preset: (typeof presets)[0]) => {
    setM(preset.m)
    setH(preset.h)
    setDom(preset.dom)
    setMon(preset.mon)
    setDow(preset.dow)
  }

  const stats = [
    {
      label: "Expression",
      value: expr,
      icon: "⏰",
    },
    {
      label: "Valid",
      value: valid ? "Yes" : "No",
      icon: valid ? "✅" : "❌",
    },
    {
      label: "Fields",
      value: "5/5",
      icon: "📊",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "VALIDATION",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={clear} variant="outline">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        {presets.map((preset) => (
          <Button
            key={preset.label}
            size="sm"
            variant={
              m === preset.m &&
              h === preset.h &&
              dom === preset.dom &&
              mon === preset.mon &&
              dow === preset.dow
                ? "default"
                : "outline"
            }
            onClick={() => handlePreset(preset)}
            className="gap-2"
          >
            <Zap className="text-primary-foreground h-4 w-4" />
            {preset.label}
          </Button>
        ))}
      </ToolControls>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Fields</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pt-0">
            <div className="space-y-2">
              <Label className="mb-1 block text-sm">Minute</Label>
              <Select value={m} onValueChange={setM}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">Every minute (*)</SelectItem>
                  {[...Array(60).keys()].map((v) => (
                    <SelectItem key={v} value={v.toString()}>
                      {v}
                    </SelectItem>
                  ))}
                  <SelectItem value="*/5">Every 5 min (*/5)</SelectItem>
                  <SelectItem value="*/15">Every 15 min (*/15)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="mb-1 block text-sm">Hour</Label>
              <Select value={h} onValueChange={setH}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">Every hour (*)</SelectItem>
                  {[...Array(24).keys()].map((v) => (
                    <SelectItem key={v} value={v.toString()}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="mb-1 block text-sm">Day of Month</Label>
              <Select value={dom} onValueChange={setDom}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">Every day (*)</SelectItem>
                  {[...Array(31).keys()].map((v) => (
                    <SelectItem key={v + 1} value={(v + 1).toString()}>
                      {v + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="mb-1 block text-sm">Month</Label>
              <Select value={mon} onValueChange={setMon}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">Every month (*)</SelectItem>
                  {[...Array(12).keys()].map((v) => (
                    <SelectItem key={v + 1} value={(v + 1).toString()}>
                      {v + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="mb-1 block text-sm">Day of Week</Label>
              <Select value={dow} onValueChange={setDow}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">Every day (*)</SelectItem>
                  <SelectItem value="0">Sunday (0)</SelectItem>
                  <SelectItem value="1">Monday (1)</SelectItem>
                  <SelectItem value="2">Tuesday (2)</SelectItem>
                  <SelectItem value="3">Wednesday (3)</SelectItem>
                  <SelectItem value="4">Thursday (4)</SelectItem>
                  <SelectItem value="5">Friday (5)</SelectItem>
                  <SelectItem value="6">Saturday (6)</SelectItem>
                  <SelectItem value="1-5">Weekdays (1-5)</SelectItem>
                  <SelectItem value="0,6">Weekend (0,6)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Expression</CardTitle>
              <CopyButton text={expr} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-2 font-mono text-base">{expr}</div>
            <div className="text-muted-foreground mb-2 text-sm">{desc}</div>
            <div className="mt-4">
              <div className="mb-1 font-semibold">Field Reference:</div>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>
                  <code>*</code> — Any value
                </li>
                <li>
                  <code>,</code> — Value list separator
                </li>
                <li>
                  <code>-</code> — Range of values
                </li>
                <li>
                  <code>/</code> — Step values
                </li>
                <li>
                  <code>0-6</code> — Sunday to Saturday (day of week)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

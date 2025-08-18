"use client"

import { useMemo, useState } from "react"
import { Clock, RotateCcw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  return `Minute: ${min}, Hour: ${hour}, Day: ${dom}, Month: ${mon}, Weekday: ${dow}`
}

function isValidField(v: string) {
  return /^(\*|\d+|\d+-\d+|\d+(,\d+)*)$/.test(v.trim())
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

  const handleSampleData = () => {
    const sampleCrons = [
      {
        m: "0",
        h: "0",
        dom: "*",
        mon: "*",
        dow: "*",
        desc: "Daily at midnight",
      },
      { m: "0", h: "*/6", dom: "*", mon: "*", dow: "*", desc: "Every 6 hours" },
      {
        m: "0",
        h: "9",
        dom: "*",
        mon: "*",
        dow: "1-5",
        desc: "Weekdays at 9 AM",
      },
      {
        m: "0",
        h: "0",
        dom: "1",
        mon: "*",
        dow: "*",
        desc: "Monthly on the 1st",
      },
      {
        m: "*/15",
        h: "*",
        dom: "*",
        mon: "*",
        dow: "*",
        desc: "Every 15 minutes",
      },
      {
        m: "0",
        h: "2",
        dom: "*",
        mon: "*",
        dow: "0",
        desc: "Weekly on Sunday at 2 AM",
      },
    ]
    const randomCron =
      sampleCrons[Math.floor(Math.random() * sampleCrons.length)]
    setM(randomCron.m)
    setH(randomCron.h)
    setDom(randomCron.dom)
    setMon(randomCron.mon)
    setDow(randomCron.dow)
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
        <Button onClick={handleSampleData} variant="outline">
          <Clock className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Fields</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 pt-0">
            <div>
              <Label className="mb-1 block text-sm">Minute</Label>
              <Input value={m} onChange={(e) => setM(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Hour</Label>
              <Input value={h} onChange={(e) => setH(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Day of Month</Label>
              <Input value={dom} onChange={(e) => setDom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Month</Label>
              <Input value={mon} onChange={(e) => setMon(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Day of Week</Label>
              <Input value={dow} onChange={(e) => setDow(e.target.value)} />
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
            <div className="font-mono text-sm">{expr}</div>
            <div className="text-muted-foreground mt-2 text-sm">{desc}</div>
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

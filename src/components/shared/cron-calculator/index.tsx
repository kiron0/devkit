"use client"

import { useMemo, useState } from "react"
import { describeCron, isValidField, presets } from "@/utils"
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
  ToolControls,
  ToolLayout,
} from "@/components/common"

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

  const handlePreset = (preset: (typeof presets)[0]) => {
    setM(preset.m)
    setH(preset.h)
    setDom(preset.dom)
    setMon(preset.mon)
    setDow(preset.dow)
  }

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
            <Zap className="h-4 w-4" />
            {preset.label}
          </Button>
        ))}
      </ToolControls>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

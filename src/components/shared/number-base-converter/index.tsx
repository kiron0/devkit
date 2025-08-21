"use client"

import { useMemo, useState } from "react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  ToolControls,
  ToolLayout,
} from "@/components/common"

const BASES = [
  { value: 2, label: "Binary (Base 2)" },
  { value: 8, label: "Octal (Base 8)" },
  { value: 10, label: "Decimal (Base 10)" },
  { value: 16, label: "Hexadecimal (Base 16)" },
]

export function NumberBaseConverter() {
  const [input, setInput] = useState("")
  const [base, setBase] = useState(10)

  const parsed = useMemo(() => {
    if (!input.trim()) return null
    try {
      // Support base prefixes if base = 10 and input contains 0x/0o/0b
      let detectedBase = base
      const trimmed = input.trim()
      if (base === 10) {
        if (/^0b[01]+$/i.test(trimmed)) detectedBase = 2
        else if (/^0o[0-7]+$/i.test(trimmed)) detectedBase = 8
        else if (/^0x[0-9a-f]+$/i.test(trimmed)) detectedBase = 16
      }
      const cleaned = trimmed.replace(/^0[bBoOxX]/, "")
      const value = parseInt(cleaned, detectedBase)
      if (Number.isNaN(value)) return null
      return value
    } catch {
      return null
    }
  }, [input, base])

  const conversions = useMemo(() => {
    if (parsed === null) return null
    return {
      binary: parsed.toString(2),
      octal: parsed.toString(8),
      decimal: parsed.toString(10),
      hex: parsed.toString(16).toUpperCase(),
    }
  }, [parsed])

  const handleClear = () => {
    setInput("")
  }

  const handleSampleData = () => {
    const sampleNumbers = ["42", "0xFF", "0b101010", "0o52", "255", "1000000"]
    const randomNumber =
      sampleNumbers[Math.floor(Math.random() * sampleNumbers.length)]
    setInput(randomNumber)
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
        <Button variant="outline" onClick={handleClear} disabled={!input}>
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          Sample Data
        </Button>
      </ToolControls>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-2">
              <Label>Number</Label>
              <Input
                placeholder="Enter a number (supports 0b, 0o, 0x)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Base</Label>
              <Select
                value={base.toString()}
                onValueChange={(value) => setBase(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select base" />
                </SelectTrigger>
                <SelectContent>
                  {BASES.map((base) => (
                    <SelectItem key={base.value} value={base.value.toString()}>
                      {base.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversions</CardTitle>
              <CopyButton
                text={conversions ? JSON.stringify(conversions, null, 2) : ""}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              readOnly
              className="bg-muted/50 max-h-[150px] min-h-[130px] resize-none font-mono text-sm"
              value={
                conversions
                  ? `Binary: ${conversions.binary}\nOctal: ${conversions.octal}\nDecimal: ${conversions.decimal}\nHex: ${conversions.hex}`
                  : "Enter a valid number to see conversions"
              }
            />
          </CardContent>
        </Card>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

"use client"

import { Gradient } from "qr-code-styling"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface GradientControlsProps {
  label?: string
  gradient?: Gradient
  onChange: (g?: Gradient) => void
  defaultStart?: string
  defaultEnd?: string
  showRotation?: boolean
}

export function GradientControls({
  label,
  gradient,
  onChange,
  defaultStart = "#000000",
  defaultEnd = "#666666",
  showRotation = true,
}: GradientControlsProps) {
  const type = gradient?.type ?? "linear"
  const rotation =
    typeof gradient?.rotation === "number" ? gradient!.rotation! : 0
  const start = gradient?.colorStops?.[0]?.color ?? defaultStart
  const end = gradient?.colorStops?.[1]?.color ?? defaultEnd

  const emit = (next: Partial<Gradient>) => {
    const g: Gradient = {
      type,
      rotation,
      colorStops: [
        { offset: 0, color: start },
        { offset: 1, color: end },
      ],
      ...next,
    }
    onChange(g)
  }

  return (
    <div className="space-y-3">
      {label ? <Label className="block">{label}</Label> : null}
      <div className="space-y-2">
        <Label>Gradient Type</Label>
        <Select
          value={type}
          onValueChange={(v) => emit({ type: v as Gradient["type"] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="radial">Radial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {showRotation ? (
        <div className="space-y-2">
          <Label>Rotation: {rotation}°</Label>
          <Slider
            min={0}
            max={360}
            step={1}
            value={[rotation]}
            onValueChange={(v) => emit({ rotation: v[0] })}
          />
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <Label className="min-w-20">Start</Label>
        <input
          type="color"
          value={start}
          onChange={(e) =>
            emit({
              colorStops: [
                { offset: 0, color: e.target.value },
                { offset: 1, color: end },
              ],
            })
          }
          className="h-10 w-20 cursor-pointer rounded border"
        />
        <Input
          value={start}
          onChange={(e) =>
            emit({
              colorStops: [
                { offset: 0, color: e.target.value },
                { offset: 1, color: end },
              ],
            })
          }
          className="flex-1 font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="min-w-20">End</Label>
        <input
          type="color"
          value={end}
          onChange={(e) =>
            emit({
              colorStops: [
                { offset: 0, color: start },
                { offset: 1, color: e.target.value },
              ],
            })
          }
          className="h-10 w-20 cursor-pointer rounded border"
        />
        <Input
          value={end}
          onChange={(e) =>
            emit({
              colorStops: [
                { offset: 0, color: start },
                { offset: 1, color: e.target.value },
              ],
            })
          }
          className="flex-1 font-mono text-sm"
        />
      </div>
    </div>
  )
}

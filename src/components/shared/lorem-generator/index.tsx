"use client"

import { useMemo, useState } from "react"
import { FileText } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(
    " "
  )

function generateLorem(paragraphs: number, wordsPerParagraph: number) {
  const paras: string[] = []
  for (let p = 0; p < paragraphs; p++) {
    const words: string[] = []
    for (let i = 0; i < wordsPerParagraph; i++) {
      words.push(WORDS[(p * wordsPerParagraph + i) % WORDS.length])
    }
    const sentence =
      words.join(" ").charAt(0).toUpperCase() + words.join(" ").slice(1) + "."
    paras.push(sentence)
  }
  return paras.join("\n\n")
}

export function LoremGenerator() {
  const [paragraphs, setParagraphs] = useState(3)
  const [words, setWords] = useState(20)

  const output = useMemo(
    () => generateLorem(paragraphs, words),
    [paragraphs, words]
  )

  const handleSampleData = () => {
    const sampleConfigs = [
      { paragraphs: 2, words: 15 },
      { paragraphs: 4, words: 25 },
      { paragraphs: 1, words: 50 },
      { paragraphs: 3, words: 30 },
    ]
    const randomConfig =
      sampleConfigs[Math.floor(Math.random() * sampleConfigs.length)]
    setParagraphs(randomConfig.paragraphs)
    setWords(randomConfig.words)
  }

  const stats = [
    {
      label: "Paragraphs",
      value: paragraphs.toString(),
      icon: "📄",
    },
    {
      label: "Words",
      value: words.toString(),
      icon: "📝",
    },
    {
      label: "Characters",
      value: output.length.toString(),
      icon: "🔤",
    },
  ]

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={handleSampleData} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Sample Config
        </Button>
      </ToolControls>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0">
            <div className="grid gap-2">
              <Label>Paragraphs</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value || "1"))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Words per paragraph</Label>
              <Input
                type="number"
                min={5}
                max={200}
                value={words}
                onChange={(e) => setWords(parseInt(e.target.value || "10"))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              <CopyButton text={output} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

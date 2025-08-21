"use client"

import { useMemo, useState } from "react"
import { FileText, RefreshCw } from "lucide-react"

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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  ToolControls,
  ToolLayout,
} from "@/components/common"

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  )

function generateLorem(
  paragraphs: number,
  wordsPerParagraph: number,
  startWithLorem: boolean,
  format: string,
  seed: number
) {
  const paras: string[] = []

  for (let p = 0; p < paragraphs; p++) {
    const words: string[] = []

    for (let i = 0; i < wordsPerParagraph; i++) {
      const wordIndex = (seed + p * wordsPerParagraph + i) % WORDS.length
      words.push(WORDS[wordIndex])
    }

    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)

    const sentence = words.join(" ") + "."

    if (format === "html") {
      paras.push(`<p>${sentence}</p>\n`)
    } else {
      paras.push(sentence)
    }
  }

  if (startWithLorem) {
    if (format === "html") {
      paras[0] = paras[0].replace(
        /<p>([^<]+)<\/p>/,
        "<p>Lorem ipsum dolor sit amet, $1</p>"
      )
    } else {
      paras[0] = "Lorem ipsum dolor sit amet, " + paras[0]
    }
  }

  return paras.join(format === "html" ? "\n" : "\n\n")
}

export function LoremGenerator() {
  const [paragraphs, setParagraphs] = useState(3)
  const [words, setWords] = useState(50)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [format, setFormat] = useState("plain")
  const [seed, setSeed] = useState(0)

  const output = useMemo(
    () => generateLorem(paragraphs, words, startWithLorem, format, seed),
    [paragraphs, words, startWithLorem, format, seed]
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

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1)
  }

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
          <FileText className="h-4 w-4" />
          Sample Config
        </Button>
        <Button onClick={handleRegenerate} variant="outline">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </ToolControls>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Paragraphs: {paragraphs}</Label>
              </div>
              <Slider
                value={[paragraphs]}
                onValueChange={(value) => setParagraphs(value[0])}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Words per paragraph: {words}</Label>
              </div>
              <Slider
                value={[words]}
                onValueChange={(value) => setWords(value[0])}
                min={5}
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="start-with-lorem"
                  checked={startWithLorem}
                  onCheckedChange={setStartWithLorem}
                />
                <Label htmlFor="start-with-lorem">
                  Start with &quot;Lorem ipsum&quot;
                </Label>
              </div>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain Text</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
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
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

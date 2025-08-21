"use client"

import { useRef, useState } from "react"
import { Code, Play, RotateCcw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  ToolControls,
  ToolLayout,
} from "@/components/common"
import { CodeHighlighter } from "@/components/tools/markdown/code-highlighter"

export function Playground() {
  const [code, setCode] = useState<string>("console.log('Hello');\n1 + 2")
  const [output, setOutput] = useState<string>("")
  const logRef = useRef<string[]>([])

  const run = () => {
    logRef.current = []
    const originalLog = console.log
    console.log = (...args: unknown[]) => {
      logRef.current.push(args.map((a) => String(a)).join(" "))
    }
    try {
      const result = eval(code)
      if (result !== undefined) logRef.current.push(String(result))
      setOutput(logRef.current.join("\n"))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setOutput(String(e?.message || e))
    } finally {
      console.log = originalLog
    }
  }

  const clear = () => {
    setCode("")
    setOutput("")
  }

  const handleSampleData = () => {
    const sampleCode = `// Sample JavaScript code
const numbers = [1, 2, 3, 4, 5];

// Array methods
console.log('Original array:', numbers);
console.log('Doubled:', numbers.map(n => n * 2));
console.log('Sum:', numbers.reduce((a, b) => a + b, 0));
console.log('Even numbers:', numbers.filter(n => n % 2 === 0));

// Object example
const user = {
  name: 'John Doe',
  age: 30,
  skills: ['JavaScript', 'React', 'Node.js']
};

console.log('User:', user);
console.log('Skills count:', user.skills.length);

// Function example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci(10):', fibonacci(10));`
    setCode(sampleCode)
    setOutput("")
  }

  const features = getCommonFeatures(["REAL_TIME", "COPY_READY", "PRIVACY"])

  return (
    <ToolLayout
      title="Playground"
      description="Run JavaScript/TypeScript code with live output"
    >
      <ToolControls>
        <Button onClick={run}>
          <Play className="h-4 w-4" />
          Run
        </Button>
        <Button onClick={clear} variant="outline">
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <Code className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Code (JS/TS)</CardTitle>
              <CopyButton text={code} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="max-h-[360px] min-h-[360px] resize-none font-mono text-sm"
              placeholder="// Enter your JavaScript/TypeScript code here..."
            />
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
            {output ? (
              <CodeHighlighter
                language="javascript"
                className="max-h-[360px] min-h-[360px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[360px] min-h-[360px] items-center justify-center rounded-md border bg-transparent text-sm">
                Run your code to see the output here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

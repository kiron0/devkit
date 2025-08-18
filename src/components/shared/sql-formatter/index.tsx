"use client"

import { useMemo, useState } from "react"
import { Database, RotateCcw } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  CopyButton,
  FeatureGrid,
  StatsDisplay,
  ToolControls,
  ToolLayout,
} from "@/components/common"

import { CodeHighlighter } from "../markdown/code-highlighter"

const KEYWORDS = [
  "select",
  "from",
  "where",
  "group by",
  "order by",
  "insert",
  "into",
  "values",
  "update",
  "set",
  "delete",
  "join",
  "left join",
  "right join",
  "inner join",
  "outer join",
  "limit",
  "offset",
]

function simpleFormat(sql: string) {
  let s = sql.trim().replace(/\s+/g, " ")
  // uppercase keywords
  for (const kw of KEYWORDS.sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi")
    s = s.replace(re, kw.toUpperCase())
  }
  // line breaks for main clauses
  s = s
    .replace(
      /\b(FROM|WHERE|GROUP BY|ORDER BY|VALUES|SET|LIMIT|OFFSET)\b/g,
      "\n$1"
    )
    .replace(/\b(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN)\b/g, "\n  $1")
  return s
}

export function SqlFormatterTool() {
  const [input, setInput] = useState("")
  const output = useMemo(() => (input ? simpleFormat(input) : ""), [input])

  const clear = () => setInput("")

  const handleSampleData = () => {
    const sampleQueries = [
      "select u.name, u.email, p.title from users u left join posts p on u.id = p.user_id where u.active = true and u.created_at > '2023-01-01' order by u.name asc limit 10",
      "insert into products (name, price, category) values ('Laptop', 999.99, 'Electronics'), ('Mouse', 29.99, 'Accessories')",
      "update users set last_login = now(), login_count = login_count + 1 where id = 123",
      "select category, count(*) as total, avg(price) as avg_price from products group by category having count(*) > 5 order by total desc",
      "delete from sessions where expires_at < now() and user_id not in (select id from users where active = true)",
    ]
    const randomQuery =
      sampleQueries[Math.floor(Math.random() * sampleQueries.length)]
    setInput(randomQuery)
  }

  const stats = [
    {
      label: "Input Length",
      value: input.length.toString(),
      icon: "📝",
    },
    {
      label: "Output Length",
      value: output.length.toString(),
      icon: "📄",
    },
    {
      label: "Keywords",
      value: KEYWORDS.filter((kw) =>
        input.toLowerCase().includes(kw.toLowerCase())
      ).length.toString(),
      icon: "🔑",
    },
  ]

  const features = getCommonFeatures(["REAL_TIME", "COPY_READY", "PRIVACY"])

  return (
    <ToolLayout>
      <ToolControls>
        <Button onClick={clear} variant="outline" disabled={!input}>
          <RotateCcw className="h-4 w-4" />
          Clear
        </Button>
        <Button onClick={handleSampleData} variant="outline">
          <Database className="h-4 w-4" />
          Sample
        </Button>
      </ToolControls>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">SQL</CardTitle>
              <CopyButton text={input} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="select * from users where active = true order by created_at desc"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="max-h-[300px] min-h-[300px] resize-none font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Formatted</CardTitle>
              <CopyButton text={output} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {output ? (
              <CodeHighlighter
                language="sql"
                className="max-h-[300px] min-h-[300px] overflow-y-auto"
              >
                {output}
              </CodeHighlighter>
            ) : (
              <div className="dark:bg-input/30 text-muted-foreground border-border flex max-h-[300px] min-h-[300px] items-center justify-center rounded-md border bg-transparent text-sm">
                Formatted SQL will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StatsDisplay stats={stats} className="my-6" />
      <FeatureGrid features={features} />
    </ToolLayout>
  )
}

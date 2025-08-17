import Link from "next/link"
import { TOOL_CATEGORIES, TOOLS } from "@/utils"

export default function ToolsDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 flex aspect-video items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="mb-2 text-2xl">🛠️</div>
            <p className="text-muted-foreground text-sm">Total Tools</p>
            <p className="text-xl font-bold">{TOOLS.length}</p>
          </div>
        </div>
        <div className="bg-muted/50 flex aspect-video items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="mb-2 text-2xl">📊</div>
            <p className="text-muted-foreground text-sm">Categories</p>
            <p className="text-xl font-bold">{TOOL_CATEGORIES.length}</p>
          </div>
        </div>
        <div className="bg-muted/50 flex aspect-video items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="mb-2 text-2xl">⭐</div>
            <p className="text-muted-foreground text-sm">Featured</p>
            <p className="text-xl font-bold">
              {TOOLS.filter((t) => t.featured).length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[400px] flex-1 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">All Tools</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="bg-background hover:bg-accent rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{tool.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{tool.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

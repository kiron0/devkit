import {
  FileText,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  History,
  Settings,
} from "lucide-react"

export interface CommandBuilder {
  operation: string
  target: string
  flags: string[]
  options: Record<string, string>
}

export const GIT_OPERATIONS = [
  { value: "init", label: "Initialize Repository", icon: GitBranch },
  { value: "clone", label: "Clone Repository", icon: GitBranch },
  { value: "add", label: "Add Files", icon: FileText },
  { value: "commit", label: "Commit Changes", icon: GitCommit },
  { value: "push", label: "Push Changes", icon: GitPullRequest },
  { value: "pull", label: "Pull Changes", icon: GitPullRequest },
  { value: "branch", label: "Branch Operations", icon: GitBranch },
  { value: "merge", label: "Merge Branches", icon: GitMerge },
  { value: "rebase", label: "Rebase", icon: GitMerge },
  { value: "log", label: "View History", icon: History },
  { value: "status", label: "Check Status", icon: Settings },
  { value: "reset", label: "Reset Changes", icon: Settings },
  { value: "stash", label: "Stash Changes", icon: FileText },
  { value: "tag", label: "Tag Operations", icon: GitBranch },
  { value: "remote", label: "Remote Operations", icon: GitBranch },
]

export const COMMON_WORKFLOWS = [
  {
    name: "Initial Setup",
    description: "Set up a new Git repository and make your first commit",
    steps: [
      "git init",
      "git add .",
      'git commit -m "Initial commit"',
      "git remote add origin <repository-url>",
      "git push -u origin main",
    ],
  },
  {
    name: "Feature Branch Workflow",
    description: "Create a feature branch, make changes, and merge back",
    steps: [
      "git checkout -b feature/new-feature",
      "git add .",
      'git commit -m "Add new feature"',
      "git push origin feature/new-feature",
      "git checkout main",
      "git merge feature/new-feature",
      "git push origin main",
      "git branch -d feature/new-feature",
    ],
  },
  {
    name: "Hotfix Workflow",
    description: "Quickly fix a critical bug in production",
    steps: [
      "git checkout -b hotfix/critical-bug",
      "git add .",
      'git commit -m "Fix critical bug"',
      "git checkout main",
      "git merge hotfix/critical-bug",
      "git tag v1.0.1",
      "git push origin main --tags",
      "git checkout develop",
      "git merge hotfix/critical-bug",
      "git branch -d hotfix/critical-bug",
    ],
  },
  {
    name: "Undo Last Commit",
    description: "Undo the last commit while keeping changes",
    steps: [
      "git reset --soft HEAD~1",
      "# Make your changes",
      "git add .",
      'git commit -m "New commit message"',
    ],
  },
  {
    name: "Clean Working Directory",
    description: "Remove untracked files and clean up",
    steps: ["git status", "git clean -fd", "git reset --hard HEAD"],
  },
]

export const GIT_FLAGS = {
  add: [
    { flag: "-A", description: "Add all changes (staged and unstaged)" },
    { flag: ".", description: "Add all changes in current directory" },
    { flag: "--patch", description: "Interactively choose hunks to stage" },
    { flag: "--force", description: "Force add ignored files" },
  ],
  commit: [
    { flag: "-m", description: "Commit message" },
    { flag: "-a", description: "Stage and commit all tracked files" },
    { flag: "--amend", description: "Amend previous commit" },
    { flag: "--no-verify", description: "Skip pre-commit hooks" },
  ],
  push: [
    { flag: "-u", description: "Set upstream branch" },
    { flag: "--force", description: "Force push (use with caution)" },
    { flag: "--tags", description: "Push all tags" },
    { flag: "--all", description: "Push all branches" },
  ],
  pull: [
    { flag: "--rebase", description: "Pull with rebase instead of merge" },
    { flag: "--ff-only", description: "Only allow fast-forward merges" },
    { flag: "--squash", description: "Squash commits into one" },
  ],
  branch: [
    { flag: "-d", description: "Delete branch (safe)" },
    { flag: "-D", description: "Force delete branch" },
    { flag: "-r", description: "List remote branches" },
    { flag: "-a", description: "List all branches" },
  ],
  log: [
    { flag: "--oneline", description: "Compact format" },
    { flag: "--graph", description: "Show branch graph" },
    { flag: "--decorate", description: "Show refs" },
    { flag: "-n", description: "Limit number of commits" },
  ],
}

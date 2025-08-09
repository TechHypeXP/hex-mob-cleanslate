#!/usr/bin/env bun
/**
 * commit-plan.ts — Plan/apply logical commits from working tree changes.
 *
 * Modes:
 *   --audit  : build plan only, write .git-commit-plan.json, NO staging/commits
 *   --apply  : read/generated plan, create commits in order, stop before push
 *
 * Grouping:
 *   - Timestamp window buckets (default 45 min; analyzer/fallback aware)
 *   - Within each window, groups are formed chronologically; dominant category inferred
 *
 * Env flags:
 *   COMMIT_PLAN_WINDOW_MINUTES=NN    // overrides any analyzer choice
 *   COMMIT_PLAN_AUTO=1               // try analyzer (.git-commit-window.json), else fallback policy
 *   COMMIT_PLAN_PREFIX='[SPRINT-2532]-FOUNDATION-ENV- '  // prepended to commit subjects
 *
 * Fallback window policy if AUTO and analyzer unavailable:
 *   - Current troubleshooting: 120
 *   - Later steady work: 45
 *
 * Notes:
 *   - Non-destructive: never pushes
 *   - Works only on unstaged/uncommitted working tree changes
 *   - WSL/Linux FS guard: refuses to run under /mnt
 */

import { execSync } from "child_process";
import { statSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

// ----------------------- utilities -----------------------

function sh(cmd: string) {
  return execSync(cmd, { stdio: ["pipe", "pipe", "pipe"] }).toString();
}

function preflight() {
  const ROOT = process.cwd();
  if (ROOT.startsWith("/mnt/")) {
    console.error("❌ Refusing to run under /mnt. Use Linux FS (e.g., $HOME/projects/…).");
    process.exit(1);
  }
  try {
    sh("git rev-parse --is-inside-work-tree");
  } catch {
    console.error("❌ Not a git repository.");
    process.exit(1);
  }
  try {
    sh("bun --version");
  } catch {
    console.error("❌ Bun not found on PATH.");
    process.exit(1);
  }
}

function listWorkingChanges(): string[] {
  const mod = sh("git ls-files -m").split("\n").filter(Boolean);
  const untracked = sh("git ls-files -o --exclude-standard").split("\n").filter(Boolean);
  const unique = [...new Set([...mod, ...untracked])];
  return unique.filter((p) => existsSync(p));
}

type FileInfo = { path: string; mtimeMs: number; category: string };

function categoryOf(p: string): string {
  const lower = p.toLowerCase();
  if (lower.startsWith(".expo-logs") || lower.includes("/coverage/") || lower.endsWith(".log")) return "logs";
  if (lower.startsWith("tools/") || lower.endsWith(".sh") || lower.includes("/scripts/")) return "scripts";
  if (lower.endsWith(".cjs") || lower.endsWith(".mjs") || lower.endsWith(".js")) {
    if (lower.includes("metro.config") || lower.includes("babel.config") || lower.includes("bunfig") || lower.includes("tsconfig"))
      return "config";
    return "src-js";
  }
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "src-ts";
  if (lower.endsWith(".md") || lower.includes("/docs/") || lower.endsWith("readme.md")) return "docs";
  if (lower.includes("/assets/") || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(lower)) return "assets";
  if (/\.(json|yaml|yml)$/i.test(lower)) return "config";
  return "other";
}

function fileInfos(paths: string[]): FileInfo[] {
  return paths.map((p) => {
    const st = statSync(p);
    return { path: p, mtimeMs: st.mtimeMs, category: categoryOf(p) };
  });
}

function iso(ms: number) {
  return new Date(ms).toISOString();
}

// ----------------------- grouping -----------------------

type CommitGroup = { files: string[]; category: string; start: number; end: number };

function groupFilesByWindow(files: FileInfo[], windowMinutes: number): CommitGroup[] {
  const win = windowMinutes * 60_000;
  const sorted = [...files].sort((a, b) => a.mtimeMs - b.mtimeMs);
  const groups: CommitGroup[] = [];

  let currentFiles: FileInfo[] = [];
  let startTime: number | null = null;
  let endTime: number | null = null;

  const pushGroup = () => {
    if (currentFiles.length === 0 || startTime === null || endTime === null) return;
    // dominant category
    const count = new Map();
    for (const f of currentFiles) {
      count.set(f.category, (count.get(f.category) || 0) + 1);
    }
    let dom: string = "other";
    let max = -1;
    for (const [k, v] of count.entries()) {
      if (v > max) {
        max = v;
        dom = k;
      }
    }
    groups.push({
      files: currentFiles.map((f) => f.path),
      category: dom,
      start: startTime,
      end: endTime,
    });
  };

  for (const f of sorted) {
    if (currentFiles.length === 0) {
      currentFiles = [f];
      startTime = f.mtimeMs;
      endTime = f.mtimeMs;
      continue;
    }
    if (f.mtimeMs - (endTime as number) < win) {
      currentFiles.push(f);
      endTime = f.mtimeMs;
    } else {
      pushGroup();
      currentFiles = [f];
      startTime = f.mtimeMs;
      endTime = f.mtimeMs;
    }
  }
  pushGroup(); // Push the last group
  return groups;
}

function subjectBaseForCategory(category: string): string {
  switch (category) {
    case "scripts": return "feat: development automation and scripts";
    case "config": return "feat: config and alias/ts setup";
    case "docs": return "docs: documentation and architecture updates";
    case "src-ts": return "fix: source fixes and stability";
    case "src-js": return "fix: source fixes and stability";
    case "assets": return "chore: assets and placeholders";
    case "logs": return "chore: logs and operational traces";
    default: return "chore: misc updates";
  }
}

function deriveTopic(category: string, files: string[]): string {
  if (category === "scripts") {
    if (files.some((f) => /\/dev-.*\.sh$/i.test(f))) return "FOUNDATION-ENV";
    return "SCRIPTS";
  }
  if (category === "config") {
    if (files.some((f) => /alias|tsconfig|metro\.config|bunfig/i.test(f))) return "ALIASES-TS";
    return "CONFIG";
  }
  if (category === "docs") return "DOCS-READMES";
  if (category === "src-ts" || category === "src-js") {
    if (files.some((f) => /\/ui\//i.test(f))) return "UX";
    if (files.some((f) => /\/application\//i.test(f))) return "TYPESAFE";
    return "SRC";
  }
  if (category === "assets") return "DOCS-ASSETS";
  if (category === "logs") return "CHORE-LOGS";
  return "MISC";
}

function generateCommitMessages(
  commits: CommitGroup[],
  commitPrefix: string | null
): { files: string[]; message: string }[] {
  const out: { files: string[]; message: string }[] = [];
  let idx = 1;
  for (const commit of commits) {
    const stamp = iso(commit.start).slice(0, 16); // YYYY-MM-DDTHH:MM
    const base = subjectBaseForCategory(commit.category);
    const topic = deriveTopic(commit.category, commit.files);

    let subject = `[${stamp}] ${base}`;
    if (commitPrefix && commitPrefix.trim().length > 0) {
      // Prefix is used verbatim; caller can include [SPRINT-YYWW]-PHASE-TOPIC-XX
      subject = `${commitPrefix}${base}`;
      // If caller’s prefix is generic, we at least append the topic and sequence
      if (!/\b(FOUNDATION|BUNDLEFIX|VALIDATION|TYPESAFE|ALIASES|DOCS|CI)\b/.test(commitPrefix)) {
        subject = `${commitPrefix}${topic}-${String(idx).padStart(2, "0")} ${base}`;
      }
    }

    out.push({ files: commit.files, message: subject });
    idx++;
  }
  return out;
}

// ----------------------- analyzer/fallback resolution -----------------------

function readAnalyzerWindow(): number | null {
  try {
    const txt = readFileSync(".git-commit-window.json", "utf8");
    const obj = JSON.parse(txt);
    if (typeof obj?.recommended === "number" && obj.recommended > 0) return obj.recommended;
  } catch {}
  return null;
}

function resolveWindowMinutes(): number {
  const envOverride = Number(process.env.COMMIT_PLAN_WINDOW_MINUTES || 0);
  if (envOverride > 0) return envOverride;

  const auto = process.env.COMMIT_PLAN_AUTO === "1";
  if (auto) {
    const recommended = readAnalyzerWindow();
    if (recommended && recommended > 0) return recommended;
    // Fallback policy
    // If you want to toggle “current troubleshooting vs later steady” via env, add COMMIT_PLAN_MODE=current|steady
    const mode = process.env.COMMIT_PLAN_MODE || "current";
    return mode === "steady" ? 45 : 120;
  }

  // Default when not AUTO and no override
  return 45;
}

// ----------------------- plan/apply -----------------------

function planAndWrite(commits: CommitGroup[]) {
  const plan = commits.map((c) => ({
    start: c.start,
    end: c.end,
    files: c.files,
    category: c.category,
    subject: subjectBaseForCategory(c.category),
  }));
  writeFileSync(".git-commit-plan.json", JSON.stringify(plan, null, 2), "utf8");
  console.log("Plan written: .git-commit-plan.json");
  console.log("Summary:");
  plan.forEach((p, i) =>
    console.log(
      `#${i + 1} [${new Date(p.start).toISOString().slice(0, 16)}] ${p.category} | files: ${p.files.length}`
    )
  );
}

function applyFromPlan(prefix: string | null) {
  const txt = readFileSync(".git-commit-plan.json", "utf8");
  const plan: { start: number; end: number; files: string[]; category: string }[] = JSON.parse(txt);
  const groups: CommitGroup[] = plan.map((p) => ({
    start: p.start,
    end: p.end,
    files: p.files,
    category: p.category,
  }));
  const msgs = generateCommitMessages(groups, prefix);
  msgs.forEach((m) => {
    const args = m.files.map((f) => `"${f.replace(/"/g, '\\"')}"`).join(" ");
    if (!args) return;
    sh(`git add ${args}`);
    sh(`git commit -m ${JSON.stringify(m.message + "\n")}`);
    console.log(`Committed: ${m.message}`);
  });
  console.log("\nPost-commit summary (last 10):");
  console.log(sh("git log --stat -n 10 --decorate"));
}

// ----------------------- main -----------------------

function main() {
  preflight();

  // Upstream info (informational)
  try {
    const delta = sh("git rev-list --left-right --count @{u}...HEAD").trim();
    if (delta) console.log(`Upstream delta (ahead behind): ${delta}`);
  } catch {
    console.log("No upstream info (ok).");
  }

  const AUDIT = process.argv.includes("--audit");
  const APPLY = process.argv.includes("--apply");
  if (!AUDIT && !APPLY) {
    console.log("Usage: bun tools/scripts/commit-plan.ts --audit|--apply");
    process.exit(0);
  }

  const changes = listWorkingChanges();
  if (changes.length === 0) {
    console.log("No working-tree changes to plan.");
    return;
  }

  const windowMinutes = resolveWindowMinutes();
  const prefix = process.env.COMMIT_PLAN_PREFIX || null;

  if (AUDIT) {
    const infos = fileInfos(changes);
    const groups = groupFilesByWindow(infos, windowMinutes);
    planAndWrite(groups);
    console.log("Audit mode only. No commits created.");
    return;
  }

  if (APPLY) {
    // Use existing plan if present; otherwise build one now with resolved window
    let planExists = false;
    try {
      readFileSync(".git-commit-plan.json", "utf8");
      planExists = true;
    } catch {}
    if (!planExists) {
      const infos = fileInfos(changes);
      const groups = groupFilesByWindow(infos, windowMinutes);
      planAndWrite(groups);
    }
    applyFromPlan(prefix);
    return;
  }
}

main();
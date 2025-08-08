#!/usr/bin/env bun
/**
 * validate-readmes.cjs — Validates enhanced 10× README structure across folders
 * Checks: YAML metadata, sections, diagrams, keys (template_version, ci_snapshot_hash, structure_delta)
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const folders = [
  ".", "apps", "apps/mobile", "apps/mobile/src",
  "packages", "packages/shared", "packages/shared/src",
  "tools", "docs"
];

const md = (s) => s.replace(/\r\n/g, "\n");

const checklist = [
  { label: "YAML front-matter", pattern: /^---\n[\s\S]*?\n---/m },
  { label: "title in YAML or H1", pattern: /(^---\n[\s\S]*?title:)|(^#\s+)/m },
  { label: "last_modified: AUTO", pattern: /last_modified:\s*AUTO/ },
  { label: "template_version", pattern: /template_version:\s*[^\s]+/ },
  { label: "ci_snapshot_hash", pattern: /ci_snapshot_hash:\s*AUTO/ },
  { label: "structure_delta", pattern: /structure_delta:\s*AUTO/ },

  { label: "Boundaries Matrix", pattern: /Boundaries Matrix/i },
  { label: "Public API", pattern: /##\s*Public API/i },
  { label: "Allowed Imports", pattern: /Allowed Imports/i },
  { label: "Alias Map", pattern: /Alias Map/i },
  { label: "CI Checks", pattern: /CI Checks/i },
  { label: "Test Strategy", pattern: /Test Strategy/i },
  { label: "Security Considerations", pattern: /Security Considerations/i },
  { label: "Policy-Based Design", pattern: /Policy-Based Design/i },
  { label: "Directory Layout", pattern: /Directory Layout/i },
  { label: "Dependency Diagram", pattern: /flowchart|graph\s+TD|graph\s+LR/i },
  { label: "Enforcement & Usage Flow", pattern: /Enforcement\s*&\s*Usage\s*Flow/i },
  { label: "Quality Gates", pattern: /Quality Gates/i },
  { label: "Usage Examples", pattern: /Usage Examples/i },
  { label: "Observability & Auditability", pattern: /Observability\s*&\s*Auditability/i },
  { label: "Lint Exception Audit", pattern: /Lint Exception Audit/i },
  { label: "Cognitive Guidance", pattern: /Cognitive Guidance/i },
  { label: "CI Remediation Tips", pattern: /CI Remediation Tips/i },
  { label: "Changelog Notes", pattern: /Changelog Notes/i },

  { label: "At least one Mermaid code fence", pattern: /^```[a-zA-Z]*/m }
];

const results = [];
let totalMissing = 0;

for (const folder of folders) {
  const path = join(folder, "README.md");
  let content = "";
  try {
    content = md(readFileSync(path, "utf8"));
  } catch {
    results.push({ folder, missing: ["README.md missing"] });
    totalMissing++;
    continue;
  }

  const missing = checklist
    .filter((rule) => !rule.pattern.test(content))
    .map((rule) => rule.label);

  results.push({ folder, missing });
  totalMissing += missing.length;
}

let report = "# README Audit Report (10× Compliance)\n\n";
for (const { folder, missing } of results) {
  report += `## ${folder}\n`;
  if (missing.length === 0) {
    report += "✅ All checks passed\n\n";
  } else {
    for (const item of missing) {
      report += `❌ Missing: ${item}\n`;
    }
    report += "\n";
  }
}

writeFileSync("README_AUDIT_REPORT.md", report);
console.log("README audit complete. See README_AUDIT_REPORT.md");

if (totalMissing > 0) {
  process.exit(1);
}
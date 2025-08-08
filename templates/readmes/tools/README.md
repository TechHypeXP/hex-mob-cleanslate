---
owner: platform
status: active
tags: [scripts, governance]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: tools
scope: tool
---

# Folder Overview
Operational scripts and policy tooling.

## Boundaries Matrix
| Owns              | Depends On | Forbidden Access |
|-------------------|------------|------------------|
| Dev tooling, CI   | Repo files | App runtime code |

## Public API
- Executable scripts for CI and local hooks.

## Allowed Imports
- Node/Bun standard libs.

## Alias Map
- Not applicable.

## CI Checks
- Structure/README validators run here.

## Test Strategy (TDD)
- Script smoke tests; dry-run flags.

## Security Considerations
- No secrets; safe file permissions.

## Policy-Based Design
- Fail-fast; readable logs; no destructive ops.

## Directory Layout
```
tools/
└── scripts/
```

## Dependency Diagram
```
flowchart LR
  verify-structure --> CI[.github/workflows]
  validate-readmes --> READMEs
```

## Enforcement & Usage Flow
```
graph TD
  Scripts --> CI
  CI --> Gates
```

## Quality Gates
- Non-zero exit on failure.

## Usage Examples
- See repo-readme-rollout.sh

## Observability & Auditability
- Log to stdout; store audit report in repo root.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Keep scripts idempotent.

## CI Remediation Tips
- Fix script paths; ensure Bun present.

## Changelog Notes
- Additions/changes of scripts recorded here.
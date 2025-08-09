---
owner: platform
status: active
tags: [mobile, shared, security, tdd, governance, ci]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: hex-mob-cleanslate
scope: repo
---

# Folder Overview
This is the repository root for the 9‑tier enterprise architecture (mobile app, shared package, tools, docs).

## Boundaries Matrix
| Owns                      | Depends On | Forbidden Access             |
|---------------------------|------------|------------------------------|
| Repo-level governance, CI | All tiers  | Breaking tier boundaries     |

## Public API
- Shared public surface is packages/shared/src/index.ts.

## Allowed Imports
- App code imports shared via @shared/* only (no deep paths).

## Alias Map
- Source of truth: apps/mobile/tsconfig.json paths.

## CI Checks
| Check                          | Required | Enforced By                          |
|--------------------------------|---------:|--------------------------------------|
| README validator               |      Yes | tools/scripts/validate-readmes.cjs   |
| Structure verifier (optional)  |      Yes | tools/scripts/verify-structure.cjs   |
| Type-check & lint              |      Yes | bun run type-check / bun run lint    |
| Tests                          |      Yes | bun test / Detox (if app)            |

## Test Strategy (TDD)
- Unit/integration/e2e: green gates before merging.

## Security Considerations
- Secrets via env; redact logs; approve API clients only.

## Policy-Based Design (Code by Policy)
- Enforced via aliases, lint rules, validators, CI gates.

## Directory Layout
```
/
├── apps/
├── packages/
├── tools/
├── docs/
└── README.md
```

## Dependency Diagram
```
flowchart TB
  app[apps/mobile] --> shared[packages/shared (public API)]
  tools[(tools)] --> CI[.github/ci]
  CI --> app
  CI --> shared
```

## Enforcement & Usage Flow
```
graph TD
  IDX[Shared index.ts] --> RULES[Import Rules]
  RULES --> ALLOW[@shared/*]
  RULES --> DENY[@shared/**/src/*]
  CI[CI Gates] --> RULES
  CI --> VAL[Validators]
```

## Quality Gates
- No deep shared imports; strict public surface adherence.

## Usage Examples
```
import { Something } from '@shared';
```

## Observability & Auditability
- Central logger; error taxonomy; trace/metrics hooks.

## Lint Exception Audit
```
// eslint-disable-next-line  — justification
```

## Cognitive Guidance
- Keep aliases and public surface stable; update docs when changing structure.

## CI Remediation Tips
- Fix README gaps; align imports; re-run validator.

## Changelog Notes
- Record architecture changes and rationale here.
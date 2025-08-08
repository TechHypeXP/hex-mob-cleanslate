---
owner: app-core
status: active
tags: [apps, mobile]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: apps
scope: repo
---

# Folder Overview
Houses applications. Currently includes the mobile app.

## Boundaries Matrix
| Owns             | Depends On     | Forbidden Access   |
|------------------|----------------|--------------------|
| App integration  | packages/shared| Deep shared internals |

## Public API
- Consumes @shared/* (public surface only).

## Allowed Imports
- @shared/*, @components/* (app-scoped aliases).

## Alias Map
- apps/mobile/tsconfig.json defines alias paths.

## CI Checks
- Typecheck, lint, validator run in PRs.

## Test Strategy (TDD)
- Screens/components tested via RNTL; Detox for flows.

## Security Considerations
- No direct secrets; follow secure storage policies.

## Policy-Based Design
- No deep imports; navigation isolated from business logic.

## Directory Layout
```
apps/
└── mobile/
```

## Dependency Diagram
```
flowchart LR
  mobile[apps/mobile] --> shared[packages/shared (public)]
```

## Enforcement & Usage Flow
```
graph TD
  Mobile --> Rules
  Rules --> Allowed[@shared/*]
  Rules --> Denied[@shared/**/src/*]
  CI --> Rules
```

## Quality Gates
- UI layers must not bypass shared public API.

## Usage Examples
- See apps/mobile/README.md

## Observability & Auditability
- App logs via central logger.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Keep screens decoupled; prefer selectors/hooks.

## CI Remediation Tips
- Replace deep imports; fix alias paths.

## Changelog Notes
- App-level structure changes recorded here.
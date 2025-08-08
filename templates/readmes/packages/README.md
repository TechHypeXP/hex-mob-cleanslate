---
owner: platform
status: active
tags: [packages, shared]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: packages
scope: repo
---

# Folder Overview
Shared libraries for multi-app reuse.

## Boundaries Matrix
| Owns       | Depends On | Forbidden Access |
|------------|------------|------------------|
| Shared libs| None       | App internals    |

## Public API
- packages/shared/src/index.ts

## Allowed Imports
- Consumers import via @shared/* only.

## Alias Map
- apps/mobile/tsconfig.json maps @shared/*.

## CI Checks
- Validator, typecheck, import hygiene.

## Test Strategy (TDD)
- Unit tests on public exports.

## Security Considerations
- Pure and side-effect-light utilities.

## Policy-Based Design
- No app-specific logic here.

## Directory Layout
```
packages/
└── shared/
```

## Dependency Diagram
```
flowchart LR
  shared[packages/shared] --> index[index.ts]
  apps[apps/mobile] --> index
```

## Enforcement & Usage Flow
```
graph TD
  Index --> Rules
  Rules --> Allowed[@shared/*]
  Rules --> Denied[@shared/**/src/*]
  CI --> Rules
```

## Quality Gates
- Stable contracts, versionable surface.

## Usage Examples
```
import { T } from '@shared';
```

## Observability & Auditability
- Changelog per module.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Keep API narrow; evolve via index.ts.

## CI Remediation Tips
- Export via index.ts; fix deep imports.

## Changelog Notes
- Record public API changes.
---
owner: platform
status: active
tags: [public-api]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: packages/shared/src
scope: package
---

# Folder Overview
Internal implementation re-exported by src/index.ts.

## Boundaries Matrix
| Owns        | Depends On | Forbidden Access |
|-------------|------------|------------------|
| Internals   | Submodules | External deep imports |

## Public API
- index.ts only.

## Allowed Imports
- Free internally; external consumers only via @shared/*.

## Alias Map
- Re-export through index.ts.

## CI Checks
- Validator, import hygiene.

## Test Strategy (TDD)
- Type tests and unit tests per module.

## Security Considerations
- No risky dynamic constructs.

## Policy-Based Design
- Keep submodules decoupled; avoid cycles.

## Directory Layout
```
packages/shared/src/
```

## Dependency Diagram
```
flowchart LR
  types --re-export--> index[index.ts]
  utils --re-export--> index
  constants --re-export--> index
  i18n --re-export--> index
  api --re-export--> index
```

## Enforcement & Usage Flow
```
graph TD
  Submodules --> Index
  Index --> Consumers[@shared/*]
  CI --> Index
```

## Quality Gates
- Zero circular dependencies.

## Usage Examples
- N/A (internal).

## Observability & Auditability
- Changelog at package level.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Update index.ts when adding modules.

## CI Remediation Tips
- Ensure exports flow via index.ts.

## Changelog Notes
- Internal reorganizations recorded upstream.
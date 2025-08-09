---
owner: app-core
status: active
tags: [ui-layer]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: apps/mobile/src
scope: app
---

# Folder Overview
App presentation and local orchestration.

## Boundaries Matrix
| Owns         | Depends On    | Forbidden Access |
|--------------|---------------|------------------|
| UI, hooks    | @shared public| Deep shared internals |

## Public API
- Internal to app.

## Allowed Imports
- @shared/*, relative within src.

## Alias Map
- baseUrl=./src; paths set in tsconfig.

## CI Checks
- Validator, typecheck, lint.

## Test Strategy (TDD)
- Component tests, hooks tests.

## Security Considerations
- Permission gating; sanitize inputs.

## Policy-Based Design
- Keep logic in slices/services; UI thin.

## Directory Layout
```
apps/mobile/src/
```

## Dependency Diagram
```
flowchart LR
  Screens --> Components
  Screens --> Hooks
  Navigation --> Screens
  UI --> Components
  Components --> "@shared (public)"
```

## Enforcement & Usage Flow
```
graph TD
  Components --> Rules
  Rules --> Allowed[@shared/*]
  Rules --> Denied[@shared/**/src/*]
  CI --> Rules
```

## Quality Gates
- No deep imports; consistent hooks.

## Usage Examples
- See HomeScreen, ImageManagementScreen.

## Observability & Auditability
- Centralized error logging.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Favor selectors; avoid prop drilling.

## CI Remediation Tips
- Replace deep paths; update aliases.

## Changelog Notes
- Note structural UI changes.
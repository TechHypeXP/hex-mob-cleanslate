---
owner: app-core
status: active
tags: [react-native, mobile]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: apps/mobile
scope: app
---

# Folder Overview
React Native app: navigation, screens, presentation, orchestration.

## Boundaries Matrix
| Owns          | Depends On      | Forbidden Access      |
|---------------|-----------------|-----------------------|
| UI, navigation| @shared public  | @shared/**/src/*      |

## Public API
- Internal to app; no cross-repo exposure.

## Allowed Imports
- @shared/*, @components/*, @hooks/*

## Alias Map
- Defined in apps/mobile/tsconfig.json.

## CI Checks
- Validator, typecheck, lint, tests.

## Test Strategy (TDD)
- Unit: components/hooks; Integration: flows; E2E: Detox.

## Security Considerations
- No secrets; follow safe permissions; sanitize inputs.

## Policy-Based Design
- No prop drilling; use selectors and slices.

## Directory Layout
```
apps/mobile/
└── src/
    ├── screens/
    ├── components/
    ├── hooks/
    ├── navigation/
    └── ui/
```

## Dependency Diagram
```
flowchart TB
  screens --> components
  screens --> hooks
  navigation --> screens
  ui --> components
  mobile --> shared
```

## Enforcement & Usage Flow
```
graph TD
  UI --> Rules
  Rules --> Allowed[@shared/*]
  Rules --> Denied[@shared/**/src/*]
  CI --> Rules
```

## Quality Gates
- Maintain 60FPS gestures; strict import hygiene.

## Usage Examples
- See SwipeCard → Redux actions, haptics hooks.

## Observability & Auditability
- Central logger; no console.error in app layers.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Restart CLI after tsconfig path changes.

## CI Remediation Tips
- Fix alias mismatches; re-run validator.

## Changelog Notes
- Note navigation or layer boundary changes.
---
owner: platform
status: active
tags: [shared, api, i18n]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: packages/shared
scope: package
---

# Folder Overview
Reusable, app-agnostic modules: types, utils, constants, i18n, api.

## Boundaries Matrix
| Owns         | Depends On | Forbidden Access |
|--------------|------------|------------------|
| Shared modules| None      | App UI internals |

## Public API
- src/index.ts re-exports the public surface.

## Allowed Imports
- Internals import freely; consumers use @shared/* only.

## Alias Map
- Consumers: "@shared/*" -> "packages/shared/src/*"

## CI Checks
- Validator, import hygiene.

## Test Strategy (TDD)
- Unit tests for exports; integration for contracts.

## Security Considerations
- No unsafe reflection; sanitize inputs at edges.

## Policy-Based Design
- Controlled exports via index.ts.

## Directory Layout
```
packages/shared/
└── src/
    ├── types/
    ├── utils/
    ├── constants/
    ├── i18n/
    ├── api/
    └── index.ts
```

## Dependency Diagram
```
flowchart TB
  index[index.ts] --> types
  index --> utils
  index --> constants
  index --> i18n
  index --> api
  mobile[apps/mobile] --> index
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
- No deep imports from apps.

## Usage Examples
```
import { PhotoItem } from '@shared';
```

## Observability & Auditability
- Track API changes in changelog.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Keep internals hidden behind index.ts.

## CI Remediation Tips
- Replace @shared/**/src/* usages.

## Changelog Notes
- Public API evolution.
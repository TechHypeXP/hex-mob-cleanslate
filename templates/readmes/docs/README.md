---
owner: platform
status: active
tags: [documentation, governance]
last_modified: AUTO
template_version: 10x-v1.2
ci_snapshot_hash: AUTO
structure_delta: AUTO
title: docs
scope: docs
---

# Folder Overview
Audits, templates, and architecture diagrams.

## Boundaries Matrix
| Owns     | Depends On | Forbidden Access |
|----------|------------|------------------|
| Docs     | None       | Code execution   |

## Public API
- Reference material only.

## Allowed Imports
- N/A.

## Alias Map
- N/A.

## CI Checks
- Validator ensures presence and quality.

## Test Strategy (TDD)
- Not applicable.

## Security Considerations
- No secrets; plain text only.

## Policy-Based Design
- Docs reflect current repo state and PRD.

## Directory Layout
```
docs/
├── audits/
├── templates/
└── diagrams/
```

## Dependency Diagram
```
flowchart LR
  audits --> CI
  templates --> READMEs
```

## Enforcement & Usage Flow
```
graph TD
  Templates --> Readmes
  Audits --> CI
```

## Quality Gates
- Keep last_modified AUTO; update via scripts if needed.

## Usage Examples
- N/A.

## Observability & Auditability
- Track docs changes via PRs.

## Lint Exception Audit
- None expected.

## Cognitive Guidance
- Update diagrams when structure changes.

## CI Remediation Tips
- Fix missing sections; re-run validator.

## Changelog Notes
- Major documentation updates listed here.
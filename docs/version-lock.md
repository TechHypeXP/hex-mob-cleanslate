# Version Lock (Frozen) — Expo 53
- Expo SDK: 53.x
- Node: LTS (CI pinned)
- Package manager: pnpm 10.14.0 (temporary)
- TypeScript: ~5.8.3
- ESLint: ^9.33.0
- @typescript-eslint/*: ^8.38.0
- @eslint/js: ^9.33.0
- eslint-plugin-import: latest compatible with ESLint 9

Policy:
- No upgrades outside this doc.
- Pre-commit enforces TS ~5.8.3 and Expo 53.
- CI runs pnpm install, eslint, tsc --noEmit.
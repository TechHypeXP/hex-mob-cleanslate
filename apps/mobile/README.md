# CleanSlate Mobile App (React Native Expo)

## Architecture Overview
Monorepo structure with domain-driven design principles:
```
/apps/mobile
├── /src
│   ├── /ui - Presentation components (SwipeCard, TabNavigation)
│   ├── /domain - Business logic entities (PhotoModel, GamificationEntity)
│   ├── /application - Services implementing CQRS pattern
│   ├── /infrastructure - Adapters for external services
│   ├── /crosscutting - Utilities and shared tools
│   └── /assets - Static resources
├── /tests - All test suites (unit, integration, e2e)
├── /packages/shared - Reusable libraries
│   ├── /api - Service clients/stubs
│   ├── /types - Shared interfaces
│   └── /i18n - Localization files
└── /docs - Architectural documentation

## Internationalization (i18n)
Initial locales supported:
- English (en)
- Arabic (ar)
- Spanish (es)
- Portuguese (pt)
- French (fr)

## Budget Tracking
Current API usage: 0 calls (no external services integrated yet)
- Monitoring Supabase free tier limit (500MB)
- Alert threshold set at 400MB

## Testing Strategy
1. Unit Tests: Jest
2. Integration: React Native Testing Library
3. E2E: Detox
4. Performance: Expo Profiler
5. Security: OWASP scans
6. UI/UX: Playwright/Puppeteer
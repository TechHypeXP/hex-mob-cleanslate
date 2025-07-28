# CleanSlate Mobile App

## Architecture Overview

CleanSlate is a React Native Expo application built with Domain-Driven Design (DDD) principles, focusing on gamified photo management with Tinder-style swipe interactions.

### Technology Stack
- **Framework**: React Native with Expo SDK
- **Language**: TypeScript
- **State Management**: React Hooks + Context API
- **Animations**: React Native Reanimated 3
- **Gestures**: React Native Gesture Handler
- **Testing**: Jest, React Native Testing Library, Detox
- **Architecture**: Domain-Driven Design (DDD) with CQRS patterns

### Folder Structure
```
/apps/mobile (React Native app)
├── /src
│   ├── /ui (Components: SwipeCard.tsx, TabNavigation.tsx)
│   ├── /domain (DDD Models: PhotoModel.ts, GamificationEntity.ts)
│   ├── /application (Services: SwipeService.ts with CQRS)
│   ├── /infrastructure (Adapters: LocalMLAdapter.ts, CloudSyncStub.ts)
│   ├── /crosscutting (Utils: ErrorLogger.ts, PerformanceMonitor.ts)
│   └── /assets (Icons, animations)
├── /tests (All test types: unit, integration, e2e)
├── /packages/shared (Shared libs: APIs, types, utils)
│   ├── /api (Supabase stubs/clients)
│   ├── /types (Interfaces: PhotoItem)
│   └── /i18n (Global locales: English, Arabic, etc.)
└── /docs (Flowcharts, prompts history)
```

### Core Features
1. **Tinder-style Swipe Gestures**: Native gesture recognition with haptic feedback
2. **Gamification**: Spinning wheel, progress tracking, achievement system
3. **Multi-language Support**: English, Arabic, Spanish, Portuguese, French
4. **Photo Management**: Keep, Delete, Share, Private storage actions
5. **Statistics Dashboard**: Storage analytics, usage metrics, performance insights

### Development Workflow
1. **Documentation First**: Every change requires inline comments and README updates
2. **Testing Suite**: Unit → Integration → E2E → Performance → Security → UI/UX
3. **Incremental Development**: Sequential tasks with auto-commit and QR generation
4. **Budget Tracking**: Monitor API calls and resource usage

### Change Log
- v1.0.0: Initial React Native Expo setup with DDD architecture
- Documentation: Architecture overview, folder structure, development workflow established
- Testing: Jest, RNTL, Detox configured for comprehensive testing coverage
- Internationalization: Multi-language support structure created

### Budget Tracking
- API Calls: 0/1000 (Free tier limit)
- Build Minutes: 0/500 (Monthly limit)
- Storage: 0/1GB (Asset storage)

### Next Steps
1. Implement core SwipeCard component with native gestures
2. Create spinning wheel modal with physics-based animations
3. Build tab navigation with native performance
4. Integrate photo permissions and media library access
5. Implement statistics dashboard with real device metrics
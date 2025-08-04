# CleanSlate Product Requirements Document (PRD) Version 4.0.0

**Version**: 4.0.0  
**Date**: July 31, 2025  
**Author**: Development Team  
**Classification**: Technical Architecture & Implementation Specification  

## Document Control & Versioning

**Version History**:
- v3.1 (July 28, 2025): Initial feature specifications
- **v4.0.0 (July 31, 2025): MAJOR - Complete architecture overhaul, monorepo structure, comprehensive tech stack**

**Version Increment Rationale**: Major version increment (3.1 → 4.0.0) due to:
- Complete architectural redesign (DDD/Hexagonal monorepo)
- Breaking changes to original technical approach
- Comprehensive technology stack definition with specific versions
- Implementation of advanced state management patterns
- Definitive folder structure and development workflow

## 1. Executive Summary & Strategic Vision

CleanSlate is a **React Native mobile application** implementing **Domain-Driven Design (DDD) with Hexagonal Architecture** in a **monorepo structure**. The application provides intelligent photo/media management with **gamification systems**, **offline-first functionality**, and **60 FPS performance** targeting iOS and Android app stores.

**Key Differentiators**:
- **Advanced Architecture**: 9-layer DDD/Hexagonal structure eliminates technical debt
- **State Management Excellence**: Redux Toolkit v2 + React Query v5 eliminates prop drilling
- **Performance-First**: New Architecture support for 60 FPS animations
- **Offline-First**: Complete functionality without network dependency
- **Developer Experience**: Autonomous 3-7 hour development sessions with comprehensive tooling

## 2. Technical Architecture (FINAL - Set in Stone)

### 2.1 Monorepo Structure - DEFINITIVE

```
hex-mob-cleanslate/                    # Root monorepo
├── packages/                          # MONOREPO PACKAGES
│   ├── shared/                        # Shared across apps
│   │   ├── api/                       # API clients (apisauce v2, Supabase stubs)
│   │   ├── types/                     # TypeScript definitions
│   │   ├── i18n/                      # Localization (RTL Arabic, English, Spanish)
│   │   ├── utils/                     # Common utilities (date-fns v3, validation)
│   │   └── constants/                 # App-wide constants
│   └── mobile/                        # Mobile app package
│
├── apps/                              # APPLICATION LAYER
│   └── mobile/                        # React Native Expo app
│       ├── src/                       # SOURCE CODE (DDD/HEXAGONAL)
│       │   ├── domain/                # CORE - Pure business logic
│       │   │   ├── entities/          # Domain entities
│       │   │   ├── valueObjects/      # Value objects
│       │   │   ├── services/          # Domain services
│       │   │   └── repositories/      # Repository contracts
│       │   │
│       │   ├── application/           # APPLICATION LAYER - Use cases
│       │   │   ├── useCases/          # CQRS commands/queries
│       │   │   ├── services/          # Application services
│       │   │   └── ports/             # Hexagonal ports
│       │   │
│       │   ├── infrastructure/        # ADAPTERS - External systems
│       │   │   ├── repositories/      # Repository implementations
│       │   │   ├── services/          # External service adapters
│       │   │   ├── storage/           # MMKV v2, AsyncStorage adapters
│       │   │   └── network/           # API implementations
│       │   │
│       │   ├── ui/                    # PRESENTATION ADAPTERS
│       │   │   ├── screens/           # Screen components
│       │   │   │   ├── TabNavigation.tsx
│       │   │   │   ├── PermissionScreen.tsx
│       │   │   │   ├── StatsScreen.tsx
│       │   │   │   └── SettingsScreen.tsx
│       │   │   ├── components/        # Reusable UI components
│       │   │   │   ├── SpinWheel.tsx
│       │   │   │   └── SwipeCard.tsx
│       │   │   ├── navigation/        # React Navigation v6 setup
│       │   │   └── hooks/             # UI-specific hooks
│       │   │
│       │   ├── crosscutting/          # CROSS-CUTTING CONCERNS
│       │   │   ├── logging/           # Sentry v8, ErrorLogger.ts
│       │   │   ├── validation/        # Input validation
│       │   │   ├── security/          # Biometric auth, encryption
│       │   │   └── monitoring/        # Reactotron v3, performance
│       │   │
│       │   └── assets/                # STATIC RESOURCES
│       │       ├── images/            # App icons, badges
│       │       ├── fonts/             # Custom fonts
│       │       └── animations/        # Lottie files
│       │
│       ├── __tests__/                 # TESTING
│       │   ├── unit/                  # Jest v29 unit tests
│       │   ├── integration/           # React Native Testing Library
│       │   └── e2e/                   # Detox v20 end-to-end
│       │
│       ├── app.json                   # Expo configuration
│       ├── eas.json                   # EAS Build configuration
│       ├── package.json               # Mobile app dependencies
│       └── tsconfig.json              # TypeScript config
│
├── tools/                             # MONOREPO TOOLING
├── docs/                              # DOCUMENTATION
├── legacy-v1/                         # LEGACY REFERENCE
├── package.json                       # ROOT monorepo package.json
├── bun.lock                          # Dependency lock file (bun preferred)
└── README.md                         # Project documentation
```

### 2.2 Hexagonal Architecture Principles (IMMUTABLE)

**Dependency Rules**:
```
Domain ← Application ← Infrastructure
   ↑         ↑             ↑
   └── UI ←──┴─── CrossCutting
```

**Core Principle**: Dependencies point inward. Domain layer has zero external dependencies.

## 3. Technology Stack - Complete Specification

### 3.1 Core Framework & Runtime

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **React Native** | v0.79 | Required by SDK v53; New Architecture for 60 FPS | ✅ Configured |
| **React** | v18 | Stable foundation; Redux integration | ✅ Configured |
| **TypeScript** | v5 | Enhanced typing for DDD/CQRS layers | ✅ Configured |
| **Expo SDK** | v53 | Latest; offline-first, ML, RTL support | ✅ Configured |
| **Hermes JS Engine** | Latest | Optimal performance for ML/animations | ✅ Configured |

### 3.2 State Management & Prop Drilling Avoidance

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **Redux Toolkit** | v2 | Centralized state for gamification, CQRS patterns | 🔄 In Progress |
| **React Query** | v5 | Async data, offline queues, Supabase stubs | 🔄 In Progress |
| **MMKV** | v2 | Fast state persistence (replaces AsyncStorage) | 🔄 In Progress |

**Prop Drilling Strategy**:
- **Redux Toolkit**: Global app state accessible via `useSelector`/`useDispatch`
- **React Query**: Async operations with built-in loading/error states
- **Context API**: Simple app-wide state (theme, localization)
- **Component Composition**: UI-specific state via custom hooks

### 3.3 Navigation & UI Framework

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **React Navigation** | v6 | TabNavigation.tsx; Gesture Handler integration | ✅ Configured |
| **React Native Gesture Handler** | v2 | Tinder-style swipes, haptics, wheel spinner | 🔄 In Progress |
| **React Native Reanimated** | v3 | Physics-based animations, 60 FPS performance | 🔄 In Progress |
| **FlashList** | v1 | Performant photo lists with pre-loading | 🆕 New Addition |

### 3.4 Performance & UX Enhancement

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **react-native-haptic-feedback** | v2 | Kinesthetic feedback for achievements | 🆕 New Addition |
| **react-native-device-info** | v10 | Battery warnings, device-specific optimizations | 🆕 New Addition |
| **react-native-keyboard-controller** | v1 | Keyboard management for inputs | 🆕 New Addition |

### 3.5 Networking & APIs

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **apisauce** | v2 | REST client for `/packages/shared/api` | ✅ Configured |
| **Supabase** | Latest | Backend stubs, offline-first sync | ✅ Configured |

### 3.6 Localization & Accessibility

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **Expo Localization** | v16 | RTL Arabic, English, Spanish with I18nManager | ✅ Configured |
| **Expo Font** | v13 | Custom fonts for badges/themes | ✅ Configured |
| **Expo Status Bar** | v2 | Dark mode/RTL bug patches | ✅ Configured |

### 3.7 Security & Authentication

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **expo-local-authentication** | v13 | Biometric auth for Private Pool | 🔄 In Progress |

### 3.8 Development & Testing Tools

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **bun** | Latest | Package manager (preferred over npm) | ❌ Not Installed |
| **Reactotron** | v3 | Performance metrics, ML tasks, error logging | 🔄 In Progress |
| **Jest** | v29 | Unit testing with React Native Testing Library | ✅ Configured |
| **Detox** | v20 | E2E testing (New Arch, gestures, accessibility) | 🔄 In Progress |
| **Sentry** | v8 | Enterprise observability, ErrorLogger.ts integration | 🔄 In Progress |

### 3.9 Utilities & Support Libraries

| Technology | Version | Purpose & Rationale | Implementation Status |
|------------|---------|--------------------|-----------------------|
| **date-fns** | v3 | Lightweight date handling for stats/retention | ✅ Configured |

## 4. Feature Specifications - Enhanced

### 4.1 Core Media Management Features

| Feature | Description | Phase | Technical Implementation | State Management | Performance Target |
|---------|-------------|-------|-------------------------|------------------|--------------------|
| **Photo Handling** | Swipe-based culling with gesture recognition | MVP | React Native Gesture Handler v2 + Reanimated v3 | Redux Toolkit state + MMKV persistence | 60 FPS animations |
| **Screenshot Detection** | ML-powered screenshot categorization | MVP | TensorFlow Lite (on-device processing) | React Query for ML results caching | 5 min average sessions |
| **Achievement System** | Progressive badge unlocking | MVP | Reanimated v3 animations + MMKV persistence | Local achievement state | >30% retention boost |
| **Physics Spinner** | Wheel of Fortune for sorting decisions | MVP | React Native Reanimated v3 physics engine | Component-level state | Enhanced user delight |
| **Progress Visualization** | Storage freed meter with animations | MVP | Custom progress components + Reanimated | Redux state with real-time updates | Visual progress feedback |

### 4.3 Advanced Performance Features

| Feature | Description | Phase | Technical Implementation | Performance Benefit | Accessibility |
|---------|-------------|-------|-------------------------|--------------------|--------------| 
| **Adaptive Pre-loading** | Intelligent photo/video pre-loading | MVP | FlashList + custom loading algorithms | 50k+ media library support | VoiceOver progress announcements |
| **Battery Optimization** | Low battery mode with task throttling | MVP | react-native-device-info v10 monitoring |  state.gamification.streakCount);
const dispatch = useDispatch();

// CQRS pattern implementation
dispatch(incrementStreak()); // Command
const achievements = useSelector(selectAchievements); // Query
```

**Responsibilities**:
- Gamification state (streaks, achievements, badges)
- User preferences and settings
- App-wide configuration
- Offline queue status

#### 5.1.2 React Query v5 (Async State Management)
```typescript
// Global async data with automatic loading states
const { data, isLoading, error } = useQuery('photos', fetchPhotos);
const shareMutation = useMutation(sharePhoto, {
  onError: (error) => addToOfflineQueue(error.data)
});
```

**Responsibilities**:
- Supabase data synchronization
- Offline queue management
- API call retry logic
- Background data fetching

#### 5.1.3 Context API (Simple Global State)
```typescript
// App-wide simple state via providers
const { theme, language, rtlEnabled } = useAppContext();
```

**Responsibilities**:
- Theme configuration (dark/light)
- Localization settings (RTL/LTR)
- Device-specific settings

#### 5.1.4 Component Composition (UI-Specific State)
```typescript
// UI-specific state via custom hooks
const { swipeGesture, animationState } = useSwipeCard();
const { spinnerRotation, isSpinning } = useWheelSpinner();
```

**Responsibilities**:
- Gesture states in SwipeCard.tsx
- Animation states in SpinWheel.tsx
- Form inputs and validation

### 5.2 Performance Optimization Patterns

**Selective Re-rendering**: Optimized selectors prevent unnecessary component updates
**Memoization**: React.memo and useMemo for expensive computations
**Lazy Loading**: Dynamic imports for non-critical components
**Background Processing**: Web Workers for ML computations

## 6. Current Deployment Configuration

### 6.1 Expo/EAS Configuration

```yaml
Deployment Details:
  Expo Token: GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV
  Project ID: 96e0d105-47e9-409d-88a9-8431da22e283  
  Updates URL: https://u.expo.dev/96e0d105-47e9-409d-88a9-8431da22e283
  Runtime Version: 1.0.0
  Account: kellybakri
  Project Slug: hex-mob-cleanslate
  Environment: WSL (Ubuntu) ~/projects/hex-mob-cleanslate
```

### 6.2 Build Status & Deployment Pipeline

**Android Build**: ✅ **PRODUCTION READY**
- Version Code: 3
- Build Credentials: Configured (42A2v0P39m)
- Keystore: Remote (Expo managed)
- Bundle Size: 1.99 MB + 5.96 MB source map

**iOS Build**: ❌ **BLOCKED** (Apple Developer Account Required)
- Estimated Cost: $99/year Apple Developer Program
- Alternative: Android-first deployment strategy

**JavaScript Bundles**: ✅ **SUCCESSFULLY UPLOADED**
- Update ID: d02fc630-a330-44f0-a72a-34094b59138d
- Assets: 20 iOS, 20 Android (vector icons, fonts)
- Update System: EAS Updates + Legacy publish fallback

### 6.3 QR Code Resolution Strategy

**Current Blocker**: EAS Update fingerprint incompatible with Expo Go runtime
**Resolution Command**:
```bash
# WSL Terminal Location: ~/projects/hex-mob-cleanslate
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV expo publish --release-channel default
```

**Expected Outcome**: Legacy publish system bypasses fingerprint mismatch for immediate testing

## 7. Development Workflow & User Preferences

### 7.1 Development Environment Requirements

**Platform**: WSL (Ubuntu) on Windows
**Package Manager**: bun (preferred, not installed) → npm (fallback)
**Terminal**: Always specify WSL/cmd/PowerShell for commands
**Session Target**: 3-7 hours autonomous development without intervention

### 7.2 Command Execution Standards

**Format**: "1-2 commands at a time" with exact copy-paste syntax
**Clarity**: Actionable commands, not theoretical explanations  
**Error Handling**: Provide extraction commands, not manual log checking
**Decisiveness**: "No 30-hour troubleshooting loops" - change approach when stuck

### 7.3 Solution Requirements

**Permanence**: "Make it permanent" - no temporary fixes
**Automation**: "One-click arrangements" - everything scripted
**Resource Awareness**: Optimized for 16GB laptop hardware
**Integration**: GitHub commits, testing, documentation generation

### 7.4 Anti-Patterns & Frustrations

**Communication Red Flags**:
- ❌ Manual log checking requests
- ❌ Repeated password prompts
- ❌ Manual intervention during autonomous runs
- ❌ Temporary fixes requiring redoing
- ❌ Long explanations without actionable steps

**Technical Anti-Patterns**:
- ❌ Prop drilling through architectural layers
- ❌ Layer coupling violating hexagonal principles
- ❌ Manual state passing instead of global management
- ❌ Performance degradation without monitoring

## 8. Performance & Quality Targets

### 8.1 Performance Benchmarks

| Metric | Target | Current Status | Implementation |
|--------|--------|----------------|----------------|
| **Animation Performance** | 60 FPS consistent | 🔄 In Progress | React Native v0.79 + Hermes |
| **App Launch Time** | 90% domain/application layers | 🔄 Setup |
| **Integration Tests** | React Native Testing Library | >80% UI components | 🔄 Setup |
| **E2E Tests** | Detox v20 | Critical user flows | 🔄 Setup |
| **Performance Tests** | Reactotron v3 | All animations/gestures | 🔄 Setup |
| **Accessibility Tests** | Built-in accessibility tools | WCAG AA compliance | 🔄 Setup |

### 8.3 Monitoring & Observability

| Component | Tool | Purpose | Status |
|-----------|------|---------|--------|
| **Error Tracking** | Sentry v8 | Production error monitoring | 🔄 Integration |
| **Performance Monitoring** | Reactotron v3 | Development performance debugging | 🔄 Integration |
| **User Analytics** | Custom implementation | Usage patterns, feature adoption | 🆕 Planned |
| **Crash Reporting** | Sentry v8 integration | 99.9% crash-free target | 🔄 Integration |

## 9. Security & Privacy Implementation

### 9.1 Privacy-First Architecture

**On-Device Processing**: All ML computations local (TensorFlow Lite)
**Biometric Security**: expo-local-authentication v13 for Private Pool
**Data Encryption**: Local storage encryption via MMKV
**Network Security**: Optional cloud sync with user consent only

### 9.2 Compliance Framework

**GDPR Compliance**: On-device processing, explicit consent for cloud features
**App Store Guidelines**: Privacy labels, data collection transparency
**Accessibility Standards**: WCAG AA compliance with VoiceOver/TalkBack support
**International Support**: RTL languages, cultural considerations

## 10. Immediate Action Items & Next Steps

### 10.1 Critical Path (Next 30 Minutes)

**Priority 1**: Execute QR code resolution
```bash
# IMMEDIATE EXECUTION REQUIRED
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV expo publish --release-channel default
```

**Priority 2**: Validate app functionality
- Test QR code loading in Expo Go
- Verify basic navigation and UI components
- Confirm 60 FPS performance targets

### 10.2 Development Roadmap (Next 3-4 Hours)

**Phase 1** (Hour 1): State Management Implementation
- Implement Redux Toolkit store structure
- Configure React Query for async operations
- Set up MMKV persistence layer

**Phase 2** (Hour 2): Gamification Features
- Implement swipe gesture recognition
- Add haptic feedback system
- Create achievement badge system

**Phase 3** (Hour 3): Performance Optimization
- Optimize photo loading with FlashList
- Implement battery usage monitoring
- Add performance monitoring hooks

**Phase 4** (Hour 4): Testing & Demo Preparation
- Execute unit tests for core features
- Performance testing with Reactotron
- Demo preparation and documentation

### 10.3 Success Criteria

**Immediate Success** (30 minutes):
- ✅ Working QR code loads without download loop
- ✅ App launches and navigates successfully
- ✅ Basic UI components render correctly

**Development Success** (4 hours):
- ✅ Gamification system functional
- ✅ 60 FPS animations achieved
- ✅ State management eliminating prop drilling
- ✅ Demo-ready application

## 11. Risk Management & Contingency Planning

### 11.1 Technical Risks

**QR Code Deployment**: Legacy publish may not resolve compatibility
- **Mitigation**: Prepare alternative testing approaches (direct APK)

**Performance Targets**: 60 FPS may not be achievable on all devices
- **Mitigation**: Adaptive performance based on device capabilities

**State Management Complexity**: Redux + React Query integration challenges
- **Mitigation**: Incremental implementation with fallback patterns

### 11.2 Timeline Risks

**4-Hour Demo Target**: Aggressive timeline for comprehensive features
- **Mitigation**: Prioritize core functionality over polish
- **Fallback**: Focus on architecture demonstration over feature completeness

### 11.3 Resource Constraints

**Development Environment**: bun not installed, WSL permission issues
- **Mitigation**: Standardized npm commands, pre-configured permission fixes

**Apple Developer Account**: iOS testing blocked without $99 investment  
- **Mitigation**: Android-first approach, iOS development deferred

## 12. Appendix: Emergency Recovery Procedures

### 12.1 Complete Environment Reset

```bash
# Nuclear cache clear option
sudo rm -rf /tmp/metro-cache ~/.cache/eas-cli ~/.expo ~/.npm ~/projects/hex-mob-cleanslate/dist ~/projects/hex-mob-cleanslate/node_modules/.cache
sudo mkdir -p ~/.cache/eas-cli && sudo chown -R $USER:$USER ~/.cache/eas-cli
```

### 12.2 Working Build Commands

```bash
# Android build (confirmed working)
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV eas build --platform android --non-interactive

# Update publication
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV eas update --auto --non-interactive
```

### 12.3 Troubleshooting Loop Breaker

**Pattern Recognition**: If same error occurs 3+ times:
1. **STOP** current approach immediately
2. **ANALYZE** fundamental assumptions
3. **CHANGE** to alternative strategy
4. **DOCUMENT** decision rationale for future sessions

**Document Status**: ✅ **PRODUCTION READY**  
**Next Review**: Post-demo completion  
**Implementation Priority**: IMMEDIATE  
**Success Metric**: Working demo within 4 hours  

*This PRD v4.0.0 represents the definitive technical specification for CleanSlate Mobile App development. All architectural decisions are finalized and implementation-ready. No further architectural changes should be made without major version increment to v5.0.0.*

[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/6118605/42ad09a8-769d-4127-84bd-a3ff2d8354c5/product-requirements-document-v3_1-28-7-2025-2335.docx
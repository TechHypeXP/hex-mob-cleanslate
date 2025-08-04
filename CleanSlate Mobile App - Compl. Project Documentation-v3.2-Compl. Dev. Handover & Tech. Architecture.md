# CleanSlate Mobile App - Complete Project Documentation
**Comprehensive Development Handover & Technical Architecture**

**Project:** CleanSlate Mobile App  
**Architecture:** DDD/Hexagonal Monorepo  
**Platform:** React Native + Expo  
**Target:** iOS/Android App Stores  
**Status:** Phase 3 - QR Code Deployment Resolution  
**Last Updated:** July 30, 2025  

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Monorepo Structure (Final)](#monorepo-structure-final)
4. [Technology Stack & Rationale](#technology-stack--rationale)
5. [Development Timeline & Current Status](#development-timeline--current-status)
6. [State Management & Prop Drilling Avoidance](#state-management--prop-drilling-avoidance)
7. [Feature-Specific Technical Decisions](#feature-specific-technical-decisions)
8. [Current Deployment Configuration](#current-deployment-configuration)
9. [User Preferences & Development Workflow](#user-preferences--development-workflow)
10. [Critical Issues & Solutions](#critical-issues--solutions)
11. [Immediate Next Steps](#immediate-next-steps)
12. [Emergency Recovery Procedures](#emergency-recovery-procedures)
13. [Future Considerations](#future-considerations)
14. [Appendix: Key Commands](#appendix-key-commands)

## Executive Summary

CleanSlate Mobile App is a React Native Expo project implementing **DDD/Hexagonal Architecture** within a **monorepo structure**. The application features advanced state management patterns to avoid prop drilling, gamification systems (swipe streaks, haptics, physics-based animations), and offline-first functionality.

The project has successfully completed legacy-to-DDD migration and EAS configuration phases. Currently in Phase 3, addressing a QR code deployment loop caused by EAS Update/Expo Go fingerprint incompatibility.

**Key Achievements:**
- ✅ 9-layer DDD/Hexagonal architecture implementation
- ✅ Monorepo structure with shared packages
- ✅ Redux Toolkit + React Query state management
- ✅ EAS builds and JavaScript bundle uploads
- ❌ QR code deployment loop (current blocker)

## Architecture & Design Patterns

### Core Architecture: DDD + Hexagonal (9-Layer Structure)

The application follows **Domain-Driven Design** principles combined with **Hexagonal Architecture** (Ports and Adapters pattern) to ensure clean separation of concerns and maintainability.

#### Inner Hexagon (Core)
- **Domain Layer**: Pure business logic, entities, domain rules (no external dependencies)
- **Application Layer**: Use cases, CQRS command/query separation, orchestration

#### Outer Hexagon (Adapters)
- **Infrastructure Layer**: External adapters (Supabase, file systems, APIs)
- **UI Layer**: Presentation adapters (React Native components, screens)

#### Supporting Layers
- **Cross-cutting Concerns**: Logging, validation, security, monitoring
- **Shared Packages**: Contracts, types, APIs, internationalization

### Dependency Rules (Immutable)

```
Domain ← Application ← Infrastructure
   ↑         ↑             ↑
   └── UI ←──┴─── CrossCutting
```

**Core Principle**: Dependencies point inward. Domain depends on nothing. Application depends only on Domain. Infrastructure and UI are external adapters.

## Monorepo Structure (Final)

> **CRITICAL**: This structure is SET IN STONE and will not change between reviews.

```
hex-mob-cleanslate/                    # Root monorepo
├── packages/                          # MONOREPO PACKAGES
│   ├── shared/                        # Shared across apps
│   │   ├── api/                       # API clients (apisauce, Supabase stubs)
│   │   ├── types/                     # TypeScript definitions
│   │   ├── i18n/                      # Localization (RTL Arabic, English, Spanish)
│   │   ├── utils/                     # Common utilities (date-fns, validation)
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
│       │   │   ├── storage/           # MMKV, AsyncStorage adapters
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
│       │   │   ├── navigation/        # React Navigation setup
│       │   │   └── hooks/             # UI-specific hooks
│       │   │
│       │   ├── crosscutting/          # CROSS-CUTTING CONCERNS
│       │   │   ├── logging/           # Sentry, ErrorLogger.ts
│       │   │   ├── validation/        # Input validation
│       │   │   ├── security/          # Biometric auth, encryption
│       │   │   └── monitoring/        # Reactotron, performance
│       │   │
│       │   └── assets/                # STATIC RESOURCES
│       │       ├── images/            # App icons, badges
│       │       ├── fonts/             # Custom fonts
│       │       └── animations/        # Lottie files
│       │
│       ├── __tests__/                 # TESTING
│       │   ├── unit/                  # Jest unit tests
│       │   ├── integration/           # React Native Testing Library
│       │   └── e2e/                   # Detox end-to-end
│       │
│       ├── app.json                   # Expo configuration
│       ├── eas.json                   # EAS Build configuration
│       ├── package.json               # Mobile app dependencies
│       └── tsconfig.json              # TypeScript config
│
├── tools/                             # MONOREPO TOOLING
│   ├── build/                         # Build scripts
│   ├── deploy/                        # Deployment automation
│   └── scripts/                       # Development scripts
│
├── docs/                              # DOCUMENTATION
│   ├── architecture/                  # DDD/Hexagonal docs
│   ├── deployment/                    # EAS, store deployment
│   └── api/                           # API documentation
│
├── legacy-v1/                         # LEGACY REFERENCE
│   └── CleanSlate Mobile App UI Prototype/  # Original working code
│
├── package.json                       # ROOT monorepo package.json
├── bun.lock                          # Dependency lock file
└── README.md                         # Project documentation
```

### Package Responsibilities

- **packages/shared/**: Cross-cutting utilities, types, i18n - eliminating code duplication across packages
- **apps/mobile/src/domain/**: Pure business logic with no React Native dependencies
- **apps/mobile/src/application/**: Use cases implementing CQRS commands/queries
- **apps/mobile/src/infrastructure/**: External system adapters (Supabase, MMKV, etc.)
- **apps/mobile/src/ui/**: React Native components, navigation, screens

## Technology Stack & Rationale

### Core Framework & Runtime

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **React Native** | v0.79 | Required by SDK v53; supports New Architecture for 60 FPS swipes/gamification |
| **React** | v18 | Stable foundation; integrates with Redux for domain services |
| **TypeScript** | v5 | Enhanced typing for DDD/CQRS in /domain and /application layers |
| **Expo SDK** | v53 | Latest version; aligns with offline-first, ML, and RTL requirements |
| **Hermes JS Engine** | Latest | Optimal performance/battery for ML-heavy, animation-rich apps |

### Navigation & UI Framework

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **React Navigation** | v6 | Powers TabNavigation.tsx; integrates with Gesture Handler |
| **React Native Gesture Handler** | v2 | Tinder-style swipes, haptics, wheel spinner physics |
| **React Native Reanimated** | v3 | Physics-based animations, streaks, gestures per PRD |
| **FlashList** | v1 | Replaces FlatList for performant photo lists with pre-loading |

### State Management & Data Flow

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **Redux Toolkit** | v2 | Scales for 9-layer DDD/CQRS, handles gamification state (streaks, achievements) |
| **React Query** | v5 | Manages offline queues, Supabase stubs, retry logic for shares |
| **MMKV** | v2 | State persistence (faster than AsyncStorage) for metadata |

### Networking & APIs

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **apisauce** | v2 | REST client for Supabase stubs in `/packages/shared/api` |
| **Supabase** | Latest | Backend stubs for offline-first data synchronization |

### Localization & Accessibility

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **Expo Localization** | v16 | Handles RTL Arabic, English, Spanish with I18nManager |
| **Expo Font** | v13 | Custom fonts for badges/themes |
| **Expo Status Bar** | v2 | Patched for dark mode/RTL bugs |

### Performance & UX Enhancement

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **react-native-keyboard-controller** | v1 | Keyboard management for sharing/search inputs |
| **react-native-haptic-feedback** | v2 | Kinesthetic feedback for streaks, swipes, achievements |
| **react-native-device-info** | v10 | Device/battery handling for low-battery warnings |

### Security & Authentication

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **expo-local-authentication** | v13 | Biometric authentication for Private Pool privacy features |

### Development & Testing Tools

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **bun** | Latest | Package manager (speeds up incremental development) |
| **Reactotron** | v3 | JS debugging for performance metrics, ML tasks, error logging |
| **Jest** | v29 | Unit testing with React Native Testing Library |
| **Detox** | v20 | End-to-end UI testing (New Architecture, gesture, accessibility) |
| **Sentry** | v8 | Enterprise observability and error logging |

### Utilities & Support Libraries

| Technology | Version | Purpose & Rationale |
|------------|---------|-------------------|
| **date-fns** | v3 | Lightweight date handling for stats dashboard and retention timers |

## Development Timeline & Current Status

### Phase 1: Legacy-to-DDD Migration ✅ **COMPLETED**

**Duration**: Days 1-2  
**Objective**: Migrate from legacy prototype to production-ready DDD/Hexagonal architecture

**Key Achievements**:
- Successfully implemented 9-layer DDD/Hexagonal structure
- Migrated existing UI components from `/legacy-v1/CleanSlate Mobile App UI Prototype`
- Adapted components: TabNavigation, PermissionScreen, StatsScreen, SettingsScreen, SpinWheel
- Implemented prop drilling avoidance patterns
- Established monorepo structure with shared packages

**Lessons Learned**:
- Reuse working legacy code instead of rebuilding from scratch (estimated 20% new code needed)
- Always inspect current codebase before making structural changes
- Maintain strict hexagonal dependency rules during migration

### Phase 2: EAS Configuration ✅ **COMPLETED**

**Duration**: Day 3  
**Objective**: Configure Expo Application Services for deployment

**Key Achievements**:
- Successfully configured EAS updates and build system
- Installed and configured expo-updates native module
- Set up runtime version policy and update URLs
- Successfully uploaded JavaScript bundles to EAS
- Completed Android native build (version 3) with working credentials

**Technical Details**:
- Updates URL: `https://u.expo.dev/96e0d105-47e9-409d-88a9-8431da22e283`
- Runtime Version: 1.0.0
- Android build successful with Keystore credentials

### Phase 3: QR Code Deployment ❌ **CURRENT BLOCKER**

**Duration**: Ongoing  
**Objective**: Resolve QR code deployment loop for testing

**Current Issue**:
QR code loads in Expo Go but displays "New update available, downloading" indefinitely without completing the update process.

**Root Cause Analysis**:
EAS Update creates custom native build fingerprints that are incompatible with Expo Go's fixed runtime environment.

**Attempted Solutions**:
1. Cache clearing (Metro, EAS, npm caches)
2. Permission fixes for WSL environment
3. EAS native builds (blocked by Apple Developer account requirement)
4. Build configuration adjustments

**Current Status**:
Pending execution of legacy publish solution: `expo publish --release-channel default`

## State Management & Prop Drilling Avoidance

### The Problem

In a 9-layer DDD architecture, passing props through multiple layers violates Separation of Concerns and creates maintenance overhead. Prop drilling through domain → application → infrastructure → UI layers would couple unrelated architectural concerns.

### Solutions Implemented

#### 1. Redux Toolkit v2 (Primary State Management)

**Purpose**: Centralized state for gamification features and application-wide data
**Usage**: 
- Swipe streaks and achievements
- Trash metadata and retention policies
- User preferences and settings
- Offline queue status

**Access Pattern**:
```typescript
// Any component can access state without prop drilling
const streakCount = useSelector(state => state.gamification.streakCount);
const dispatch = useDispatch();
```

**CQRS Integration**: Redux actions perfectly implement command/query separation in the application layer.

#### 2. React Query v5 (Async State Management)

**Purpose**: Global async data handling with built-in loading/error states
**Usage**:
- Offline share queues
- Supabase data synchronization
- API call retry logic
- Cache management for network requests

**Benefits**:
- Eliminates prop drilling for loading states
- Automatic background refetching
- Optimistic updates for offline scenarios

#### 3. Context API (Simple Global State)

**Purpose**: App-wide simple state that doesn't require Redux complexity
**Usage**:
- Theme configuration (dark/light mode)
- Localization settings (RTL/LTR, language)
- Device-specific settings

**Implementation**: Providers at top level make data available throughout component tree.

#### 4. Component Composition (UI-Specific State)

**Purpose**: Handle UI-specific interactions without global state complexity
**Usage**:
- Gesture states in SwipeCard.tsx
- Animation states in SpinWheel.tsx
- Form inputs and validation

**Pattern**: Use custom hooks and component composition instead of deep prop chains.

### Architecture Benefits

- **Clean Separation**: Each layer uses appropriate state management without coupling
- **Maintainability**: Changes to state structure don't ripple through multiple files
- **Testability**: State logic can be tested independently of UI components
- **Performance**: Selective component re-rendering through optimized selectors

## Feature-Specific Technical Decisions

### Gamification System

**Swipe Mechanics**:
- **Technology**: React Native Gesture Handler v2 + Reanimated v3
- **Implementation**: Tinder-style gesture recognition with physics-based animations
- **Performance Target**: 60 FPS animations using New Architecture optimization

**Streak Tracking**:
- **State Management**: Redux Toolkit for centralized streak state
- **Persistence**: MMKV for fast local storage of streak data
- **Sync**: React Query for background synchronization with backend

**Haptic Feedback**:
- **Technology**: react-native-haptic-feedback v2
- **Triggers**: Achievements, successful swipes, milestone completions
- **Accessibility**: Configurable intensity for user preferences

### Offline-First Architecture

**Queue Management**:
- **Technology**: React Query v5 with custom retry logic
- **Implementation**: Persistent queues for shares, likes, and user actions
- **Sync Strategy**: Background synchronization when network available

**State Persistence**:
- **Primary**: MMKV for performance-critical data (streaks, preferences)
- **Fallback**: AsyncStorage for compatibility with older data
- **Strategy**: Automatic migration from AsyncStorage to MMKV

**Network Resilience**:
- **Retry Logic**: Exponential backoff for failed requests
- **Offline Detection**: Network state monitoring with graceful degradation
- **Data Integrity**: Conflict resolution for offline/online data sync

### Multi-Language & Accessibility

**RTL Support**:
- **Technology**: Expo Localization v16 with I18nManager
- **Languages**: Arabic (RTL), English (LTR), Spanish (LTR)
- **Implementation**: Automatic text direction detection and layout mirroring

**Dark Mode**:
- **Technology**: Expo Status Bar v2 with custom patches
- **Implementation**: System preference detection with manual override
- **Consistency**: Themed components throughout application

**Biometric Privacy**:
- **Technology**: expo-local-authentication v13
- **Feature**: Private Pool access protection
- **Fallback**: PIN-based authentication when biometrics unavailable

## Current Deployment Configuration

### Expo/EAS Setup

```yaml
Configuration Details:
  Expo Token: GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV
  Project ID: 96e0d105-47e9-409d-88a9-8431da22e283
  Updates URL: https://u.expo.dev/96e0d105-47e9-409d-88a9-8431da22e283
  Runtime Version: 1.0.0
  Account: kellybakri
  Project Slug: hex-mob-cleanslate
  Environment: WSL (Ubuntu) ~/projects/hex-mob-cleanslate
```

### Build Status

**Android Build**: ✅ **SUCCESSFUL**
- Version Code: 3
- Build Credentials: Configured (42A2v0P39m)
- Keystore: Remote (Expo managed)
- Status: Ready for testing

**iOS Build**: ❌ **BLOCKED**
- Blocker: Requires Apple Developer account ($99/year)
- Credential Status: Not configured
- Alternative: Android-only testing approach

**JavaScript Bundles**: ✅ **UPLOADED**
- iOS Bundle: 1.98 MB + 5.94 MB source map
- Android Bundle: 1.99 MB + 5.96 MB source map
- Assets: 20 iOS, 20 Android (fonts, icons)
- Update ID: d02fc630-a330-44f0-a72a-34094b59138d

## User Preferences & Development Workflow

### Communication Requirements

**Command Format**:
- **Style**: "1-2 commands at a time" with exact copy-paste syntax
- **Environment**: Always specify WSL/cmd/PowerShell for each command
- **Clarity**: Provide actionable commands, not theoretical explanations
- **Decisiveness**: "No 30-hour troubleshooting loops" - change approach when stuck

**Response Expectations**:
- **Specificity**: "This is development, you need to be specific"
- **Format**: Clean, readable terminal output
- **Scripts**: Prefer shorter script names and executable solutions
- **Error Handling**: "Don't ask me to check logs" - provide extraction commands

### Technical Preferences

**Package Management**:
- **Primary**: bun (preferred but not installed)
- **Fallback**: npm (currently used)
- **Principle**: "No manual work" - everything should be scripted

**Automation Philosophy**:
- **Goal**: End-to-end automation from startup to completion
- **Sessions**: 3-7 hours unattended autonomous development
- **Integration**: GitHub commits, testing, documentation generation
- **Passwordless**: Configure sudoers for admin tasks to avoid prompts

**Solution Requirements**:
- **Permanence**: "Make it permanent" - no temporary fixes or workarounds
- **One-click**: Everything automated via scripts
- **Resource-conscious**: Realistic expectations for 16GB laptop hardware
- **Performance**: Stability and speed over feature complexity

### Anti-Patterns & Frustrations

**Communication Red Flags**:
- ❌ Being asked to manually check logs or outputs
- ❌ Repeated password prompts for scripted operations  
- ❌ Solutions requiring manual intervention during autonomous runs
- ❌ Temporary fixes that need to be redone
- ❌ Long explanations without actionable commands
- ❌ Messy terminal output that's hard to read

**Technical Anti-Patterns**:
- ❌ **Prop Drilling**: Use Redux/Context/React Query instead
- ❌ **Layer Coupling**: Maintain strict hexagonal dependency rules
- ❌ **Manual State Passing**: Leverage global state management patterns
- ❌ **Performance Degradation**: Monitor with Reactotron, optimize with New Architecture

## Critical Issues & Solutions

### Permission Error Patterns (WSL Environment)

**Common Locations**:
- `/tmp/metro-cache/` - Metro bundler cache
- `~/.cache/eas-cli/` - EAS CLI cache and logs
- `/tmp/kellyb_dev/eas-cli-nodejs/` - EAS temporary files

**Standard Fix Pattern**:
```bash
sudo chown -R $USER:$USER [directory]
sudo mkdir -p [directory] && sudo chown -R $USER:$USER [directory]
```

**Nuclear Cache Clear**:
```bash
sudo rm -rf /tmp/metro-cache ~/.cache/eas-cli ~/.expo ~/.npm ~/projects/hex-mob-cleanslate/dist ~/projects/hex-mob-cleanslate/node_modules/.cache
```

### Build Fingerprint Mismatch (Current Blocker)

**Root Cause**: EAS Updates create custom native build fingerprints incompatible with Expo Go's fixed runtime.

**Attempted Solutions**:
1. **Cache Clearing**: Multiple attempts with various cache directories
2. **EAS Native Builds**: Blocked by credential requirements
3. **Non-Interactive Builds**: Failed due to credential validation issues

**Current Resolution Strategy**: Legacy publish system bypass
```bash
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV expo publish --release-channel default
```

### Version Management Issues

**EAS CLI**: Outdated version warnings but functional core features
**Package Manager**: bun not installed, npm fallback working
**Strategy**: Proceed with working tools rather than upgrade troubleshooting

## Immediate Next Steps

### Critical Path Resolution

**Step 1: Execute Legacy Publish**
```bash
# Location: WSL Terminal in ~/projects/hex-mob-cleanslate
# PENDING EXECUTION - Proposed fix for QR code loop:
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV expo publish --release-channel default
```

**Expected Outcome**: QR code compatible with Expo Go runtime, bypassing EAS Update fingerprint issues

**Step 2: Validation Testing**
- Scan new QR code in Expo Go
- Verify app loads without download loop
- Test core functionality (navigation, basic interactions)

**Step 3: Feature Implementation** (Post-Resolution)
- Implement gamification system with Redux state management
- Configure offline functionality with React Query
- Test multi-language and RTL support
- Establish testing pipeline with Jest + Detox

### Success Criteria

**Immediate Success**:
- ✅ Working QR code loads immediately in Expo Go
- ✅ All migrated UI components render correctly
- ✅ Navigation and basic interactions functional

**Development Success**:
- ✅ Prop drilling eliminated through proper state management
- ✅ 60 FPS animations and gestures working
- ✅ Offline functionality operational
- ✅ Multi-language support verified

## Emergency Recovery Procedures

### Complete Environment Reset

**Cache Nuclear Option**:
```bash
sudo rm -rf /tmp/metro-cache ~/.cache/eas-cli ~/.expo ~/.npm ~/projects/hex-mob-cleanslate/dist ~/projects/hex-mob-cleanslate/node_modules/.cache
sudo mkdir -p ~/.cache/eas-cli && sudo chown -R $USER:$USER ~/.cache/eas-cli
```

**Permission Reset**:
```bash
sudo chown -R $USER:$USER ~/projects/hex-mob-cleanslate
sudo chown -R $USER:$USER ~/.cache/eas-cli
sudo mkdir -p /tmp/kellyb_dev/eas-cli-nodejs && sudo chown -R $USER:$USER /tmp/kellyb_dev
```

### Working Build Commands

**Android Build** (Confirmed Working):
```bash
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV eas build --platform android --non-interactive
```

**Update Publication**:
```bash
EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV eas update --auto --non-interactive
```

### Troubleshooting Loop Breaker

**Pattern Recognition**: If same error occurs 3+ times with same approach:
1. **STOP** current troubleshooting approach
2. **ANALYZE** fundamental assumptions
3. **CHANGE** to alternative strategy (e.g., legacy vs EAS systems)
4. **DOCUMENT** decision rationale

## Future Considerations

### Technical Debt & Risks

**Mixed Publishing Systems**: Currently using both EAS Updates AND legacy expo publish
- **Risk**: Potential conflicts between systems
- **Mitigation**: Choose single publishing strategy post-resolution

**iOS Development**: Requires Apple Developer account investment
- **Cost**: $99/year for App Store access
- **Alternative**: Android-only approach for MVP testing

**WSL Environment**: Package manager and permission inconsistencies
- **Issue**: bun not installed, npm permission complexities
- **Solution**: Standardize development environment setup

### Scalability Concerns

**Testing Infrastructure**:
- **Current**: Heavy dependence on Expo Go for testing
- **Future**: Device farm or alternative testing approaches needed

**Build Pipeline**:
- **Current**: Manual credential management
- **Future**: Automated CI/CD pipeline with secure credential storage

**Performance Monitoring**:
- **Current**: Reactotron for debugging
- **Future**: Production monitoring with Sentry integration

### Strategic Decisions Needed

**Deployment Strategy**: 
- Commit to EAS Update OR legacy publish (not both)
- Establish clear build and deployment pipeline

**Platform Priority**:
- iOS strategy: Apple Developer account vs Android-only
- Resource allocation for multi-platform vs single platform excellence

**Development Environment**:
- Proper bun installation vs npm standardization
- WSL optimization vs alternative development environments

## Appendix: Key Commands

### Environment Setup
```bash
# Project Location
cd ~/projects/hex-mob-cleanslate

# Environment Variables
export EXPO_TOKEN=GvJg4xZdd9JNhpQ3mCWX7wLJDx8731cjOgHDw2VV
```

### Daily Development Commands
```bash
# Install Dependencies
npm install  # (bun preferred when available)

# Development Server
npx expo start

# Build Commands
EXPO_TOKEN=$EXPO_TOKEN eas build --platform android --non-interactive
EXPO_TOKEN=$EXPO_TOKEN eas update --auto --non-interactive

# Legacy Publish (Current Resolution)
EXPO_TOKEN=$EXPO_TOKEN expo publish --release-channel default
```

### Emergency Recovery
```bash
# Complete Cache Clear
sudo rm -rf /tmp/metro-cache ~/.cache/eas-cli ~/.expo ~/.npm ~/projects/hex-mob-cleanslate/dist ~/projects/hex-mob-cleanslate/node_modules/.cache

# Permission Fix
sudo chown -R $USER:$USER ~/.cache/eas-cli ~/projects/hex-mob-cleanslate
```

### Project Information
```bash
# Dashboard Access
https://expo.dev/accounts/kellybakri/projects/hex-mob-cleanslate

# Update Monitoring
https://expo.dev/accounts/kellybakri/projects/hex-mob-cleanslate/updates

# Build Monitoring  
https://expo.dev/accounts/kellybakri/projects/hex-mob-cleanslate/builds
```

**Document Version**: 1.0  
**Last Updated**: January 30, 2025  
**Next Review**: Post QR code resolution  
**Prepared By**: Development Team  
**Status**: Ready for next development session  

*This document serves as the complete handover for continuing development sessions. All architectural decisions, current status, and next steps are documented to enable seamless project continuation without requiring additional context or clarification.*
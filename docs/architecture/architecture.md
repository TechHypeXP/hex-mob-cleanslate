# CleanSlate Mobile App Architecture

## Overview
This document provides a central overview of the CleanSlate Mobile App architecture, summarizing the key components and their relationships based on the Hexagonal Architecture (Ports and Adapters) and Domain-Driven Design principles.

## Folder Structure Summary

### apps/mobile/src
The main source code for the mobile application, organized by architectural layers:

#### Domain Layer
- **Purpose**: Contains pure business logic and domain models
- **Structure**: 
  - `entities/` - Core domain entities (e.g., PhotoModel, GamificationEntity)
  - `valueObjects/` - Value objects that represent descriptive aspects of domain entities
  - `services/` - Domain services that don't naturally fit within an entity
  - `repositories/` - Repository interfaces that define data access contracts

#### Application Layer
- **Purpose**: Contains application-specific business logic and use cases
- **Structure**:
  - `useCases/` - Application use cases that orchestrate domain interactions
  - `services/` - Application services that implement business logic
  - `ports/` - Interfaces for external dependencies (secondary ports)

#### Infrastructure Layer
- **Purpose**: Contains implementations of external dependencies and technical details
- **Structure**:
  - `repositories/` - Concrete implementations of domain repository interfaces
  - `services/` - Implementations of application service interfaces
  - `storage/` - Data storage implementations (local, cloud, etc.)
  - `network/` - Network communication implementations

#### UI Layer
- **Purpose**: Contains presentation logic and user interface components
- **Structure**:
  - `screens/` - Screen components that represent complete user interfaces
  - `components/` - Reusable UI components
  - `navigation/` - Navigation components and routing logic
  - `hooks/` - Custom React hooks for UI logic

#### Crosscutting Layer
- **Purpose**: Contains cross-cutting concerns that span multiple layers
- **Structure**:
  - `logging/` - Logging utilities and implementations
  - `validation/` - Validation logic and utilities
  - `security/` - Security-related components and utilities
  - `monitoring/` - Monitoring and observability components

#### Assets
- **Purpose**: Contains static assets used by the application
- **Structure**:
  - `images/` - Image assets
  - `fonts/` - Font files
  - `animations/` - Animation files

### packages/shared
Contains shared code that can be used across multiple applications in the monorepo:

- `api/` - Shared API interfaces and client utilities
- `types/` - Shared TypeScript types and interfaces
- `i18n/` - Internationalization resources and utilities
- `utils/` - Shared utility functions and helpers
- `constants/` - Shared constants and configuration values

### apps/mobile/__tests__
Contains different types of tests for the mobile application:

- `unit/` - Unit tests for individual components and functions
- `integration/` - Integration tests for component interactions
- `e2e/` - End-to-end tests for complete user workflows

### docs
Contains comprehensive documentation for the project:

- `architecture/` - System architecture and design decisions
- `deployment/` - Deployment processes and procedures
- `api/` - API specifications and usage guidelines

### tools
Contains development tools and scripts:

- `build/` - Build tools and scripts
- `deploy/` - Deployment tools and scripts
- `scripts/` - General-purpose development scripts

### legacy-v1
Contains the original prototype and early development version for reference.

## Architectural Principles

### Hexagonal Architecture
The application follows Hexagonal Architecture principles where:
- The domain layer is at the core and independent of external concerns
- Application layer orchestrates domain interactions
- Infrastructure layer provides concrete implementations for external dependencies
- UI layer acts as an adapter for user interactions

### Domain-Driven Design
The application applies DDD principles where:
- Domain entities encapsulate business logic and data
- Value objects represent descriptive aspects of domain entities
- Repositories abstract data access mechanisms
- Services contain operations that don't naturally fit within entities

### Separation of Concerns
Each layer has a specific responsibility:
- Domain: Business logic
- Application: Use cases and orchestration
- Infrastructure: Technical implementations
- UI: Presentation and user interaction

## Technology Stack
- **Framework**: React Native with Expo
- **Architecture**: Hexagonal Architecture with DDD
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Testing**: Jest and React Native Testing Library
- **Build System**: Expo CLI
- **Deployment**: Expo Application Services (EAS)

## Photo Permissions Implementation

### Overview
The photo permissions system handles cross-platform photo library access using Expo APIs with full i18n integration and Redux state management.

### Architecture
- **Service Layer**: PhotoPermissionService in application layer handles permission logic
- **State Management**: Redux store manages permission state across the application
- **UI Layer**: PermissionScreen displays permission status and handles user interactions
- **Internationalization**: i18next integration for multi-language support

### Components
1. **PhotoPermissionService** (Application Layer)
   - Requests and checks photo library permissions using Expo MediaLibrary API
   - Returns structured results for UI consumption
   - Handles permission errors gracefully

2. **Redux Store** (Infrastructure Layer)
   - Manages photo library permission state
   - Tracks permission status, canAskAgain flag, and granted state
   - Handles loading and error states

3. **PermissionScreen** (UI Layer)
   - Displays current permission status to the user
   - Provides UI for requesting permissions
   - Shows appropriate messages based on permission state
   - Supports RTL layouts and i18n

### Data Flow
1. PermissionScreen initializes and checks current permission status
2. PhotoPermissionService handles Expo API calls
3. Redux store updates with permission results
4. PermissionScreen re-renders with updated status
5. User can request permissions through UI
6. Process repeats with updated state

### Privacy Considerations
- Only requests necessary permissions (photo library access)
- Respects user privacy by not accessing media without explicit permission
- Follows platform-specific permission guidelines
- Provides clear explanations of why permissions are needed

## Image Management Implementation

### Overview
The image management system handles photo library viewing, sorting, and organization. It was ported from the legacy-v1 implementation and refactored to follow DDD/Hexagonal architecture principles with full i18n integration, Redux state management, and comprehensive testing.

### Architecture
- **State Management**: Redux Toolkit manages photo library state
- **UI Layer**: ImageManagementScreen displays photos and handles user interactions
- **Internationalization**: i18next integration for multi-language support (English and Arabic)
- **Domain Layer**: Uses PhotoItem type from shared package for data modeling

### Components
1. **Photos Redux Slice** (Infrastructure Layer)
   - Manages photo library state including photos, selection, sorting, and filtering
   - Handles loading and error states
   - Provides actions for photo management operations

2. **ImageManagementScreen** (UI Layer)
   - Displays photo library with thumbnails
   - Provides sorting options (by creation time, modification time, filename)
   - Supports photo selection (individual or bulk)
   - Implements share functionality for selected photos
   - Supports RTL layouts and i18n
   - Handles loading and error states

### Data Flow
1. ImageManagementScreen initializes and loads photos
2. Photos Redux Slice manages photo state
3. UI renders photos with sorting and selection options
4. User interacts with photos (select, sort, share)
5. Redux state updates with user actions
6. UI re-renders with updated state

### Legacy Port Information
This implementation was ported from the legacy-v1 prototype with the following modernizations:
- Refactored to follow DDD/Hexagonal architecture
- Updated to use Redux Toolkit for state management
- Integrated with i18n for localization
- Added comprehensive unit and integration tests
- Implemented RTL support for Arabic language
- Updated to use modern React patterns and hooks

### Features
- Photo library viewing with thumbnails
- Sorting by creation time, modification time, or filename
- Individual and bulk photo selection
- Share functionality for selected photos
- Multi-language support (English and Arabic)
- RTL layout support for Arabic
- Loading and error state handling
- Comprehensive test coverage

## Development Guidelines
1. Follow the established folder structure and naming conventions
2. Maintain clear boundaries between architectural layers
3. Keep domain logic pure and independent of external dependencies
4. Use dependency inversion to decouple layers
5. Write comprehensive tests for all business logic
6. Document all public interfaces and complex logic
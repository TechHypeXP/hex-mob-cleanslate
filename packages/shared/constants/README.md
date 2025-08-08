# Shared Constants

## Responsibility
The shared constants directory contains common constants, configuration values, and enums that are shared across applications.

## Architectural Purpose
- **Configuration Consistency**: Provide consistent configuration values across applications
- **Centralized Constants**: Manage constants in one location
- **Reduced Duplication**: Eliminate duplicate constant definitions
- **Maintainability**: Simplify updates to shared values

## Developer Guidelines
- Only place truly shared constants in this directory
- Use descriptive names for constants
- Group related constants logically
- Document all constants clearly with comments
- Keep constants immutable and well-defined

## Examples
```typescript
// Example shared configuration constants
export const API_BASE_URL = 'https://api.cleanslate.app';
export const DEFAULT_TIMEOUT = 5000;
export const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB

// Example shared business constants
export const MIN_PHOTO_RATING = 1;
export const MAX_PHOTO_RATING = 5;
export const DEFAULT_PAGE_SIZE = 20;

// Example shared enum constants
export enum PhotoCategory {
  NATURE = 'nature',
  PORTRAIT = 'portrait',
  ABSTRACT = 'abstract',
  OTHER = 'other'
}

export enum UserRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}
```

## Boundaries
- Shared constants should not have application-specific values
- Keep constants focused and well-defined
- Changes may affect multiple applications
- Part of the overall shared package structure
# Shared Types

## Responsibility
The shared types directory contains common TypeScript interfaces, types, and enums that are shared across applications.

## Architectural Purpose
- **Type Consistency**: Provide consistent types across applications
- **Type Safety**: Ensure type safety for shared data structures
- **Centralized Definitions**: Manage type definitions in one location
- **API Contract**: Define data structures for API communication

## Developer Guidelines
- Define types that are truly shared across applications
- Maintain backward compatibility when possible
- Document all types clearly with JSDoc comments
- Use descriptive names for types and interfaces
- Keep types focused and well-defined

## Examples
```typescript
// Example shared interface
export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

// Example shared enum
export enum PhotoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Example shared type
export type PhotoCategory = 'nature' | 'portrait' | 'abstract' | 'other';
```

## Boundaries
- Shared types should not have application-specific properties
- Keep types focused and well-defined
- Changes may affect multiple applications
- Part of the overall shared package structure
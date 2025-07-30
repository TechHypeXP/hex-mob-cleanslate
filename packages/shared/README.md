# Shared Package

## Responsibility
The shared package contains utilities, types, and resources that are shared across multiple applications in the monorepo.

## Architectural Purpose
- **Code Reusability**: Provide common functionality across applications
- **Consistency**: Ensure consistent implementations and interfaces
- **Centralized Management**: Manage shared resources in one location
- **Dependency Reduction**: Reduce duplication across applications

## Developer Guidelines
- Only place truly shared code in this package
- Maintain backward compatibility when possible
- Document all exported interfaces and functions
- Keep dependencies minimal and well-managed
- Follow semantic versioning for breaking changes

## Examples
```typescript
// Example shared type
export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
}

// Example shared utility
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
```

## Boundaries
- Shared code should not have dependencies on application-specific code
- Keep the package lightweight and focused
- Changes may affect multiple applications
- Part of the overall monorepo structure
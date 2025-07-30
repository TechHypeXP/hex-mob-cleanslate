# Shared Utilities

## Responsibility
The shared utils directory contains common utility functions and helper methods that are shared across applications.

## Architectural Purpose
- **Code Reusability**: Provide reusable utility functions across applications
- **Consistency**: Ensure consistent implementations of common operations
- **Centralized Utilities**: Manage utility functions in one location
- **Reduced Duplication**: Eliminate duplicate utility implementations

## Developer Guidelines
- Only place truly shared utility functions in this directory
- Maintain backward compatibility when possible
- Document all utility functions clearly with JSDoc comments
- Keep utility functions focused and well-defined
- Write comprehensive tests for utility functions

## Examples
```typescript
// Example shared utility function
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Example shared helper class
export class StringUtils {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  static truncate(str: string, maxLength: number): string {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  }
}

// Example shared validation utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## Boundaries
- Shared utilities should not have application-specific logic
- Keep utility functions focused and well-defined
- Changes may affect multiple applications
- Part of the overall shared package structure
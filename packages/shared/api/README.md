# Shared API

## Responsibility
The shared API directory contains common API interfaces, types, and client utilities that are shared across applications.

## Architectural Purpose
- **API Consistency**: Provide consistent API interfaces across applications
- **Type Safety**: Ensure type safety for API interactions
- **Centralized Definitions**: Manage API contracts in one location
- **Client Abstraction**: Provide common API client utilities

## Developer Guidelines
- Define API interfaces and types that are truly shared
- Maintain backward compatibility when possible
- Document all API contracts clearly
- Keep API client utilities generic and reusable
- Follow REST/GraphQL best practices

## Examples
```typescript
// Example shared API interface
export interface PhotoApiResponse {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

// Example shared API client utility
export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
}
```

## Boundaries
- Shared API code should not have application-specific logic
- Keep API interfaces focused and well-defined
- Changes may affect multiple applications
- Part of the overall shared package structure
# Application Services

## Responsibility
Application Services coordinate domain objects and handle application-specific logic that doesn't fit naturally into use cases.

## Architectural Purpose
- **Coordination**: Orchestrate multiple domain objects or use cases
- **Transaction Management**: Handle complex transactions spanning multiple operations
- **External Integration**: Interface with external systems and services
- **Cross-cutting Concerns**: Handle application-level concerns like caching

## Key Components
- **SwipeService**: Coordinates swipe-related operations (currently a placeholder)
- **NotificationService**: (To be implemented) Handles user notifications
- **SynchronizationService**: (To be implemented) Manages data sync operations

## Developer Guidelines
- Keep services stateless when possible
- Services should coordinate rather than implement business logic
- Handle application-level concerns like transactions and security
- Use dependency injection for service dependencies
- Services should be testable and mockable

## Examples
```typescript
// Example application service
class PhotoUploadService {
  constructor(
    private photoRepository: PhotoRepository,
    private storageService: StorageService
  ) {}
  
  async uploadPhoto(file: File): Promise<PhotoModel> {
    // Coordinate domain objects and infrastructure
  }
}
```

## Boundaries
- Application services belong to the application layer
- Depend on domain objects and infrastructure interfaces
- Called by use cases or other application services
- Should not contain core domain logic
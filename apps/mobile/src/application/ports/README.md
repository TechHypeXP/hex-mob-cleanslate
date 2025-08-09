# Application Ports

## Responsibility
Ports define interfaces that the application layer uses to communicate with external systems. They implement the dependency inversion principle.

## Architectural Purpose
- **Interface Definition**: Define contracts for external system interactions
- **Dependency Inversion**: Enable loose coupling between application and infrastructure
- **Testability**: Allow mocking of external dependencies for testing
- **Flexibility**: Enable swapping of implementations without changing application logic

## Developer Guidelines
- Define clear, focused interfaces
- Use domain language in port method names
- Keep ports technology-agnostic
- Ports should be driven by application needs, not infrastructure capabilities
- Avoid exposing infrastructure-specific details in port interfaces

## Examples
```typescript
// Example ports (to be implemented)
interface NotificationPort {
  sendPushNotification(message: string, userId: string): Promise<void>;
}

interface StoragePort {
  uploadFile(file: File, path: string): Promise<string>;
  downloadFile(path: string): Promise<File>;
}
```

## Boundaries
- Ports belong to the application layer
- Implementations belong to the infrastructure layer
- Application services depend on port interfaces
- Ports should not depend on infrastructure details
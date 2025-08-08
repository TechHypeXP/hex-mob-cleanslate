# Application Use Cases

## Responsibility
Use Cases implement specific application functionality in response to user requests. They follow the CQRS pattern to separate commands (write operations) from queries (read operations).

## Architectural Purpose
- **Command Implementation**: Handle user requests that modify system state
- **Query Implementation**: Handle user requests that retrieve data
- **Business Process Orchestration**: Coordinate domain objects to fulfill requests
- **Transaction Boundary Definition**: Define where transactions begin and end

## Developer Guidelines
- Each use case should have a single, focused responsibility
- Separate commands (writes) from queries (reads) clearly
- Use cases should be independent and testable
- Handle authorization and validation at the use case level
- Return appropriate responses or errors to the calling layer
- Keep use cases thin - orchestrate domain objects rather than implementing logic

## Examples
```typescript
// Example use cases (to be implemented)
class UploadPhotoCommand { /* ... */ }
class GetPhotoQuery { /* ... */ }
class GetUserStatsQuery { /* ... */ }
```

## Boundaries
- Use cases belong to the application layer
- Depend on domain entities, value objects, and repository interfaces
- Called by the UI layer or API controllers
- Should not depend on infrastructure details directly
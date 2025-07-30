# Domain Services

## Responsibility
Domain Services contain operations that don't naturally belong to entities or value objects but are part of the domain logic.

## Architectural Purpose
- Implement domain operations that span multiple entities
- Encapsulate business logic that doesn't fit in entity or value object methods
- Provide a place for domain algorithms and calculations
- Maintain domain invariants across multiple objects

## Developer Guidelines
- Keep services stateless when possible
- Services should operate on domain objects
- Avoid implementing infrastructure concerns
- Use services sparingly - prefer entity methods when appropriate
- Services should be defined by the domain expert's ubiquitous language

## Examples
```typescript
// Example domain services (to be implemented)
class PhotoProcessingService { /* ... */ }
class GamificationCalculationService { /* ... */ }
```

## Boundaries
- Domain services belong to the domain layer
- Should not depend on infrastructure or UI concerns
- Can be used by application layer use cases
- Should work with domain entities and value objects
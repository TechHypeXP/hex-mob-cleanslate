# Domain Entities

## Responsibility
Entities are domain objects that have a distinct identity and lifecycle. They are defined by their identity, not by their attributes.

## Architectural Purpose
- Represent core business concepts with identity
- Encapsulate business logic and behavior
- Maintain consistency of business rules within their boundaries
- Provide methods to modify their state while preserving invariants

## Key Components
- **PhotoModel**: Represents a user photo with metadata and business methods
- **GamificationEntity**: Manages gamification aspects like streaks and achievements

## Developer Guidelines
- Entities must have a unique identifier
- Implement business methods that maintain consistency
- Avoid exposing internal state directly
- Use value objects for attribute representation when appropriate
- Keep entities focused on a single business concept
- Entities should be persistence-ignorant

## Examples
```typescript
// PhotoModel entity with business methods
const photo = new PhotoModel("123", "file://photo.jpg");
photo.toggleFavorite();
photo.addTag("vacation");
```

## Boundaries
- Entities belong to the domain layer
- Should not depend on infrastructure or UI concerns
- Repositories are used for persistence operations
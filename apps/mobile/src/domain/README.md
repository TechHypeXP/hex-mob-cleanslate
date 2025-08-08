# Domain Layer

## Responsibility
The Domain layer contains the core business logic and rules of the CleanSlate Mobile App. This is the heart of the application where all business concepts and operations are defined.

## Architectural Purpose
- **Pure Business Logic**: Contains entities, value objects, domain services, and repositories interfaces
- **No External Dependencies**: Should not depend on frameworks, databases, or UI components
- **Ubiquitous Language**: Implements the domain model using the business terminology
- **Business Invariants**: Enforces business rules and constraints

## Key Components
- **Entities**: Objects with identity that have lifecycle and business methods (e.g., PhotoModel, GamificationEntity)
- **Value Objects**: Objects without identity, defined by their attributes
- **Domain Services**: Operations that don't naturally belong to entities or value objects
- **Repositories**: Interfaces for data access (implementation in infrastructure layer)

## Developer Guidelines
- Keep all business logic in this layer
- Avoid framework-specific code
- Use domain-driven design principles
- Entities should encapsulate their own behavior
- Prefer rich domain models over anemic ones
- All domain objects should be testable in isolation

## Boundaries
- Depends on nothing (innermost layer)
- Application layer depends on this layer
- Infrastructure layer implements domain interfaces
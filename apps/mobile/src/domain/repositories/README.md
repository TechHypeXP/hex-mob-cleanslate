# Domain Repositories

## Responsibility
Repository interfaces define contracts for data access operations in the domain layer. They abstract the underlying data storage mechanism.

## Architectural Purpose
- Provide a collection-like interface for accessing domain objects
- Abstract persistence concerns from domain logic
- Define data access contracts that the domain depends on
- Enable dependency inversion between domain and infrastructure

## Developer Guidelines
- Define interfaces, not implementations
- Use domain language in method names
- Keep repository interfaces focused and cohesive
- Avoid exposing infrastructure-specific details
- Repositories should work with aggregates, not individual entities

## Examples
```typescript
// Example repository interface (to be implemented)
interface PhotoRepository {
  save(photo: PhotoModel): Promise<void>;
  findById(id: string): Promise<PhotoModel | null>;
  findAll(): Promise<PhotoModel[]>;
  delete(id: string): Promise<void>;
}
```

## Boundaries
- Repository interfaces belong to the domain layer
- Implementations belong to the infrastructure layer
- Application layer depends on repository interfaces
- Domain entities should not know about repositories directly
# Integration Tests

## Responsibility
Integration tests verify that different components and systems work together correctly. They test the interactions between units and subsystems.

## Architectural Purpose
- **Component Interaction**: Ensure components work together as expected
- **System Integration**: Validate integration with external systems
- **Data Flow**: Verify correct data flow between layers
- **Interface Validation**: Confirm interfaces work correctly

## Developer Guidelines
- Test interactions between related components
- Use real or realistic implementations for dependencies when possible
- Focus on critical integration points and data flows
- Keep tests maintainable and readable
- Run integration tests as part of CI/CD pipeline

## Examples
```typescript
// Example integration test
import { PhotoRepositoryImpl } from '../../../src/infrastructure/repositories/PhotoRepositoryImpl';
import { DatabaseClient } from '../../../src/infrastructure/database/DatabaseClient';

describe('PhotoRepository Integration', () => {
  let repository: PhotoRepositoryImpl;
  let database: DatabaseClient;
  
  beforeEach(() => {
    database = new DatabaseClient();
    repository = new PhotoRepositoryImpl(database);
  });
  
  it('should save and retrieve photo', async () => {
    const photo = new PhotoModel('1', 'photo.jpg');
    await repository.save(photo);
    
    const retrieved = await repository.findById('1');
    expect(retrieved).toEqual(photo);
  });
});
```

## Boundaries
- Integration tests focus on component interactions
- May use real external dependencies or realistic mocks
- Run less frequently than unit tests but more than E2E tests
- Part of the overall test suite execution
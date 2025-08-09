# UI Hooks

## Responsibility
Custom React hooks encapsulate UI-specific logic and state management. They provide reusable logic for components across the application.

## Architectural Purpose
- **Logic Reusability**: Share UI logic across multiple components
- **State Management**: Handle component-specific state and side effects
- **Abstraction**: Hide complex UI logic behind simple interfaces
- **Performance**: Optimize rendering and data fetching

## Developer Guidelines
- Keep hooks focused and single-purpose
- Follow React hook naming conventions (use*)
- Implement proper cleanup for side effects
- Handle loading and error states appropriately
- Ensure hooks are testable and well-documented

## Examples
```typescript
// Example custom hook
const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch photos from application layer
      const photoList = await photoService.getAllPhotos();
      setPhotos(photoList);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { photos, loading, loadPhotos };
};
```

## Boundaries
- Hooks belong to the UI layer
- Should not contain business logic
- Depend on application layer services for data operations
- Accessed by UI components through React hook conventions
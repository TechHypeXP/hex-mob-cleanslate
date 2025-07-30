# UI Components

## Responsibility
Components are reusable UI elements that can be composed to build screens and interfaces. They encapsulate specific UI functionality and presentation.

## Architectural Purpose
- **Reusability**: Create reusable UI elements across the application
- **Consistency**: Ensure consistent look and feel throughout the app
- **Composition**: Enable building complex interfaces from simple components
- **Maintainability**: Isolate UI logic for easier maintenance

## Key Components
- **SwipeCard**: Core component for photo swiping interactions
- **SpinWheel**: Component for gamification spin wheel interactions
- **Buttons**: Reusable button components with consistent styling
- **Forms**: Input components for user data entry

## Developer Guidelines
- Keep components focused and single-purpose
- Use props for configuration and customization
- Implement proper accessibility attributes
- Handle different states (loading, error, disabled)
- Follow design system guidelines for consistency

## Examples
```typescript
// Example reusable component
interface PhotoCardProps {
  photo: PhotoModel;
  onPress: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: photo.uri }} />
      <Text>{photo.tags.join(', ')}</Text>
    </TouchableOpacity>
  );
};
```

## Boundaries
- Components belong to the UI layer
- Should be reusable across different screens
- Receive data through props rather than direct dependencies
- Should not contain business logic
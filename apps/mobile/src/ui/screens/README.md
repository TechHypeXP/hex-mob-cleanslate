# UI Screens

## Responsibility
Screens are top-level UI components that represent entire application screens or pages. They coordinate the layout and composition of UI components.

## Architectural Purpose
- **Screen Composition**: Assemble UI components into complete screens
- **Navigation Handling**: Manage screen-specific navigation logic
- **Data Presentation**: Display data from application layer use cases
- **User Flow Management**: Handle user interactions and workflows

## Key Components
- **PermissionScreen**: Handles app permission requests and explanations
- **SettingsScreen**: Manages user preferences and app configuration
- **StatsScreen**: Displays user statistics and analytics
- **Main Screens**: Core application screens for primary functionality

## Developer Guidelines
- Each screen should have a single, focused purpose
- Screens should coordinate components rather than implement complex logic
- Handle loading states and error conditions appropriately
- Implement proper navigation between screens
- Follow platform-specific design guidelines

## Examples
```typescript
// Example screen component
const HomeScreen = () => {
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  
  useEffect(() => {
    // Fetch data from application layer
  }, []);
  
  return (
    <View>
      <PhotoList photos={photos} />
    </View>
  );
};
```

## Boundaries
- Screens belong to the UI layer
- Depend on application layer use cases for data and operations
- Coordinate UI components for presentation
- Should not contain business logic
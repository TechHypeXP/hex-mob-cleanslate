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

## PermissionScreen
The PermissionScreen handles photo library permission requests and displays the current permission status to the user. It follows the DDD/Hexagonal architecture by using the PhotoPermissionService for business logic and Redux for state management.

### Features
- Requests photo library permissions from the user
- Displays current permission status
- Shows appropriate messages based on permission state
- Handles loading and error states
- Supports internationalization (i18n)

### Architecture
- **Service Layer**: Uses PhotoPermissionService for permission logic
- **State Management**: Uses Redux for managing permission state
- **Internationalization**: Uses i18next for multi-language support
- **UI Components**: Uses React Native components for presentation

### Dependencies
- PhotoPermissionService (application layer)
- Redux store (infrastructure layer)
- i18next (shared package)

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
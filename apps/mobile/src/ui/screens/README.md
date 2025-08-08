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
- **ImageManagementScreen**: Manages photo library viewing and organization
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

## ImageManagementScreen
The ImageManagementScreen handles photo library management, including viewing, sorting, selecting, and performing actions on photos. It was ported from the legacy-v1 implementation and refactored to follow the DDD/Hexagonal architecture.

### Features
- View photo library with thumbnails
- Sort photos by creation time, modification time, or filename
- Select individual photos or all photos
- Share selected photos
- Supports internationalization (i18n) with English and Arabic
- RTL layout support for Arabic language
- Loading and error states handling

### Architecture
- **State Management**: Uses Redux Toolkit for managing photo library state
- **Internationalization**: Uses i18next for multi-language support
- **UI Components**: Uses React Native components for presentation
- **Domain Layer**: Uses PhotoItem type from shared package
- **Application Layer**: Delegates business logic to application services

### Dependencies
- Redux store (infrastructure layer)
- i18next (shared package)
- PhotoItem type (shared package)

### Legacy Port Information
This screen was ported from the legacy-v1 implementation with the following modernizations:
- Refactored to follow DDD/Hexagonal architecture
- Updated to use Redux Toolkit for state management
- Integrated with i18n for localization
- Added comprehensive unit and integration tests
- Implemented RTL support for Arabic language
- Updated to use modern React patterns and hooks

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
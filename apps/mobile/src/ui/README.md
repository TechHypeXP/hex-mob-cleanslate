# UI Layer

## Responsibility
The UI layer contains all user interface components and presentation logic. It handles user interactions and displays information to users.

## Architectural Purpose
- **User Interaction**: Handle user input and gestures
- **Presentation**: Display data and information to users
- **Navigation**: Manage screen transitions and routing
- **State Presentation**: Show application state to users

## Key Components
- **Screens**: Top-level UI components that represent entire screens
- **Components**: Reusable UI elements like buttons, cards, and forms
- **Navigation**: Routing and screen transition logic
- **Hooks**: Custom React hooks for UI-specific logic

## Developer Guidelines
- Keep UI components focused and reusable
- Separate presentation logic from business logic
- Use React best practices and patterns
- Implement responsive and accessible designs
- Handle user feedback and loading states appropriately

## Boundaries
- Depends on the application layer for data and operations
- Should not contain business logic
- Communicates with application layer through use cases
- Uses domain objects for data presentation
/**
 * Redux Store Configuration
 * 
 * Centralized state management for the CleanSlate Mobile App.
 * Uses Redux Toolkit for simplified configuration and best practices.
 */

import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import permissionsReducer from './permissionsSlice';

// Create store with Redux Toolkit
const store = configureStore({
  reducer: {
    permissions: permissionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Expo MediaLibrary PermissionStatus in serialization check
        ignoredActions: ['permissions/setPhotoLibraryPermission'],
        ignoredPaths: ['permissions.photoLibrary.status'],
      },
    }),
});

// Define root state type
export type RootState = ReturnType<typeof store.getState>;

// Define dispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
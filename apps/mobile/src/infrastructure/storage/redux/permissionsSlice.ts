/**
 * Permissions Slice
 * 
 * Redux slice for managing photo library permissions state.
 * Follows Redux Toolkit patterns for clean, maintainable state management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PermissionStatus } from 'expo-media-library';

// Define the permissions state structure
export interface PermissionsState {
  photoLibrary: {
    status: PermissionStatus;
    canAskAgain: boolean;
    granted: boolean;
    lastChecked: number | null;
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PermissionsState = {
  photoLibrary: {
    status: PermissionStatus.UNDETERMINED,
    canAskAgain: true,
    granted: false,
    lastChecked: null,
  },
  loading: false,
  error: null,
};

// Create the slice
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    // Action to set photo library permission status
    setPhotoLibraryPermission: (
      state,
      action: PayloadAction<{
        status: PermissionStatus;
        canAskAgain: boolean;
        granted: boolean;
      }>
    ) => {
      state.photoLibrary = {
        ...action.payload,
        lastChecked: Date.now(),
      };
      state.loading = false;
    },
    
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Action to set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Action to reset permissions state
    resetPermissions: (state) => {
      state.photoLibrary = initialState.photoLibrary;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setPhotoLibraryPermission,
  setLoading,
  setError,
  resetPermissions,
} = permissionsSlice.actions;

// Export reducer
export default permissionsSlice.reducer;
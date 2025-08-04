/**
 * Photos Slice
 * 
 * Redux slice for managing photo library state.
 * Follows Redux Toolkit patterns for clean, maintainable state management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PhotoItem } from '../../../../../../packages/shared/types/PhotoItem';

// Define the photos state structure
export interface PhotosState {
  photos: PhotoItem[];
  selectedPhotos: string[];
  loading: boolean;
  error: string | null;
  sortBy: 'creationTime' | 'modificationTime' | 'filename';
  sortOrder: 'asc' | 'desc';
  filter: {
    mediaType?: 'photo' | 'video';
    createdAfter?: Date;
    createdBefore?: Date;
    albumIds?: string[];
  };
}

// Initial state
const initialState: PhotosState = {
  photos: [],
  selectedPhotos: [],
  loading: false,
  error: null,
  sortBy: 'creationTime',
  sortOrder: 'desc',
  filter: {}
};

// Create the slice
const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    // Action to set photos
    setPhotos: (state, action: PayloadAction<PhotoItem[]>) => {
      state.photos = action.payload;
      state.loading = false;
    },
    
    // Action to add photos
    addPhotos: (state, action: PayloadAction<PhotoItem[]>) => {
      state.photos = [...state.photos, ...action.payload];
      state.loading = false;
    },
    
    // Action to update a photo
    updatePhoto: (state, action: PayloadAction<PhotoItem>) => {
      const index = state.photos.findIndex(photo => photo.id === action.payload.id);
      if (index !== -1) {
        state.photos[index] = action.payload;
      }
    },
    
    // Action to remove a photo
    removePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(photo => photo.id !== action.payload);
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
    
    // Action to select a photo
    selectPhoto: (state, action: PayloadAction<string>) => {
      if (!state.selectedPhotos.includes(action.payload)) {
        state.selectedPhotos = [...state.selectedPhotos, action.payload];
      }
    },
    
    // Action to deselect a photo
    deselectPhoto: (state, action: PayloadAction<string>) => {
      state.selectedPhotos = state.selectedPhotos.filter(id => id !== action.payload);
    },
    
    // Action to select all photos
    selectAllPhotos: (state) => {
      state.selectedPhotos = state.photos.map(photo => photo.id);
    },
    
    // Action to deselect all photos
    deselectAllPhotos: (state) => {
      state.selectedPhotos = [];
    },
    
    // Action to set sort options
    setSortOptions: (
      state,
      action: PayloadAction<{
        sortBy: 'creationTime' | 'modificationTime' | 'filename';
        sortOrder: 'asc' | 'desc';
      }>
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    
    // Action to set filter options
    setFilter: (
      state,
      action: PayloadAction<{
        mediaType?: 'photo' | 'video';
        createdAfter?: Date;
        createdBefore?: Date;
        albumIds?: string[];
      }>
    ) => {
      state.filter = action.payload;
    },
    
    // Action to reset photos state
    resetPhotos: (state) => {
      state.photos = [];
      state.selectedPhotos = [];
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setPhotos,
  addPhotos,
  updatePhoto,
  removePhoto,
  setLoading,
  setError,
  selectPhoto,
  deselectPhoto,
  selectAllPhotos,
  deselectAllPhotos,
  setSortOptions,
  setFilter,
  resetPhotos,
} = photosSlice.actions;

// Export reducer
export default photosSlice.reducer;
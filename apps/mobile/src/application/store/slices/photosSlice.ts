import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PhotoItem {
  id: string;
  uri: string;
  width: number;
  height: number;
  filename: string;
  creationTime: number;
  mediaType: 'photo' | 'video';
  duration?: number;
}

interface PhotosState {
  currentPhoto: PhotoItem | null;
  photoQueue: PhotoItem[];
  loading: boolean;
  error: string | null;
  totalProcessed: number;
  keptPhotos: string[];
  deletedPhotos: string[];
  sharedPhotos: string[];
  privatizedPhotos: string[];
}

const initialState: PhotosState = {
  currentPhoto: null,
  photoQueue: [],
  loading: false,
  error: null,
  totalProcessed: 0,
  keptPhotos: [],
  deletedPhotos: [],
  sharedPhotos: [],
  privatizedPhotos: [],
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentPhoto: (state, action: PayloadAction<PhotoItem | null>) => {
      state.currentPhoto = action.payload;
    },
    loadNextPhoto: (state) => {
      if (state.photoQueue.length > 0) {
        state.currentPhoto = state.photoQueue.shift() || null;
      }
    },
    addToQueue: (state, action: PayloadAction<PhotoItem[]>) => {
      state.photoQueue.push(...action.payload);
    },
    keepPhoto: (state) => {
      if (state.currentPhoto) {
        state.keptPhotos.push(state.currentPhoto.id);
        state.totalProcessed += 1;
      }
    },
    deletePhoto: (state) => {
      if (state.currentPhoto) {
        state.deletedPhotos.push(state.currentPhoto.id);
        state.totalProcessed += 1;
      }
    },
    sharePhoto: (state) => {
      if (state.currentPhoto) {
        state.sharedPhotos.push(state.currentPhoto.id);
        state.totalProcessed += 1;
      }
    },
    privatizePhoto: (state) => {
      if (state.currentPhoto) {
        state.privatizedPhotos.push(state.currentPhoto.id);
        state.totalProcessed += 1;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setCurrentPhoto,
  loadNextPhoto,
  addToQueue,
  keepPhoto,
  deletePhoto,
  sharePhoto,
  privatizePhoto,
  setError,
} = photosSlice.actions;

export default photosSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// ✅ MODERN: DDD/Hexagonal layer organization
import gamificationReducer from './slices/gamificationSlice';
import photosReducer from './slices/photosSlice';

export const store = configureStore({
  reducer: {
    // ✅ LEGACY UX COMPATIBILITY: State shape matches user expectations
    gamification: gamificationReducer, // streaks, badges, achievements
    photos: photosReducer,             // photo management, queue
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// ✅ MODERN: TypeScript excellence
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Photos selectors
export const selectCurrentPhoto = (state: RootState) => state.photos.currentPhoto;
export const selectPhotosLoading = (state: RootState) => state.photos.loading;
export const selectPhotosError = (state: RootState) => state.photos.error;
export const selectTotalProcessed = (state: RootState) => state.photos.totalProcessed;

// Gamification selectors
export const selectStreakCount = (state: RootState) => state.gamification.streakCount;
export const selectTotalSwipes = (state: RootState) => state.gamification.totalSwipes;
export const selectBadges = (state: RootState) => state.gamification.badges;
export const selectBadgeCount = createSelector(
  [selectBadges],
  (badges) => badges.length
);

// Photo action selectors
export const selectKeptPhotos = (state: RootState) => state.photos.keptPhotos;
export const selectDeletedPhotos = (state: RootState) => state.photos.deletedPhotos;
export const selectSharedPhotos = (state: RootState) => state.photos.sharedPhotos;
export const selectPrivatizedPhotos = (state: RootState) => state.photos.privatizedPhotos;
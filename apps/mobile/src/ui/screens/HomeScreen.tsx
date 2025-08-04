import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Component imports using aliases
import { SwipeCard } from '@components/SwipeCard';
import { selectCurrentPhoto, selectPhotosLoading } from '@shared/store/selectors';
import { loadNextPhoto } from '@shared/store/slices/photosSlice';
import { incrementStreak } from '@shared/store/slices/gamificationSlice';
import { useRequestPermissions } from '@hooks/useRequestPermissions';
import { useHapticFeedback } from '@hooks/useHapticFeedback';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const currentPhoto = useSelector(selectCurrentPhoto);
  const isLoading = useSelector(selectPhotosLoading);
  const { hasPermissions } = useRequestPermissions();
  const { triggerHaptic } = useHapticFeedback();

  // Load initial photo when permissions are granted
  useEffect(() => {
    if (hasPermissions && !currentPhoto) {
      dispatch(loadNextPhoto());
    }
  }, [hasPermissions, currentPhoto, dispatch]);

  const handleSwipeAction = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    // Legacy UX preservation: Haptic feedback on swipe
    triggerHaptic('impactMedium');
    
    // Gamification: Increment streak
    dispatch(incrementStreak());
    
    // Load next photo
    dispatch(loadNextPhoto());
    
    // TODO: Implement direction-specific actions
    // (Keep/Delete/Share/Privatize based on direction)
  }, [dispatch, triggerHaptic]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : currentPhoto ? (
          <Animated.View entering={FadeInDown.duration(500)}>
            <SwipeCard 
              photo={currentPhoto}
              onSwipe={handleSwipeAction}
            />
          </Animated.View>
        ) : (
          <View style={styles.emptyState}>
            {/* Empty state UI */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
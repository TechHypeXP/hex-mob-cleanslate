/**
 * SwipeCard.tsx - Tinder-style swipeable photo card component
 * 
 * Implements native gesture handling with React Native Reanimated for smooth animations.
 * Provides visual feedback for swipe directions and actions.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Types
import { PhotoItem } from '../../packages/shared/types/PhotoItem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = screenHeight * 0.6;
const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.1;

interface SwipeCardProps {
  photo: PhotoItem;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
  isAnimating: boolean;
}

interface SwipeAction {
  direction: 'left' | 'right' | 'up' | 'down';
  icon: string;
  color: string;
  backgroundColor: string;
  label: string;
}

const swipeActions: SwipeAction[] = [
  {
    direction: 'left',
    icon: 'trash-outline',
    color: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    label: 'Delete'
  },
  {
    direction: 'right',
    icon: 'heart-outline',
    color: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    label: 'Keep'
  },
  {
    direction: 'up',
    icon: 'share-outline',
    color: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    label: 'Share'
  },
  {
    direction: 'down',
    icon: 'lock-closed-outline',
    color: '#AF52DE',
    backgroundColor: 'rgba(175, 82, 222, 0.1)',
    label: 'Private'
  }
];

const SwipeCard: React.FC<SwipeCardProps> = ({ photo, onSwipe, isAnimating }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Animated values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  /**
   * Provides haptic feedback for swipe actions
   * @param intensity - Feedback intensity
   */
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    const feedbackMap = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    Haptics.impactAsync(feedbackMap[intensity]);
  };

  /**
   * Determines swipe direction based on gesture
   * @param x - X translation
   * @param y - Y translation
   * @returns Swipe direction or null
   */
  const getSwipeDirection = (x: number, y: number): 'left' | 'right' | 'up' | 'down' | null => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
      return null;
    }
    
    if (absX > absY) {
      return x > 0 ? 'right' : 'left';
    } else {
      return y > 0 ? 'down' : 'up';
    }
  };

  /**
   * Gets the active swipe action based on current translation
   * @param x - X translation
   * @param y - Y translation
   * @returns Active swipe action or null
   */
  const getActiveAction = (x: number, y: number): SwipeAction | null => {
    const direction = getSwipeDirection(x, y);
    return direction ? swipeActions.find(action => action.direction === direction) || null : null;
  };

  /**
   * Pan gesture handler for swipe interactions
   */
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setIsDragging)(true);
      runOnJS(triggerHaptic)('light');
      
      scale.value = withSpring(0.95);
      opacity.value = withTiming(0.8);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Provide haptic feedback when crossing threshold
      const direction = getSwipeDirection(event.translationX, event.translationY);
      if (direction) {
        runOnJS(triggerHaptic)('light');
      }
    },
    onEnd: (event) => {
      const direction = getSwipeDirection(event.translationX, event.translationY);
      
      if (direction) {
        // Animate card off screen
        const exitX = direction === 'left' ? -screenWidth : direction === 'right' ? screenWidth : 0;
        const exitY = direction === 'up' ? -screenHeight : direction === 'down' ? screenHeight : 0;
        
        translateX.value = withTiming(exitX, { duration: 300 });
        translateY.value = withTiming(exitY, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        
        runOnJS(triggerHaptic)('heavy');
        runOnJS(onSwipe)(direction);
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
      }
      
      runOnJS(setIsDragging)(false);
    },
  });

  /**
   * Animated style for the card
   */
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation}deg` },
      ],
      opacity: opacity.value,
    };
  });

  /**
   * Animated style for action overlays
   */
  const getOverlayStyle = (action: SwipeAction) => {
    return useAnimatedStyle(() => {
      let overlayOpacity = 0;
      
      switch (action.direction) {
        case 'left':
          overlayOpacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, -50, 0],
            [1, 0.5, 0],
            Extrapolate.CLAMP
          );
          break;
        case 'right':
          overlayOpacity = interpolate(
            translateX.value,
            [0, 50, SWIPE_THRESHOLD],
            [0, 0.5, 1],
            Extrapolate.CLAMP
          );
          break;
        case 'up':
          overlayOpacity = interpolate(
            translateY.value,
            [-SWIPE_THRESHOLD, -50, 0],
            [1, 0.5, 0],
            Extrapolate.CLAMP
          );
          break;
        case 'down':
          overlayOpacity = interpolate(
            translateY.value,
            [0, 50, SWIPE_THRESHOLD],
            [0, 0.5, 1],
            Extrapolate.CLAMP
          );
          break;
      }

      return {
        opacity: overlayOpacity,
      };
    });
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        enabled={!isAnimating}
      >
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          {/* Photo Image */}
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Action Overlays */}
          {isDragging && swipeActions.map((action) => (
            <Animated.View
              key={action.direction}
              style={[
                styles.overlay,
                { backgroundColor: action.backgroundColor },
                getOverlayStyle(action)
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons 
                  name={action.icon as any} 
                  size={32} 
                  color="white" 
                />
              </View>
              <Text style={[styles.actionLabel, { color: action.color }]}>
                {action.label}
              </Text>
            </Animated.View>
          ))}
          
          {/* Photo Info */}
          <View style={styles.photoInfo}>
            <Text style={styles.filename}>{photo.filename}</Text>
            <Text style={styles.fileSize}>
              {Math.round(photo.fileSize / 1024)} KB
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  filename: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default SwipeCard;
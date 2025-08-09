import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  GestureResponderEvent,
  Animated,
  PanResponder,
  PanResponderInstance
} from 'react-native';

// Import icons for directional overlays
import { Share2, Lock, Check, X, Heart, Trash2 } from 'lucide-react-native';

interface PhotoItem {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  creationTime: number;
  modificationTime: number;
  albumId?: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
  };
  exif?: {
    make?: string;
    model?: string;
    software?: string;
    dateTime?: string;
    dateTimeOriginal?: string;
    dateTimeDigitized?: string;
    orientation?: number;
    xResolution?: number;
    yResolution?: number;
    resolutionUnit?: number;
    flash?: number;
    focalLength?: number;
    iso?: number;
    aperture?: number;
    shutterSpeed?: number;
    whiteBalance?: number;
    exposureMode?: number;
    meteringMode?: number;
    colorSpace?: number;
  };
}

interface SwipeCardProps {
  photo: PhotoItem;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  photo,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}) => {
  const [pan] = useState(new Animated.ValueXY());
  const [isDragging, setIsDragging] = useState(false);
  
  // Create pan responder for swipe gestures
  const panResponder = React.useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.flattenOffset();
        pan.setOffset({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        const { dx, dy } = gestureState;
        const swipeThreshold = 100;
        const velocityThreshold = 500;

        // Determine swipe direction based on gesture
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > swipeThreshold || gestureState.vx > velocityThreshold) {
            // Swipe right - Keep
            if (onSwipeRight) {
              Animated.spring(pan, {
                toValue: { x: 500, y: 0 },
                useNativeDriver: false,
                speed: 20,
                bounciness: 0
              }).start(() => {
                onSwipeRight();
                pan.setValue({ x: 0, y: 0 });
              });
            }
          } else if (dx < -swipeThreshold || gestureState.vx < -velocityThreshold) {
            // Swipe left - Delete
            if (onSwipeLeft) {
              Animated.spring(pan, {
                toValue: { x: -500, y: 0 },
                useNativeDriver: false,
                speed: 20,
                bounciness: 0
              }).start(() => {
                onSwipeLeft();
                pan.setValue({ x: 0, y: 0 });
              });
            }
          } else {
            // Not enough velocity, spring back
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              speed: 10,
              bounciness: 10
            }).start();
          }
        } else {
          // Vertical swipe
          if (dy < -swipeThreshold || gestureState.vy < -velocityThreshold) {
            // Swipe up - Share
            if (onSwipeUp) {
              Animated.spring(pan, {
                toValue: { x: 0, y: -500 },
                useNativeDriver: false,
                speed: 20,
                bounciness: 0
              }).start(() => {
                onSwipeUp();
                pan.setValue({ x: 0, y: 0 });
              });
            }
          } else if (dy > swipeThreshold || gestureState.vy > velocityThreshold) {
            // Swipe down - Private
            if (onSwipeDown) {
              Animated.spring(pan, {
                toValue: { x: 0, y: 500 },
                useNativeDriver: false,
                speed: 20,
                bounciness: 0
              }).start(() => {
                onSwipeDown();
                pan.setValue({ x: 0, y: 0 });
              });
            }
          } else {
            // Not enough velocity, spring back
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              speed: 10,
              bounciness: 10
            }).start();
          }
        }
      }
    })
  ).current;

  // Calculate rotation based on horizontal movement
  const rotate = pan.x.interpolate({
    inputRange: [-200, 200],
    outputRange: ['-15deg', '15deg'],
    extrapolate: 'clamp'
  });

  // Calculate opacity based on distance from center
  const opacity = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [0.4, 1, 0.4],
    extrapolate: 'clamp'
  });

  // Calculate scale based on distance from center
  const scale = pan.x.interpolate({
    inputRange: [-500, 0, 500],
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp'
  });

  // Calculate directional overlay opacities
  const deleteOpacity = pan.x.interpolate({
    inputRange: [-150, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp'
  });

  const keepOpacity = pan.x.interpolate({
    inputRange: [0, 50, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });

  const shareOpacity = pan.y.interpolate({
    inputRange: [-150, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp'
  });

  const privateOpacity = pan.y.interpolate({
    inputRange: [0, 50, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: rotate },
              { scale: scale }
            ],
            opacity: opacity
          }
        ]}
      >
        <Image source={{ uri: photo.uri }} style={styles.image} />
        
        {/* Directional Overlays */}
        {isDragging && (
          <>
            {/* Delete (Left) */}
            <Animated.View 
              style={[styles.overlay, styles.deleteOverlay, { opacity: deleteOpacity }]}
            >
              <View style={styles.overlayIconContainer}>
                <Trash2 size={48} color="#fff" />
              </View>
            </Animated.View>

            {/* Keep (Right) */}
            <Animated.View 
              style={[styles.overlay, styles.keepOverlay, { opacity: keepOpacity }]}
            >
              <View style={styles.overlayIconContainer}>
                <Heart size={48} color="#fff" />
              </View>
            </Animated.View>

            {/* Share (Up) */}
            <Animated.View 
              style={[styles.overlay, styles.shareOverlay, { opacity: shareOpacity }]}
            >
              <View style={styles.overlayIconContainer}>
                <Share2 size={48} color="#fff" />
              </View>
            </Animated.View>

            {/* Private (Down) */}
            <Animated.View 
              style={[styles.overlay, styles.privateOverlay, { opacity: privateOpacity }]}
            >
              <View style={styles.overlayIconContainer}>
                <Lock size={48} color="#fff" />
              </View>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: 300,
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)' // red-500 with opacity
  },
  keepOverlay: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)' // green-500 with opacity
  },
  shareOverlay: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)' // blue-500 with opacity
  },
  privateOverlay: {
    backgroundColor: 'rgba(147, 51, 234, 0.8)' // purple-500 with opacity
  },
  overlayIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 9999,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  }
});
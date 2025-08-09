import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface SwipeOverlayProps {
  direction: SharedValue<'left' | 'right' | 'up' | 'down' | null>;
  gestureDistance: SharedValue<number>;
  isDragging: SharedValue<boolean>;
}

export const SwipeOverlay: React.FC<SwipeOverlayProps> = ({ 
  direction, 
  gestureDistance, 
  isDragging 
}) => {
  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      gestureDistance.value,
      [0, 50, 100],
      [0, 0.4, 0.8],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      gestureDistance.value,
      [0, 50, 100],
      [0.8, 0.9, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: isDragging.value ? opacity : 0,
      transform: [{ scale: scale }],
    };
  });

  const getOverlayColors = (): [string, string] => {
    const currentDirection = direction.value;
    switch (currentDirection) {
      case 'left':
        return ['#FF5252', '#FF1744'];
      case 'right':
        return ['#4CAF50', '#2E7D32'];
      case 'up':
        return ['#2196F3', '#1565C0'];
      case 'down':
        return ['#FF9800', '#E65100'];
      default:
        return ['transparent', 'transparent'];
    }
  };

  const getLabel = (): string => {
    const currentDirection = direction.value;
    switch (currentDirection) {
      case 'left':
        return 'NOPE';
      case 'right':
        return 'LIKE';
      case 'up':
        return 'SHARE';
      case 'down':
        return 'PRIVATE';
      default:
        return '';
    }
  };

  const getRotation = (): string => {
    const currentDirection = direction.value;
    switch (currentDirection) {
      case 'left':
        return '-15deg';
      case 'right':
        return '15deg';
      case 'up':
        return '-10deg';
      case 'down':
        return '10deg';
      default:
        return '0deg';
    }
  };

  const labelStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      gestureDistance.value,
      [0, 100],
      [0, direction.value === 'left' ? -30 : direction.value === 'right' ? 30 : 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX },
        { rotate: getRotation() },
      ],
    } as any;
  });

  if (!direction.value) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <LinearGradient
        colors={getOverlayColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          {getLabel()}
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 8,
  },
});
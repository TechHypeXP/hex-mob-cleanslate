import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { RotateCcw } from 'lucide-react-native';

interface SpinWheelProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth - 48, 280);
const CENTER_SIZE = 32;

export const SpinWheel: React.FC<SpinWheelProps> = ({
  options,
  selectedOption,
  onSelect,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const segmentAngle = 360 / options.length;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Bias towards "Random" (50% chance) - preserving legacy behavior
    const randomIndex = Math.random() < 0.5 && options.includes('Random')
      ? options.indexOf('Random')
      : Math.floor(Math.random() * options.length);

    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation.value + (spins * 360) + (randomIndex * segmentAngle);

    rotation.value = withSpring(
      finalRotation,
      {
        damping: 15,
        stiffness: 100,
        mass: 1,
        velocity: 0,
      },
      (finished) => {
        if (finished) {
          runOnJS(setIsSpinning)(false);
          runOnJS(onSelect)(options[randomIndex]);
        }
      }
    );
  };

  const handleManualSelect = (option: string, index: number) => {
    if (isSpinning) return;

    const targetRotation = rotation.value + (index * segmentAngle) - (rotation.value % 360);

    rotation.value = withTiming(
      targetRotation,
      { duration: 500 },
      (finished) => {
        if (finished) {
          runOnJS(onSelect)(option);
        }
      }
    );
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const spinButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isSpinning ? 0.7 : 1,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Sort Photos</Text>
          <Text style={styles.subtitle}>Choose your sorting preference</Text>
        </View>

        <View style={styles.wheelContainer}>
          {/* Pointer */}
          <View style={styles.pointer} />

          {/* Wheel */}
          <Animated.View style={[styles.wheel, wheelStyle]}>
            {options.map((option, index) => {
              const angle = index * segmentAngle;
              const isSelected = option === selectedOption;

              return (
                <Pressable
                  key={option}
                  onPress={() => handleManualSelect(option, index)}
                  disabled={isSpinning}
                  style={[
                    styles.segment,
                    {
                      transform: [{ rotate: `${angle}deg` }],
                      backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: isSelected ? '#FFFFFF' : '#374151',
                        transform: [{ rotate: `${-angle}deg` }],
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          {/* Center Circle */}
          <View style={styles.centerCircle} />
        </View>

        {/* Feeling Lucky Button */}
        <Animated.View style={[styles.spinButtonContainer, spinButtonStyle]}>
          <Pressable
            onPress={handleSpin}
            disabled={isSpinning}
            style={({ pressed }) => [
              styles.spinButton,
              pressed && styles.spinButtonPressed,
              isSpinning && styles.spinButtonDisabled,
            ]}
          >
            <RotateCcw
              size={20}
              color="#FFFFFF"
              style={[isSpinning && styles.spinIcon]}
            />
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Spinning...' : 'Feeling Lucky?'}
            </Text>
          </Pressable>
        </Animated.View>

        <Pressable
          onPress={onClose}
          disabled={isSpinning}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
            isSpinning && styles.cancelButtonDisabled,
          ]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  wheelContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pointer: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3B82F6',
    zIndex: 10,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: '#F9FAFB',
    borderWidth: 4,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    top: 0,
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: WHEEL_SIZE / 2,
    borderBottomRightRadius: 0,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  centerCircle: {
    position: 'absolute',
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    backgroundColor: '#3B82F6',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spinButtonContainer: {
    marginBottom: 16,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spinButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  spinButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spinIcon: {
    transform: [{ rotate: '360deg' }],
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
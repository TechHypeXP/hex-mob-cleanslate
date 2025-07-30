/**
 * SpinWheel.tsx - Interactive spinning wheel component for sorting options
 * 
 * Implements a physics-based spinning wheel with React Native Reanimated for smooth animations.
 * Provides both manual selection and random spinning functionality.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SpinWheelProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(screenWidth * 0.8, 300);
const POINTER_SIZE = 20;
const CENTER_CIRCLE_SIZE = 30;

const SpinWheel: React.FC<SpinWheelProps> = ({ options, selectedOption, onSelect, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const rotation = useSharedValue(0);
  const segmentAngle = 360 / options.length;

  /**
   * Handles the spinning animation
   */
  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Bias towards "Random" (50% chance)
    const randomIndex = Math.random() < 0.5 && options.includes('Random') 
      ? options.indexOf('Random')
      : Math.floor(Math.random() * options.length);
    
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation.value + (spins * 360) + (randomIndex * segmentAngle);
    
    rotation.value = withTiming(finalRotation, { duration: 3000 }, (finished: boolean) => {
      if (finished) {
        runOnJS(setIsSpinning)(false);
        runOnJS(onSelect)(options[randomIndex]);
      }
    });
  };

  /**
   * Handles manual selection of an option
   * @param option - Selected option
   * @param index - Index of the option
   */
  const handleManualSelect = (option: string, index: number) => {
    if (isSpinning) return;
    
    const targetRotation = rotation.value + (index * segmentAngle) - (rotation.value % 360);
    rotation.value = withSpring(targetRotation, {}, () => {
      runOnJS(onSelect)(option);
    });
  };

  /**
   * Animated style for the wheel
   */
  const wheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  /**
   * Gets the color for a segment based on its position
   * @param index - Segment index
   * @returns Background color
   */
  const getSegmentColor = (index: number): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
      '#FB5607', '#8338EC', '#3A86FF', '#06D6A0'
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sort Photos</Text>
          <Text style={styles.subtitle}>Choose your sorting preference</Text>
        </View>
        
        {/* Wheel Container */}
        <View style={styles.wheelContainer}>
          {/* Pointer */}
          <View style={styles.pointerContainer}>
            <View style={styles.pointer} />
          </View>
          
          {/* Wheel */}
          <Animated.View style={[styles.wheel, wheelStyle]}>
            {options.map((option, index) => {
              const angle = index * segmentAngle;
              const isSelected = option === selectedOption;
              const backgroundColor = getSegmentColor(index);
              
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleManualSelect(option, index)}
                  disabled={isSpinning}
                  style={[
                    styles.segment,
                    {
                      backgroundColor,
                      transform: [
                        { rotate: `${angle}deg` },
                        { skewY: `${-segmentAngle/2}deg` }
                      ],
                      width: WHEEL_SIZE,
                      height: WHEEL_SIZE,
                      left: -WHEEL_SIZE/2,
                      top: -WHEEL_SIZE/2,
                    }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.segmentText,
                      {
                        transform: [
                          { rotate: `${-angle}deg` },
                          { skewY: `${segmentAngle/2}deg` }
                        ]
                      }
                    ]}
                  >
                    {option}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
            
            {/* Center Circle */}
            <View style={styles.centerCircle} />
          </Animated.View>
        </View>
        
        {/* Spin Button */}
        <TouchableOpacity 
          onPress={handleSpin}
          disabled={isSpinning}
          style={[
            styles.spinButton,
            isSpinning && styles.spinButtonDisabled
          ]}
        >
          <View style={styles.spinButtonContent}>
            <Ionicons 
              name={isSpinning ? "sync" : "sync-outline"} 
              size={20} 
              color="white" 
              style={isSpinning ? styles.spinIcon : undefined}
            />
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Spinning...' : 'Feeling Lucky?'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Cancel Button */}
        <TouchableOpacity 
          onPress={onClose}
          disabled={isSpinning}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerContainer: {
    position: 'absolute',
    top: -POINTER_SIZE,
    left: WHEEL_SIZE/2 - POINTER_SIZE/2,
    zIndex: 10,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: POINTER_SIZE/2,
    borderRightWidth: POINTER_SIZE/2,
    borderBottomWidth: POINTER_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007AFF',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE/2,
    overflow: 'hidden',
    position: 'relative',
  },
  segment: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'center',
  },
  segmentText: {
    position: 'absolute',
    left: WHEEL_SIZE/2 + 20,
    top: WHEEL_SIZE/2 - 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    width: 80,
  },
  centerCircle: {
    position: 'absolute',
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    borderRadius: CENTER_CIRCLE_SIZE/2,
    backgroundColor: '#007AFF',
    top: WHEEL_SIZE/2 - CENTER_CIRCLE_SIZE/2,
    left: WHEEL_SIZE/2 - CENTER_CIRCLE_SIZE/2,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  spinButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  spinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinIcon: {
    transform: [{ rotate: '360deg' }],
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f2f2f7',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpinWheel;
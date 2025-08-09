import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { X, Clock, Calendar, Aperture, Shuffle } from 'lucide-react-native';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

interface SortOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const sortOptions: SortOption[] = [
  {
    id: 'date',
    label: 'Date Taken',
    icon: Calendar,
    description: 'Sort by when photos were taken',
  },
  {
    id: 'size',
    label: 'File Size',
    icon: Aperture,
    description: 'Sort by file size (largest first)',
  },
  {
    id: 'recent',
    label: 'Recently Added',
    icon: Clock,
    description: 'Sort by when photos were added',
  },
  {
    id: 'random',
    label: 'Random',
    icon: Shuffle,
    description: 'Randomize photo order',
  },
];

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  currentSort,
  onSortChange,
}) => {
  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withSpring(400, {
        damping: 25,
        stiffness: 200,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Sort Photos</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {sortOptions.map((option) => (
            <SortOptionItem
              key={option.id}
              option={option}
              isSelected={currentSort === option.id}
              onPress={() => {
                onSortChange(option.id);
                onClose();
              }}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

interface SortOptionItemProps {
  option: SortOption;
  isSelected: boolean;
  onPress: () => void;
}

const SortOptionItem: React.FC<SortOptionItemProps> = ({
  option,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 20,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
  };

  const Icon = option.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.optionContainer}
    >
      <Animated.View style={[styles.optionContent, animatedStyle]}>
        <View style={styles.optionLeft}>
          <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
            <Icon size={20} color={isSelected ? '#007AFF' : '#8E8E93'} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
              {option.label}
            </Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
        </View>
        {isSelected && <View style={styles.selectedIndicator} />}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingVertical: 8,
  },
  optionContainer: {
    paddingHorizontal: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerSelected: {
    backgroundColor: '#007AFF20',
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
  },
  optionLabelSelected: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    fontFamily: 'SF Pro Display',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SortModal;
import React from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { PhotoItem } from '../../domain/PhotoModel';

interface SwipeCardProps {
  photo: PhotoItem;
  onSwipeLeft?: (event: GestureResponderEvent) => void;
  onSwipeRight?: (event: GestureResponderEvent) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  photo,
  onSwipeLeft,
  onSwipeRight 
}) => {
  return (
    <View style={styles.container}>
      {/* Legacy rendering logic adapted for new PhotoModel */}
      <Image source={{ uri: photo.uri }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ... },
  image: { ... }
});
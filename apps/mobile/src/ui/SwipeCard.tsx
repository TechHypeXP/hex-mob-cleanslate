import React from 'react';
import { GestureResponderEvent, Image, StyleSheet, View } from 'react-native';
import { PhotoItem } from '../../../domain/PhotoModel';

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    resizeMode: 'cover'
  }
});
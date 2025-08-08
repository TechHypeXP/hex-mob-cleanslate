import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SwipeCard } from './ui/components/SwipeCard';
import { SpinWheel } from './ui/components/SpinWheel';
import TabNavigation from './ui/navigation/TabNavigation';
import SortModal from './ui/components/SortModal';

interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  date: Date;
  size: number;
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    uri: 'https://picsum.photos/400/600?random=1',
    width: 400,
    height: 600,
    date: new Date('2024-01-15'),
    size: 2048000,
  },
  {
    id: '2',
    uri: 'https://picsum.photos/400/600?random=2',
    width: 400,
    height: 600,
    date: new Date('2024-01-14'),
    size: 1536000,
  },
  {
    id: '3',
    uri: 'https://picsum.photos/400/600?random=3',
    width: 400,
    height: 600,
    date: new Date('2024-01-13'),
    size: 3072000,
  },
  {
    id: '4',
    uri: 'https://picsum.photos/400/600?random=4',
    width: 400,
    height: 600,
    date: new Date('2024-01-12'),
    size: 1024000,
  },
  {
    id: '5',
    uri: 'https://picsum.photos/400/600?random=5',
    width: 400,
    height: 600,
    date: new Date('2024-01-11'),
    size: 2560000,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('clean');
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    sortPhotos(sortBy);
  }, [sortBy]);

  const sortPhotos = (sortType: string) => {
    const sorted = [...mockPhotos];
    switch (sortType) {
      case 'date':
        sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'size':
        sorted.sort((a, b) => b.size - a.size);
        break;
      case 'recent':
        sorted.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'random':
        sorted.sort(() => Math.random() - 0.5);
        break;
    }
    setPhotos(sorted);
    setCurrentPhotoIndex(0);
  };

  const handleSwipeLeft = () => {
    // Move to next photo (delete action)
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const handleSwipeRight = () => {
    // Move to next photo (keep action)
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const handleSwipeUp = () => {
    // Show spin wheel
    setShowSpinWheel(true);
  };

  const handleSwipeDown = () => {
    // Show sort modal
    setShowSortModal(true);
  };

  const handleSpinWheelResult = (result: string) => {
    setShowSpinWheel(false);
    if (result === 'Random') {
      setSortBy('random');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clean':
        return (
          <View style={styles.contentContainer}>
            {currentPhotoIndex < photos.length && (
              <SwipeCard
                photo={photos[currentPhotoIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                onSwipeDown={handleSwipeDown}
              />
            )}
          </View>
        );
      case 'gallery':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Gallery View</Text>
          </View>
        );
      case 'stats':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Stats View</Text>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.placeholderText}>Settings View</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            {renderContent()}
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </View>
        </SafeAreaView>

        <SpinWheel
          options={['Date', 'Size', 'Recent', 'Random']}
          selectedOption={sortBy}
          onSelect={handleSpinWheelResult}
          onClose={() => setShowSpinWheel(false)}
        />

        <SortModal
          visible={showSortModal}
          onClose={() => setShowSortModal(false)}
          currentSort={sortBy}
          onSortChange={setSortBy}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'SF Pro Display',
  },
});
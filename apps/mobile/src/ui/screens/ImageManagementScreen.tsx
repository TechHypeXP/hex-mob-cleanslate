/**
 * Image Management Screen
 * 
 * This screen handles photo library management, including viewing, sorting,
 * selecting, and performing actions on photos. It follows the DDD/Hexagonal
 * architecture by using Redux for state management and i18n for localization.
 * 
 * Architectural Boundaries:
 * - Uses Redux for state management (infrastructure layer)
 * - Uses i18n for localization (infrastructure layer)
 * - Handles UI presentation and user interaction (ui layer)
 * - Delegates business logic to application services
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Import Redux actions and types
import { 
  setPhotos, 
  setLoading, 
  setError, 
  selectPhoto, 
  deselectPhoto, 
  selectAllPhotos, 
  deselectAllPhotos,
  setSortOptions
} from '../../infrastructure/storage/redux/photosSlice';
import { RootState } from '../../infrastructure/storage/redux/store';

// Import shared types
import { PhotoItem } from '../../../../../packages/shared/types/PhotoItem';

// Import UI components
import { SwipeCard } from '../SwipeCard';

const ImageManagementScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { photos, selectedPhotos, loading, error, sortBy, sortOrder } = useSelector((state: RootState) => state.photos);
  
  // Load photos on component mount
  useEffect(() => {
    loadPhotos();
  }, []);

  /**
   * Load photos from photo library
   */
  const loadPhotos = async () => {
    try {
      dispatch(setLoading(true));
      
      // TODO: Implement actual photo loading using Expo MediaLibrary
      // This is a placeholder implementation
      const mockPhotos: PhotoItem[] = [
        {
          id: '1',
          uri: 'https://picsum.photos/300/400?random=1',
          filename: 'photo1.jpg',
          width: 300,
          height: 400,
          fileSize: 1024000,
          mimeType: 'image/jpeg',
          creationTime: Date.now() - 86400000, // 1 day ago
          modificationTime: Date.now() - 86400000,
        },
        {
          id: '2',
          uri: 'https://picsum.photos/300/400?random=2',
          filename: 'photo2.jpg',
          width: 300,
          height: 400,
          fileSize: 2048000,
          mimeType: 'image/jpeg',
          creationTime: Date.now() - 172800000, // 2 days ago
          modificationTime: Date.now() - 172800000,
        },
        {
          id: '3',
          uri: 'https://picsum.photos/300/400?random=3',
          filename: 'photo3.jpg',
          width: 300,
          height: 400,
          fileSize: 1536000,
          mimeType: 'image/jpeg',
          creationTime: Date.now() - 259200000, // 3 days ago
          modificationTime: Date.now() - 259200000,
        }
      ];
      
      dispatch(setPhotos(mockPhotos));
    } catch (err) {
      dispatch(setError('Failed to load photos'));
      console.error('Photo loading error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Handle photo selection
   */
  const handlePhotoSelect = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      dispatch(deselectPhoto(photoId));
    } else {
      dispatch(selectPhoto(photoId));
    }
  };

  /**
   * Handle select all photos
   */
  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      dispatch(deselectAllPhotos());
    } else {
      dispatch(selectAllPhotos());
    }
  };

  /**
   * Handle sort option change
   */
  const handleSortChange = (newSortBy: 'creationTime' | 'modificationTime' | 'filename') => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOptions({ sortBy: newSortBy, sortOrder: newSortOrder }));
  };

  /**
   * Render photo item
   */
  const renderPhotoItem = ({ item }: { item: PhotoItem }) => {
    return (
      <View style={styles.photoItem}>
        <SwipeCard photo={item} />
        <TouchableOpacity 
          style={[
            styles.selectButton,
            selectedPhotos.includes(item.id) && styles.selectedButton
          ]}
          onPress={() => handlePhotoSelect(item.id)}
        >
          <Text style={[
            styles.selectButtonText,
            selectedPhotos.includes(item.id) && styles.selectedButtonText
          ]}>
            {selectedPhotos.includes(item.id) ? t('common.selected') : t('common.select')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Render sort options
   */
  const renderSortOptions = () => {
    return (
      <View style={styles.sortContainer}>
        <Text style={styles.sortTitle}>{t('clean.sortButton', { sortOrder: t(`sort.options.${sortOrder === 'asc' ? 'oldestFirst' : 'newestFirst'}`) })}</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => handleSortChange('creationTime')}
          >
            <Text style={styles.sortButtonText}>
              {t('sort.options.oldestFirst')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => handleSortChange('filename')}
          >
            <Text style={styles.sortButtonText}>
              {t('sort.options.byLocation')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Render header with selection controls
   */
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{t('gallery.title')}</Text>
        <Text style={styles.subtitle}>
          {t('gallery.totalImages', { selected: selectedPhotos.length })}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleSelectAll}
          >
            <Text style={styles.headerButtonText}>
              {selectedPhotos.length === photos.length ? t('common.deselect') : t('common.selectAll')}
            </Text>
          </TouchableOpacity>
          
          {selectedPhotos.length > 0 && (
            <TouchableOpacity 
              style={[styles.headerButton, styles.actionButton]}
              onPress={() => Alert.alert(t('common.share'), t('gallery.selectPhotos'))}
            >
              <Text style={styles.headerButtonText}>
                {t('common.share')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadPhotos}
        >
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSortOptions()}
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.photoList}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>{t('gallery.title')}</Text>
          </View>
        }
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButton: {
    backgroundColor: '#4caf50',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sortContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sortButton: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 5,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  photoList: {
    padding: 10,
  },
  photoItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    minWidth: 80,
  },
  selectedButton: {
    backgroundColor: '#2196f3',
  },
  selectButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButtonText: {
    color: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ImageManagementScreen;
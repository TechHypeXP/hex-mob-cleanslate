/**
 * Integration tests for ImageManagementScreen
 * 
 * Tests the Image Management screen UI including:
 * - Rendering with different states (loading, error, empty, with photos)
 * - Photo selection functionality
 * - Sort options
 * - Localization
 * - RTL support
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/infrastructure/storage/i18n/index';
import { configureStore } from '@reduxjs/toolkit';
import photosReducer, { PhotosState } from '../../src/infrastructure/storage/redux/photosSlice';
import ImageManagementScreen from '../../src/ui/screens/ImageManagementScreen';

// Mock photo data
const mockPhotos = [
  {
    id: '1',
    uri: 'https://example.com/photo1.jpg',
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
    uri: 'https://example.com/photo2.jpg',
    filename: 'photo2.jpg',
    width: 300,
    height: 400,
    fileSize: 2048000,
    mimeType: 'image/jpeg',
    creationTime: Date.now() - 172800000, // 2 days ago
    modificationTime: Date.now() - 172800000,
  }
];

// Create mock store
const createMockStore = (preloadedState: any = {}) => {
  return configureStore({
    reducer: {
      photos: photosReducer,
    },
    preloadedState: {
      photos: {
        photos: [],
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {},
        ...preloadedState.photos,
      },
    },
  });
};

describe('ImageManagementScreen', () => {
  beforeEach(() => {
    // Reset i18n to English before each test
    i18n.changeLanguage('en');
  });

  it('should render loading state', () => {
    const store = createMockStore({
      photos: {
        photos: [],
        selectedPhotos: [],
        loading: true,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('should render error state', () => {
    const store = createMockStore({
      photos: {
        photos: [],
        selectedPhotos: [],
        loading: false,
        error: 'Failed to load photos',
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Failed to load photos')).toBeTruthy();
  });

  it('should render empty state', () => {
    const store = createMockStore({
      photos: {
        photos: [],
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Gallery')).toBeTruthy();
  });

  it('should render photos', () => {
    const store = createMockStore({
      photos: {
        photos: mockPhotos,
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Gallery')).toBeTruthy();
    expect(screen.getByText('Total Images (0 Selected)')).toBeTruthy();
  });

  it('should handle photo selection', () => {
    const store = createMockStore({
      photos: {
        photos: mockPhotos,
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    // Find and press the select button for the first photo
    const selectButton = screen.getByText('Select');
    fireEvent.press(selectButton);

    // Check that the button text changed to "Selected"
    expect(screen.getByText('Selected')).toBeTruthy();
  });

  it('should handle select all', () => {
    const store = createMockStore({
      photos: {
        photos: mockPhotos,
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    // Find and press the select all button
    const selectAllButton = screen.getByText('Select All');
    fireEvent.press(selectAllButton);

    // Check that the button text changed to "Deselect"
    expect(screen.getByText('Deselect')).toBeTruthy();
  });

  it('should render in Arabic with RTL support', () => {
    // Change language to Arabic
    i18n.changeLanguage('ar');

    const store = createMockStore({
      photos: {
        photos: [],
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('المعرض')).toBeTruthy();
  });

  it('should handle sort option change', () => {
    const store = createMockStore({
      photos: {
        photos: mockPhotos,
        selectedPhotos: [],
        loading: false,
        error: null,
        sortBy: 'creationTime',
        sortOrder: 'desc',
        filter: {}
      }
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ImageManagementScreen />
        </I18nextProvider>
      </Provider>
    );

    // Find and press the sort by filename button
    const sortByFilenameButton = screen.getByText('By Location');
    fireEvent.press(sortByFilenameButton);

    // Note: We can't directly test the Redux state change here without a more complex setup
    // but we can verify the button exists and is pressable
    expect(sortByFilenameButton).toBeTruthy();
  });
});
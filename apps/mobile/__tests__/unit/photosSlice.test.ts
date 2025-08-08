/**
 * Unit tests for photos slice
 * 
 * Tests the Redux slice functionality for photo management including:
 * - Setting photos
 * - Adding photos
 * - Updating photos
 * - Removing photos
 * - Selection management
 * - Sorting and filtering
 */

import photosReducer, {
  setPhotos,
  addPhotos,
  updatePhoto,
  removePhoto,
  setLoading,
  setError,
  selectPhoto,
  deselectPhoto,
  selectAllPhotos,
  deselectAllPhotos,
  setSortOptions,
  setFilter,
  resetPhotos,
  PhotosState
} from '../../src/infrastructure/storage/redux/photosSlice';
import { PhotoItem } from '../../../../packages/shared/types/PhotoItem';

// Mock photo data
const mockPhotos: PhotoItem[] = [
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

describe('photosSlice', () => {
  const initialState: PhotosState = {
    photos: [],
    selectedPhotos: [],
    loading: false,
    error: null,
    sortBy: 'creationTime',
    sortOrder: 'desc',
    filter: {}
  };

  it('should handle initial state', () => {
    expect(photosReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPhotos', () => {
    const actual = photosReducer(initialState, setPhotos(mockPhotos));
    expect(actual.photos).toEqual(mockPhotos);
    expect(actual.loading).toBe(false);
  });

  it('should handle addPhotos', () => {
    const stateWithPhotos = { ...initialState, photos: [mockPhotos[0]] };
    const actual = photosReducer(stateWithPhotos, addPhotos([mockPhotos[1]]));
    expect(actual.photos).toEqual(mockPhotos);
    expect(actual.loading).toBe(false);
  });

  it('should handle updatePhoto', () => {
    const stateWithPhotos = { ...initialState, photos: mockPhotos };
    const updatedPhoto = { ...mockPhotos[0], filename: 'updated-photo1.jpg' };
    const actual = photosReducer(stateWithPhotos, updatePhoto(updatedPhoto));
    expect(actual.photos[0].filename).toBe('updated-photo1.jpg');
  });

  it('should handle removePhoto', () => {
    const stateWithPhotos = { ...initialState, photos: mockPhotos };
    const actual = photosReducer(stateWithPhotos, removePhoto('1'));
    expect(actual.photos).toEqual([mockPhotos[1]]);
  });

  it('should handle setLoading', () => {
    const actual = photosReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Failed to load photos';
    const actual = photosReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
    expect(actual.loading).toBe(false);
  });

  it('should handle selectPhoto', () => {
    const actual = photosReducer(initialState, selectPhoto('1'));
    expect(actual.selectedPhotos).toEqual(['1']);
  });

  it('should handle deselectPhoto', () => {
    const stateWithSelected = { ...initialState, selectedPhotos: ['1', '2'] };
    const actual = photosReducer(stateWithSelected, deselectPhoto('1'));
    expect(actual.selectedPhotos).toEqual(['2']);
  });

  it('should handle selectAllPhotos', () => {
    const stateWithPhotos = { ...initialState, photos: mockPhotos };
    const actual = photosReducer(stateWithPhotos, selectAllPhotos());
    expect(actual.selectedPhotos).toEqual(['1', '2']);
  });

  it('should handle deselectAllPhotos', () => {
    const stateWithSelected = { ...initialState, selectedPhotos: ['1', '2'] };
    const actual = photosReducer(stateWithSelected, deselectAllPhotos());
    expect(actual.selectedPhotos).toEqual([]);
  });

  it('should handle setSortOptions', () => {
    const sortOptions = { sortBy: 'filename' as const, sortOrder: 'asc' as const };
    const actual = photosReducer(initialState, setSortOptions(sortOptions));
    expect(actual.sortBy).toBe('filename');
    expect(actual.sortOrder).toBe('asc');
  });

  it('should handle setFilter', () => {
    const filter = { mediaType: 'photo' as const, createdAfter: new Date() };
    const actual = photosReducer(initialState, setFilter(filter));
    expect(actual.filter).toEqual(filter);
  });

  it('should handle resetPhotos', () => {
    const stateWithPhotos = {
      ...initialState,
      photos: mockPhotos,
      selectedPhotos: ['1'],
      loading: true,
      error: 'Error'
    };
    const actual = photosReducer(stateWithPhotos, resetPhotos());
    expect(actual).toEqual(initialState);
  });
});
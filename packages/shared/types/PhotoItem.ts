/**
 * PhotoItem.ts - Shared type definitions for photo items
 * 
 * Common interfaces used across the application for photo management.
 * Provides type safety and consistency between different layers.
 */

export interface PhotoItem {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  creationTime: number;
  modificationTime: number;
  albumId?: string;
  location?: PhotoLocation;
  exif?: PhotoExif;
}

export interface PhotoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface PhotoExif {
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  orientation?: number;
  xResolution?: number;
  yResolution?: number;
  resolutionUnit?: number;
  flash?: number;
  focalLength?: number;
  iso?: number;
  aperture?: number;
  shutterSpeed?: number;
  whiteBalance?: number;
  exposureMode?: number;
  meteringMode?: number;
  colorSpace?: number;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  assetCount: number;
  type: 'album' | 'moment' | 'smartAlbum';
  subtype?: string;
  startTime?: number;
  endTime?: number;
  approximateLocation?: PhotoLocation;
}

export interface PhotoAsset {
  id: string;
  filename: string;
  uri: string;
  mediaType: 'photo' | 'video' | 'audio' | 'unknown';
  mediaSubtypes: string[];
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration: number;
  albumId?: string;
}

export interface PhotoPermissions {
  accessPrivileges: 'all' | 'limited' | 'none';
  allowsSelectionPrompt: boolean;
  canAskForMorePermissions: boolean;
  granted: boolean;
  expires: 'never' | number;
  status: 'undetermined' | 'denied' | 'authorized' | 'limited';
}

export interface PhotoLibraryInfo {
  totalAssets: number;
  photoCount: number;
  videoCount: number;
  totalSize: number;
  oldestAsset?: PhotoAsset;
  newestAsset?: PhotoAsset;
  permissions: PhotoPermissions;
}

export interface PhotoProcessingResult {
  id: string;
  action: 'keep' | 'delete' | 'share' | 'private';
  timestamp: Date;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface PhotoBatch {
  id: string;
  photos: PhotoItem[];
  createdAt: Date;
  processedCount: number;
  totalCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PhotoFilter {
  mediaType?: 'photo' | 'video';
  createdAfter?: Date;
  createdBefore?: Date;
  albumIds?: string[];
  sortBy?: 'creationTime' | 'modificationTime' | 'filename';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PhotoStats {
  totalPhotos: number;
  totalSize: number;
  averageSize: number;
  oldestPhoto?: Date;
  newestPhoto?: Date;
  photosByYear: Record<string, number>;
  photosByMonth: Record<string, number>;
  photosByAlbum: Record<string, number>;
  duplicateCount: number;
  lowQualityCount: number;
  screenshotCount: number;
}

export interface PhotoCleaningSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  photosProcessed: number;
  actionsPerformed: {
    keep: number;
    delete: number;
    share: number;
    private: number;
  };
  timeSpent: number; // in seconds
  efficiency: number; // photos per minute
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

export interface PhotoSortOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  sortFunction: (a: PhotoItem, b: PhotoItem) => number;
}

export const DEFAULT_SORT_OPTIONS: PhotoSortOption[] = [
  {
    id: 'oldest_first',
    label: 'Oldest First',
    description: 'Start with your oldest photos',
    icon: '📅',
    sortFunction: (a, b) => a.creationTime - b.creationTime
  },
  {
    id: 'newest_first',
    label: 'Newest First',
    description: 'Start with your newest photos',
    icon: '🆕',
    sortFunction: (a, b) => b.creationTime - a.creationTime
  },
  {
    id: 'random',
    label: 'Random',
    description: 'Mix it up with random order',
    icon: '🎲',
    sortFunction: () => Math.random() - 0.5
  },
  {
    id: 'by_location',
    label: 'By Location',
    description: 'Group photos by location',
    icon: '📍',
    sortFunction: (a, b) => {
      if (!a.location && !b.location) return 0;
      if (!a.location) return 1;
      if (!b.location) return -1;
      return a.location.latitude - b.location.latitude;
    }
  }
];
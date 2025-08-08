/**
 * PhotoPermissionService Unit Tests
 * 
 * Tests for the PhotoPermissionService class that handles
 * photo library permissions using Expo APIs.
 */

import { PhotoPermissionService, PermissionResult } from '../../src/application/services/PhotoPermissionService';
import * as MediaLibrary from 'expo-media-library';

// Mock expo-media-library
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
}));

describe('PhotoPermissionService', () => {
  let service: PhotoPermissionService;
  
  beforeEach(() => {
    service = new PhotoPermissionService();
    jest.clearAllMocks();
  });
  
  describe('requestPhotoPermissions', () => {
    it('should return granted permission when user grants access', async () => {
      // Arrange
      const mockResult = { status: 'granted', canAskAgain: true };
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue(mockResult);
      
      // Act
      const result: PermissionResult = await service.requestPhotoPermissions();
      
      // Assert
      expect(result).toEqual({
        status: 'granted',
        canAskAgain: true,
        granted: true,
      });
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });
    
    it('should return denied permission when user denies access', async () => {
      // Arrange
      const mockResult = { status: 'denied', canAskAgain: true };
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue(mockResult);
      
      // Act
      const result: PermissionResult = await service.requestPhotoPermissions();
      
      // Assert
      expect(result).toEqual({
        status: 'denied',
        canAskAgain: true,
        granted: false,
      });
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });
    
    it('should handle permission request errors gracefully', async () => {
      // Arrange
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Permission error'));
      
      // Act
      const result: PermissionResult = await service.requestPhotoPermissions();
      
      // Assert
      expect(result).toEqual({
        status: 'undetermined',
        canAskAgain: true,
        granted: false,
      });
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('checkPhotoPermissions', () => {
    it('should return current permission status', async () => {
      // Arrange
      const mockResult = { status: 'granted', canAskAgain: true };
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue(mockResult);
      
      // Act
      const result: PermissionResult = await service.checkPhotoPermissions();
      
      // Assert
      expect(result).toEqual({
        status: 'granted',
        canAskAgain: true,
        granted: true,
      });
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledTimes(1);
    });
    
    it('should handle permission check errors gracefully', async () => {
      // Arrange
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Permission error'));
      
      // Act
      const result: PermissionResult = await service.checkPhotoPermissions();
      
      // Assert
      expect(result).toEqual({
        status: 'undetermined',
        canAskAgain: true,
        granted: false,
      });
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledTimes(1);
    });
  });
});
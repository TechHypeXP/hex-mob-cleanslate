/**
 * PhotoPermissionService - Application Service
 * 
 * This service handles photo library permissions using Expo APIs.
 * It follows the DDD/Hexagonal architecture by separating business logic
 * from infrastructure concerns and providing a clean interface for UI layers.
 * 
 * Architectural Boundaries:
 * - Exposes permission logic only (no UI concerns)
 * - Uses infrastructure adapters (Expo APIs) for platform-specific operations
 * - Returns structured results for UI layers to handle user interaction
 */

import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';

// Types for permission results
export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
  granted: boolean;
}

export interface PhotoPermissionServiceInterface {
  requestPhotoPermissions(): Promise<PermissionResult>;
  checkPhotoPermissions(): Promise<PermissionResult>;
}

/**
 * Photo Permission Service Implementation
 * 
 * Handles photo library permissions for both iOS and Android platforms.
 * Follows privacy best practices by only requesting necessary permissions
 * and providing clear status information to UI layers.
 */
export class PhotoPermissionService implements PhotoPermissionServiceInterface {
  
  /**
   * Request photo library permissions from the user
   * 
   * This method will show the platform-specific permission dialog
   * to request access to the photo library.
   * 
   * @returns Promise<PermissionResult> - Permission status and metadata
   */
  async requestPhotoPermissions(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      return {
        status,
        canAskAgain,
        granted: status === PermissionStatus.GRANTED
      };
    } catch (error) {
      // Log permission request errors (privacy-safe)
      console.warn('Permission request failed:', error);
      
      return {
        status: PermissionStatus.UNDETERMINED,
        canAskAgain: true,
        granted: false
      };
    }
  }

  /**
   * Check current photo library permission status
   * 
   * This method checks the current permission status without
   * showing any permission dialogs to the user.
   * 
   * @returns Promise<PermissionResult> - Current permission status and metadata
   */
  async checkPhotoPermissions(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync();
      return {
        status,
        canAskAgain,
        granted: status === PermissionStatus.GRANTED
      };
    } catch (error) {
      // Log permission check errors (privacy-safe)
      console.error('Permission check error:', error);
      
      return {
        status: PermissionStatus.UNDETERMINED,
        canAskAgain: true,
        granted: false
      };
    }
  }
}
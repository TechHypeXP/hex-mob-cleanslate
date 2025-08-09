/**
 * PermissionStatus.ts - Shared type definitions for permission status
 * 
 * Common interfaces used across the application for permission management.
 * Provides type safety and consistency between different layers.
 */

export enum PermissionStatus {
  UNDETERMINED = 'undetermined',
  DENIED = 'denied',
  AUTHORIZED = 'authorized',
  LIMITED = 'limited',
  ERROR = 'error'
}

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
  granted: boolean;
}
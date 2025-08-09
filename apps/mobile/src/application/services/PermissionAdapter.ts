import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from '@shared/types/PermissionStatus';

export interface IPermissionAdapter {
  requestPermission(): Promise<{ status: PermissionStatus }>;
  hasPermission(): Promise<boolean>;
}

export class ExpoPermissionAdapter implements IPermissionAdapter {
  private mediaLibrary = MediaLibrary;

  async requestPermission(): Promise<{ status: PermissionStatus }> {
    try {
      const { status } = await this.mediaLibrary.requestPermissionsAsync();
      return { status: this.mapExpoStatus(status) };
    } catch (error) {
      console.error('Failed to request permission:', error);
      return { status: PermissionStatus.ERROR };
    }
  }

  async hasPermission(): Promise<boolean> {
    try {
      const { status } = await this.mediaLibrary.getPermissionsAsync();
      // Map the Expo status to our shared PermissionStatus before comparing
      return this.mapExpoStatus(status) === PermissionStatus.AUTHORIZED;
    } catch (error) {
      console.error('Failed to check permission:', error);
      return false;
    }
  }

  private mapExpoStatus(status: MediaLibrary.PermissionStatus): PermissionStatus {
    if (status === 'granted') {
      return PermissionStatus.AUTHORIZED;
    } else if (status === 'denied') {
      return PermissionStatus.DENIED;
    } else if (status === 'undetermined') {
      return PermissionStatus.UNDETERMINED;
    } else if (status === 'limited') {
      return PermissionStatus.LIMITED;
    } else {
      return PermissionStatus.UNDETERMINED;
    }
  }
}

import { MediaLibrary } from 'expo-media-library';

export interface IPermissionAdapter {
  requestPermission(): Promise<{ status: PermissionStatus }>;
  hasPermission(): Promise<boolean>;
}

export class ExpoPermissionAdapter implements IPermissionAdapter {
  private mediaLibrary = MediaLibrary;

  async requestPermission(): Promise<{ status: PermissionStatus }> {
    try {
      const { status } = await this.mediaLibrary.requestPermissions();
      return { status: this.mapExpoStatus(status) };
    } catch (error) {
      console.error('Failed to request permission:', error);
      return { status: PermissionStatus.ERROR };
    }
  }

  async hasPermission(): Promise<boolean> {
    try {
      return await this.mediaLibrary.hasPermission();
    } catch (error) {
      console.error('Failed to check permission:', error);
      return false;
    }
  }

  private mapExpoStatus(status: PermissionStatus): PermissionStatus {
    switch (status) {
      case PermissionStatus.GRANTED:
        return PermissionStatus.GRANTED;
      case PermissionStatus.DENIED:
        return PermissionStatus.DENIED;
      default:
        return PermissionStatus.UNDETERMINED;
    }
  }
}

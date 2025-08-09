import { useEffect, useState } from 'react';
import { requestPermissionsAsync, type PermissionStatus as ExpoPermissionStatus } from 'expo-media-library';
import { PermissionStatus } from '@shared/types/PermissionStatus';

export function useRequestPermissions() {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await requestPermissionsAsync();
      // Map Expo permission status to our custom enum
      const mappedStatus = status === 'granted' ? PermissionStatus.AUTHORIZED :
                           status === 'denied' ? PermissionStatus.DENIED :
                           status === 'undetermined' ? PermissionStatus.UNDETERMINED :
                           status === 'limited' ? PermissionStatus.LIMITED :
                           PermissionStatus.ERROR;
      setHasPermissions(mappedStatus === PermissionStatus.AUTHORIZED);
    };

    checkPermissions();
  }, []);

  return { hasPermissions };
}
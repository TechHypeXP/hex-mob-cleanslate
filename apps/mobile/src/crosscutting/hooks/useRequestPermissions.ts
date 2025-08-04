import { useEffect, useState } from 'react';
import { requestPermissionsAsync } from 'expo-media-library';
import { PermissionStatus } from 'expo-modules-core';

export function useRequestPermissions() {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await requestPermissionsAsync();
      setHasPermissions(status === PermissionStatus.GRANTED);
    };

    checkPermissions();
  }, []);

  return { hasPermissions };
}
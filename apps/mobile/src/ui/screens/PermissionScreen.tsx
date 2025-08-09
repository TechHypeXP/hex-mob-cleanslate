/**
 * Permission Screen
 * 
 * This screen handles photo library permission requests and displays
 * the current permission status to the user. It follows the DDD/Hexagonal
 * architecture by using the PhotoPermissionService for business logic
 * and Redux for state management.
 * 
 * Architectural Boundaries:
 * - Uses PhotoPermissionService for permission logic (application layer)
 * - Uses Redux for state management (infrastructure layer)
 * - Handles UI presentation and user interaction (ui layer)
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Import application service
import { PhotoPermissionService } from '../../application/services/PhotoPermissionService';

// Import Redux actions and types
import { setPhotoLibraryPermission, setLoading, setError } from '../../infrastructure/storage/redux/permissionsSlice';
import { RootState } from '../../infrastructure/storage/redux/store';

// Import shared i18n utilities
import { PermissionStatus } from 'expo-media-library';

const PermissionScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { photoLibrary, loading, error } = useSelector((state: RootState) => state.permissions);
  
  // Initialize permission service
  const permissionService = new PhotoPermissionService();

  // Check current permissions on component mount
  useEffect(() => {
    checkPermissions();
  }, []);

  /**
   * Check current photo library permissions
   */
  const checkPermissions = async () => {
    try {
      dispatch(setLoading(true));
      const result = await permissionService.checkPhotoPermissions();
      dispatch(setPhotoLibraryPermission(result));
    } catch (err) {
      dispatch(setError('Failed to check permissions'));
      console.error('Permission check error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Request photo library permissions from user
   */
  const requestPermissions = async () => {
    try {
      dispatch(setLoading(true));
      const result = await permissionService.requestPhotoPermissions();
      
      dispatch(setPhotoLibraryPermission(result));
      
      // Show appropriate message based on result
      if (result.granted) {
        Alert.alert(
          t('common.done'),
          t('permissions.grantButton') + ' ' + t('common.success'),
          [{ text: t('common.ok') }]
        );
      } else if (!result.canAskAgain) {
        Alert.alert(
          t('permissions.title'),
          t('permissions.privacyNote') + ' ' + t('permissions.cannotAskAgain'),
          [{ text: t('common.ok') }]
        );
      }
    } catch (err) {
      dispatch(setError('Failed to request permissions'));
      console.error('Failed to request permissions:', err);
      Alert.alert(
        t('common.error'),
        t('permissions.requestFailed'),
        [{ text: t('common.ok') }]
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Render permission status message
   */
  const renderPermissionStatus = () => {
    if (loading) {
      return <Text style={styles.statusText}>{t('common.loading')}</Text>;
    }

    switch (photoLibrary.status) {
      case PermissionStatus.GRANTED:
        return (
          <Text style={[styles.statusText, styles.grantedText]}>
            {t('permissions.status.granted')}
          </Text>
        );
      case PermissionStatus.DENIED:
        return (
          <Text style={[styles.statusText, styles.deniedText]}>
            {t('permissions.status.denied')}
          </Text>
        );
      case PermissionStatus.UNDETERMINED:
        return (
          <Text style={styles.statusText}>
            {t('permissions.status.undetermined')}
          </Text>
        );
      default:
        return (
          <Text style={styles.statusText}>
            {t('permissions.status.unknown')}
          </Text>
        );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('permissions.title')}</Text>
        <Text style={styles.subtitle}>{t('permissions.subtitle')}</Text>
        
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>{t('permissions.photoLibrary.title')}</Text>
          <Text style={styles.permissionDescription}>{t('permissions.photoLibrary.description')}</Text>
          {photoLibrary.status === PermissionStatus.DENIED && !photoLibrary.canAskAgain && (
            <Text style={styles.warningText}>{t('permissions.cannotAskAgain')}</Text>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          {renderPermissionStatus()}
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.button,
            (photoLibrary.status === PermissionStatus.DENIED && !photoLibrary.canAskAgain) && styles.disabledButton
          ]}
          onPress={requestPermissions}
          disabled={loading || (photoLibrary.status === PermissionStatus.DENIED && !photoLibrary.canAskAgain)}
        >
          <Text style={styles.buttonText}>{t('permissions.grantButton')}</Text>
        </TouchableOpacity>
        
        <Text style={styles.privacyNote}>{t('permissions.privacyNote')}</Text>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  permissionCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
  grantedText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  deniedText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PermissionScreen;
/**
 * PermissionScreen.tsx - Permission request screen
 * 
 * Displays app permissions required and handles permission requests.
 * Shows at first app launch or when permissions need to be re-requested.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInRight 
} from 'react-native-reanimated';

interface PermissionScreenProps {
  onGrantPermissions: () => void;
}

interface Permission {
  icon: string;
  title: string;
  description: string;
  required: boolean;
}

const permissions: Permission[] = [
  {
    icon: 'images-outline',
    title: 'Photo Library Access',
    description: 'View and organize your photos',
    required: true,
  },
  {
    icon: 'shield-outline',
    title: 'Delete Photos',
    description: 'Remove unwanted photos safely',
    required: true,
  },
  {
    icon: 'lock-closed-outline',
    title: 'Private Storage',
    description: 'Secure storage for private photos',
    required: true,
  },
];

const PermissionScreen: React.FC<PermissionScreenProps> = ({ onGrantPermissions }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.card}
          entering={FadeIn.duration(600)}
        >
          <Animated.View 
            style={styles.iconContainer}
            entering={FadeInDown.delay(200).springify()}
          >
            <Ionicons name="shield" size={48} color="#fff" />
          </Animated.View>
          
          <Text style={styles.title}>Welcome to CleanSlate</Text>
          <Text style={styles.subtitle}>
            We need a few permissions to help you organize your photos
          </Text>

          <View style={styles.permissionsContainer}>
            {permissions.map((permission, index) => (
              <Animated.View
                key={permission.title}
                style={styles.permissionItem}
                entering={SlideInRight.delay(300 + index * 100).springify()}
              >
                <View style={styles.permissionIcon}>
                  <Ionicons name={permission.icon as any} size={24} color="#007AFF" />
                </View>
                <View style={styles.permissionContent}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>
                    {permission.description}
                  </Text>
                  {permission.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={onGrantPermissions}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Grant Permissions</Text>
          </TouchableOpacity>

          <Text style={styles.privacyNote}>
            Your privacy is important to us. We only access photos to help you organize them.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  permissionItem: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e1f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 8,
  },
  requiredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffeceb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requiredText: {
    fontSize: 12,
    color: '#ff3b30',
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacyNote: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
  },
});

export default PermissionScreen;
/**
 * SettingsScreen.tsx - Application settings screen
 * 
 * Provides user customization options for appearance, behavior, privacy, and storage.
 * Implements interactive toggle switches and navigation to sub-settings.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  color?: string;
  onPress?: () => void;
  delay?: number;
}

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [appLock, setAppLock] = useState(false);

  // Helper function to get color based on name
  const getColor = (name: string) => {
    switch (name) {
      case 'red': return '#FF3B30';
      case 'green': return '#34C759';
      case 'blue': return '#007AFF';
      case 'purple': return '#AF52DE';
      case 'pink': return '#FF2D55';
      case 'orange': return '#FF9500';
      case 'gray': return '#8E8E93';
      default: return '#007AFF';
    }
  };

  // Helper function to get light color based on name
  const getColorLight = (name: string) => {
    switch (name) {
      case 'red': return '#FFECEB';
      case 'green': return '#E3F7EA';
      case 'blue': return '#E1F0FF';
      case 'purple': return '#F5E9FF';
      case 'pink': return '#FFE9ED';
      case 'orange': return '#FFF2E3';
      case 'gray': return '#F2F2F7';
      default: return '#E1F0FF';
    }
  };

  const SettingItem: React.FC<SettingItemProps> = ({ 
    icon, 
    title, 
    subtitle, 
    action, 
    color = 'blue',
    onPress,
    delay = 0
  }) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.settingContent}>
          <View style={[styles.iconContainer, { backgroundColor: getColorLight(color) }]}>
            <Ionicons name={icon as any} size={22} color={getColor(color)} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        {action}
      </TouchableOpacity>
    </Animated.View>
  );

  // Section title component
  const SectionTitle: React.FC<{ title: string, delay?: number }> = ({ title, delay = 0 }) => (
    <Animated.Text 
      style={styles.sectionTitle}
      entering={FadeInDown.delay(delay).springify()}
    >
      {title}
    </Animated.Text>
  );

  // Section container
  const Section: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => (
    <Animated.View 
      style={styles.section}
      entering={FadeInDown.delay(delay).springify()}
    >
      {children}
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your CleanSlate experience</Text>
      </View>

      {/* Appearance */}
      <SectionTitle title="Appearance" delay={100} />
      <Section delay={150}>
        <SettingItem
          icon={darkMode ? "moon" : "sunny"}
          title="Dark Mode"
          subtitle="Switch between light and dark themes"
          color="purple"
          action={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#e5e5ea', true: '#8e8eff' }}
              thumbColor={darkMode ? '#5e5ce6' : '#ffffff'}
              ios_backgroundColor="#e5e5ea"
            />
          }
          delay={200}
        />
        <SettingItem
          icon="color-palette-outline"
          title="Theme Color"
          subtitle="Customize accent colors"
          color="pink"
          action={<Ionicons name="chevron-forward" size={20} color="#8e8e93" />}
          onPress={() => {}}
          delay={250}
        />
      </Section>

      {/* Behavior */}
      <SectionTitle title="Behavior" delay={300} />
      <Section delay={350}>
        <SettingItem
          icon="flash-outline"
          title="Auto-Delete"
          subtitle="Automatically delete photos after 30 days"
          color="red"
          action={
            <Switch
              value={autoDelete}
              onValueChange={setAutoDelete}
              trackColor={{ false: '#e5e5ea', true: '#ffcccc' }}
              thumbColor={autoDelete ? '#ff3b30' : '#ffffff'}
              ios_backgroundColor="#e5e5ea"
            />
          }
          delay={400}
        />
        <SettingItem
          icon="phone-portrait-outline"
          title="Haptic Feedback"
          subtitle="Feel vibrations when swiping"
          color="blue"
          action={
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: '#e5e5ea', true: '#b8daff' }}
              thumbColor={hapticFeedback ? '#007aff' : '#ffffff'}
              ios_backgroundColor="#e5e5ea"
            />
          }
          delay={450}
        />
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Get reminders to clean your photos"
          color="green"
          action={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#e5e5ea', true: '#bff4cc' }}
              thumbColor={notifications ? '#34c759' : '#ffffff'}
              ios_backgroundColor="#e5e5ea"
            />
          }
          delay={500}
        />
      </Section>

      {/* Privacy & Security */}
      <SectionTitle title="Privacy & Security" delay={550} />
      <Section delay={600}>
        <SettingItem
          icon="lock-closed-outline"
          title="Private Storage"
          subtitle="Manage your private photo vault"
          color="purple"
          action={<Ionicons name="chevron-forward" size={20} color="#8e8e93" />}
          onPress={() => {}}
          delay={650}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="App Lock"
          subtitle="Require Face ID to open app"
          color="blue"
          action={
            <Switch
              value={appLock}
              onValueChange={setAppLock}
              trackColor={{ false: '#e5e5ea', true: '#b8daff' }}
              thumbColor={appLock ? '#007aff' : '#ffffff'}
              ios_backgroundColor="#e5e5ea"
            />
          }
          delay={700}
        />
      </Section>

      {/* Storage */}
      <SectionTitle title="Storage" delay={750} />
      <Section delay={800}>
        <SettingItem
          icon="hardware-chip-outline"
          title="Storage Management"
          subtitle="View and manage app storage"
          color="orange"
          action={<Ionicons name="chevron-forward" size={20} color="#8e8e93" />}
          onPress={() => {}}
          delay={850}
        />
      </Section>

      {/* About */}
      <SectionTitle title="About" delay={900} />
      <Section delay={950}>
        <SettingItem
          icon="information-circle-outline"
          title="About CleanSlate"
          subtitle="Version 1.0.0"
          color="gray"
          action={<Ionicons name="chevron-forward" size={20} color="#8e8e93" />}
          onPress={() => {}}
          delay={1000}
        />
      </Section>

      {/* Danger Zone */}
      <SectionTitle title="Danger Zone" delay={1050} />
      <Animated.View 
        entering={FadeInDown.delay(1100).springify()}
        style={styles.dangerButton}
      >
        <TouchableOpacity
          style={styles.resetButton}
          activeOpacity={0.7}
          onPress={() => {}}
        >
          <Text style={styles.resetButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Spacer for bottom tab navigation */}
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1c1c1e',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  dangerButton: {
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#ffeceb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  resetButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 84, // Height of the tab bar
  },
});

export default SettingsScreen;
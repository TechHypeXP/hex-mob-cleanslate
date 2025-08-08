/**
 * TabNavigation.tsx - Bottom tab navigation component
 * 
 * Implements custom tab navigation with animations and visual feedback.
 * Supports switching between main app sections.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const tabs: TabItem[] = [
  {
    id: 'clean',
    label: 'Clean',
    icon: 'layers-outline',
    activeIcon: 'layers',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'grid-outline',
    activeIcon: 'grid',
  },
  {
    id: 'stats',
    label: 'stats',
    icon: 'bar-chart-outline',
    activeIcon: 'bar-chart',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
];

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / tabs.length;

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  // Animation values for the indicator
  const indicatorPosition = useSharedValue(
    tabs.findIndex((tab) => tab.id === activeTab) * TAB_WIDTH
  );

  // Update indicator position when active tab changes
  React.useEffect(() => {
    const newPosition = tabs.findIndex((tab) => tab.id === activeTab) * TAB_WIDTH;
    indicatorPosition.value = withTiming(newPosition, { duration: 300 });
  }, [activeTab, indicatorPosition]);

  // Animated style for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated indicator */}
      <Animated.View style={[styles.indicator, indicatorStyle]} />
      
      {/* Tab buttons */}
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon as any : tab.icon as any}
                size={24}
                color={isActive ? '#007AFF' : '#8E8E93'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 84,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e7',
    position: 'relative',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH,
    height: 2,
    backgroundColor: '#007AFF',
  },
});

export default TabNavigation;
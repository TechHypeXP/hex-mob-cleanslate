import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Platform } from 'react-native';

// ✅ ALIASES ENFORCED - Use configured paths
import HomeScreen from './HomeScreen';
import StatsScreen from './StatsScreen';
import SettingsScreen from './SettingsScreen';
import { selectStreakCount, selectBadgeCount } from '../../application/store/selectors';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  // ✅ MODERN: Redux Toolkit state management
  const streakCount = useSelector(selectStreakCount) as number;
  const badgeCount = useSelector(selectBadgeCount) as number;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Stats':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 90 : 60,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarBadge: streakCount > 0 ? streakCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#EF4444', color: '#FFFFFF' },
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#8B5CF6', color: '#FFFFFF' },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
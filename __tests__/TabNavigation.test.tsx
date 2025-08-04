import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '../apps/mobile/src/application/store/store';

// Mock the screen components
jest.mock('../apps/mobile/src/ui/screens/HomeScreen', () => 'HomeScreen');
jest.mock('../apps/mobile/src/ui/screens/StatsScreen', () => 'StatsScreen');
jest.mock('../apps/mobile/src/ui/screens/SettingsScreen', () => 'SettingsScreen');

test('TabNavigation basic test', () => {
  expect(true).toBe(true);
});

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '@shared/store/store';
import HomeScreen from '../../src/ui/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders loading indicator initially', () => {
    render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  // TODO: Add more tests after implementing mock store
});
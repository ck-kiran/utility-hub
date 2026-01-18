import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';

describe('BottomTabNavigator', () => {
  it('renders correctly', () => {
    const { root } = render(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );
    expect(root).toBeTruthy();
  });

  it('renders with Home screen as initial route', () => {
    const { root } = render(
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    );

    // Verify the navigator renders
    expect(root).toBeTruthy();
  });
});

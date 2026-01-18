import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { root } = render(<HomeScreen />);
    expect(root).toBeTruthy();
  });
});

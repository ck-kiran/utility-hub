import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileScreen } from '@/screens/ProfileScreen';

describe('ProfileScreen', () => {
  it('renders correctly', () => {
    const { root } = render(<ProfileScreen />);
    expect(root).toBeTruthy();
  });
});

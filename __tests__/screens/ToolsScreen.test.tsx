import React from 'react';
import { render } from '@testing-library/react-native';
import { ToolsScreen } from '@/screens/ToolsScreen';

describe('ToolsScreen', () => {
  it('renders correctly', () => {
    const { root } = render(<ToolsScreen />);
    expect(root).toBeTruthy();
  });
});

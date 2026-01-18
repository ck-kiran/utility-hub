import React from 'react';
import { render } from '@testing-library/react-native';
import { Divider } from '@/components/common/Divider';

describe('Divider', () => {
  it('renders correctly', () => {
    const { root } = render(<Divider />);
    expect(root).toBeTruthy();
  });

  it('renders with default spacing', () => {
    const { root } = render(<Divider />);
    expect(root).toBeTruthy();
  });

  it('renders with custom spacing', () => {
    const { root } = render(<Divider spacing={6} />);
    expect(root).toBeTruthy();
  });
});

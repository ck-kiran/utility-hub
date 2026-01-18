import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '@/components/common/Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    const { root } = render(<Badge label="New" />);
    expect(root).toBeTruthy();
  });

  it('renders with default variant', () => {
    const { root } = render(<Badge label="Default" />);
    expect(root).toBeTruthy();
  });

  it('renders with success variant', () => {
    const { root } = render(<Badge variant="success" label="Success" />);
    expect(root).toBeTruthy();
  });

  it('renders with error variant', () => {
    const { root } = render(<Badge variant="error" label="Error" />);
    expect(root).toBeTruthy();
  });

  it('renders with warning variant', () => {
    const { root } = render(<Badge variant="warning" label="Warning" />);
    expect(root).toBeTruthy();
  });

  it('renders with info variant', () => {
    const { root } = render(<Badge variant="info" label="Info" />);
    expect(root).toBeTruthy();
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { IconButton } from '@/components/common/IconButton';

describe('IconButton', () => {
  const MockIcon = () => <Text>Icon</Text>;

  it('renders correctly', () => {
    const { root } = render(<IconButton icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { root } = render(<IconButton icon={<MockIcon />} onPress={onPress} />);

    fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    const { root } = render(<IconButton icon={<MockIcon />} disabled />);
    expect(root).toBeTruthy();
  });

  it('renders with default variant', () => {
    const { root } = render(<IconButton variant="default" icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });

  it('renders with primary variant', () => {
    const { root } = render(<IconButton variant="primary" icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });

  it('renders with ghost variant', () => {
    const { root } = render(<IconButton variant="ghost" icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });

  it('renders with small size', () => {
    const { root } = render(<IconButton size="sm" icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });

  it('renders with large size', () => {
    const { root } = render(<IconButton size="lg" icon={<MockIcon />} />);
    expect(root).toBeTruthy();
  });
});

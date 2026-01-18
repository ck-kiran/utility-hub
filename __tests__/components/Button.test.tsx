import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { root } = render(<Button>Click Me</Button>);
    expect(root).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { root } = render(<Button onPress={onPress}>Press</Button>);

    fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    const { root } = render(<Button disabled>Disabled</Button>);
    expect(root).toBeTruthy();
  });

  it('renders loading state', () => {
    const { root } = render(<Button loading>Loading</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with primary variant', () => {
    const { root } = render(<Button variant="primary">Primary</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const { root } = render(<Button variant="secondary">Secondary</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with outline variant', () => {
    const { root } = render(<Button variant="outline">Outline</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with ghost variant', () => {
    const { root } = render(<Button variant="ghost">Ghost</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with small size', () => {
    const { root } = render(<Button size="sm">Small</Button>);
    expect(root).toBeTruthy();
  });

  it('renders with large size', () => {
    const { root } = render(<Button size="lg">Large</Button>);
    expect(root).toBeTruthy();
  });

  it('renders full width', () => {
    const { root } = render(<Button fullWidth>Full Width</Button>);
    expect(root).toBeTruthy();
  });
});

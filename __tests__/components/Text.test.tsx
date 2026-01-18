import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '@/components/common/Text';

describe('Text', () => {
  it('renders correctly', () => {
    const { root } = render(<Text>Hello World</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with h1 variant', () => {
    const { root } = render(<Text variant="h1">Heading 1</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with h2 variant', () => {
    const { root } = render(<Text variant="h2">Heading 2</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with body variant', () => {
    const { root } = render(<Text variant="body">Body text</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with caption variant', () => {
    const { root } = render(<Text variant="caption">Caption</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with label variant', () => {
    const { root } = render(<Text variant="label">Label</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { root } = render(<Text color="#FF0000">Colored Text</Text>);
    expect(root).toBeTruthy();
  });

  it('renders with text alignment', () => {
    const { root } = render(<Text align="center">Centered</Text>);
    expect(root).toBeTruthy();
  });
});

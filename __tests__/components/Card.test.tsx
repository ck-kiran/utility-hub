import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '@/components/common/Card';

describe('Card', () => {
  it('renders correctly', () => {
    const { root } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(root).toBeTruthy();
  });

  it('renders with elevated variant', () => {
    const { root } = render(
      <Card variant="elevated">
        <Text>Elevated Card</Text>
      </Card>
    );
    expect(root).toBeTruthy();
  });

  it('renders with outlined variant', () => {
    const { root } = render(
      <Card variant="outlined">
        <Text>Outlined Card</Text>
      </Card>
    );
    expect(root).toBeTruthy();
  });

  it('renders with filled variant', () => {
    const { root } = render(
      <Card variant="filled">
        <Text>Filled Card</Text>
      </Card>
    );
    expect(root).toBeTruthy();
  });

  it('applies custom padding', () => {
    const { root } = render(
      <Card padding={6}>
        <Text>Padded Card</Text>
      </Card>
    );
    expect(root).toBeTruthy();
  });
});

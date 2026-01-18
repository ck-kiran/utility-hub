import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PolicySection } from '@/components/privacy/PolicySection';

describe('PolicySection', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PolicySection number="1" title="Data Collection">
        <Text>Content here</Text>
      </PolicySection>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders with different numbers', () => {
    const { toJSON } = render(
      <PolicySection number="2" title="Security">
        <Text>Security content</Text>
      </PolicySection>
    );

    expect(toJSON()).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DateSection } from '@/components/history/DateSection';

describe('DateSection', () => {
  it('renders correctly with title and children', () => {
    const { root } = render(
      <DateSection title="TODAY">
        <Text>Child Content</Text>
      </DateSection>
    );
    expect(root).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { root } = render(
      <DateSection title="YESTERDAY">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </DateSection>
    );
    expect(root).toBeTruthy();
  });
});

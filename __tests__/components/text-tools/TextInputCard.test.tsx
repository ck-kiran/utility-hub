import React from 'react';
import { render } from '@testing-library/react-native';
import { TextInputCard } from '@/components/text-tools/TextInputCard';

describe('TextInputCard', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TextInputCard value="" onChangeText={() => {}} />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders with label', () => {
    const { toJSON } = render(
      <TextInputCard value="" onChangeText={() => {}} label="PLAIN TEXT" />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders with value', () => {
    const { toJSON } = render(<TextInputCard value="Hello world" onChangeText={() => {}} />);

    expect(toJSON()).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { InfoBox } from '@/components/tool-detail/InfoBox';

describe('InfoBox', () => {
  it('renders correctly', () => {
    const { root } = render(<InfoBox message="This is an info message" />);
    expect(root).toBeTruthy();
  });

  it('renders with long message', () => {
    const { root } = render(
      <InfoBox message="Medium compression reduces file size significantly while maintaining good quality for reading." />
    );
    expect(root).toBeTruthy();
  });
});

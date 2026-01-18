import React from 'react';
import { render } from '@testing-library/react-native';
import { PolicyBullet } from '@/components/privacy/PolicyBullet';

describe('PolicyBullet', () => {
  it('renders correctly with title and description', () => {
    const { toJSON } = render(
      <PolicyBullet title="Local Processing" description="All files are processed locally." />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders correctly with icon', () => {
    const { toJSON } = render(
      <PolicyBullet
        icon="phone-portrait-outline"
        title="Local Processing"
        description="All files are processed locally."
      />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders without icon (bullet point)', () => {
    const { toJSON } = render(
      <PolicyBullet title="Privacy" description="Your data stays private." />
    );

    expect(toJSON()).toBeTruthy();
  });
});

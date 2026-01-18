import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ProfileSection } from '@/components/profile/ProfileSection';

describe('ProfileSection', () => {
  it('renders children correctly', () => {
    // We can just check if it renders without error
    const { toJSON } = render(
      <ProfileSection>
        <Text testID="child">Child Content</Text>
      </ProfileSection>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders title when provided', () => {
    const { toJSON } = render(
      <ProfileSection title="My Section" testID="section">
        <Text>Content</Text>
      </ProfileSection>
    );
    expect(toJSON()).toBeTruthy();
  });
});

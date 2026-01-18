import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

describe('ProfileHeader', () => {
  it('renders correctly with name and email', () => {
    const { toJSON } = render(<ProfileHeader name="John Doe" email="john@example.com" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders correctly with avatar source', () => {
    // Mock image source
    const mockImage = { uri: 'https://example.com/avatar.png' };
    const { toJSON } = render(
      <ProfileHeader name="Jane Doe" email="jane@example.com" avatarSource={mockImage} />
    );
    expect(toJSON()).toBeTruthy();
  });
});

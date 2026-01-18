import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { Switch } from 'react-native';

describe('ProfileMenuItem', () => {
  it('renders label correctly', () => {
    const { toJSON } = render(
      <ProfileMenuItem icon="settings-outline" label="Settings" testID="menu-item" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders value when provided', () => {
    const { toJSON } = render(
      <ProfileMenuItem
        icon="settings-outline"
        label="Language"
        value="English"
        testID="menu-item"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders right element correctly', () => {
    const { toJSON } = render(
      <ProfileMenuItem
        icon="notifications-outline"
        label="Notifications"
        rightElement={<Switch testID="switch" value={true} />}
        testID="menu-item"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies destructive styles', () => {
    const { toJSON } = render(
      <ProfileMenuItem icon="trash-outline" label="Delete" isDestructive testID="menu-item" />
    );
    expect(toJSON()).toBeTruthy();
  });
});

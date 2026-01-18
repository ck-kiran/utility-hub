import React from 'react';
import { ScrollView, StyleSheet, Switch } from 'react-native';
import { ScreenContainer } from '@/components/common';
import { ProfileHeader, ProfileSection, ProfileMenuItem } from '@/components/profile';
import { colors } from '@/theme';

export function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSignOut = () => {
    // TODO: Implement sign out
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileHeader name="Alex Johnson" email="alex.johnson@example.com" />

        <ProfileSection title="Preferences">
          <ProfileMenuItem
            icon="notifications-outline"
            label="Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
              />
            }
            testID="item-notifications"
          />
          <ProfileMenuItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => {}}
            testID="item-language"
          />
          <ProfileMenuItem
            icon="moon-outline"
            label="Dark Mode"
            value="System"
            onPress={() => {}}
            testID="item-dark-mode"
          />
        </ProfileSection>

        <ProfileSection title="Support">
          <ProfileMenuItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
            testID="item-help"
          />
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => {}}
            testID="item-privacy"
          />
        </ProfileSection>

        <ProfileSection>
          <ProfileMenuItem
            icon="log-out-outline"
            label="Sign Out"
            isDestructive
            showChevron={false}
            onPress={handleSignOut}
            testID="item-sign-out"
          />
        </ProfileSection>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});

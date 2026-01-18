import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/common';
import { ProfileHeader, ProfileSection, ProfileMenuItem } from '@/components/profile';
import { colors, spacing } from '@/theme';
import type { ProfileScreenProps } from '@/navigation';

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProps['navigation']>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSignOut = () => {
    // TODO: Implement sign out
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  return (
    <ScreenContainer padding={false}>
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
          testID="item-language"
        />
        <ProfileMenuItem
          icon="moon-outline"
          label="Dark Mode"
          value="System"
          testID="item-dark-mode"
        />
      </ProfileSection>

      <ProfileSection title="Support">
        <ProfileMenuItem icon="help-circle-outline" label="Help Center" testID="item-help" />
        <ProfileMenuItem
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={handlePrivacyPolicy}
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

      <View style={styles.bottomSpacer} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bottomSpacer: {
    height: spacing[8],
  },
});

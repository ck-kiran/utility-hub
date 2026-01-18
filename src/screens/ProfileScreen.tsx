import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/common';
import { ProfileHeader, ProfileSection, ProfileMenuItem } from '@/components/profile';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import type { ProfileScreenProps } from '@/navigation';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  hi: 'हिन्दी',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  ta: 'தமிழ்',
  te: 'తెలుగు',
};

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProps['navigation']>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { language } = useAppStore();

  const handleSignOut = () => {
    // TODO: Implement sign out
  };

  const handleHelpCenter = () => {
    navigation.navigate('HelpCenter');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleLanguage = () => {
    navigation.navigate('LanguageSelection');
  };

  return (
    <ScreenContainer padding={false}>
      <ProfileHeader name="Alex Johnson" email="alex.johnson@example.com" />

      <ProfileSection title={t('common.preferences')}>
        <ProfileMenuItem
          icon="notifications-outline"
          label={t('common.notifications')}
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
          label={t('common.language')}
          value={LANGUAGE_NAMES[language] || 'English'}
          onPress={handleLanguage}
          testID="item-language"
        />
        <ProfileMenuItem
          icon="moon-outline"
          label={t('common.dark_mode')}
          value="System"
          testID="item-dark-mode"
        />
      </ProfileSection>

      <ProfileSection title={t('common.support')}>
        <ProfileMenuItem
          icon="help-circle-outline"
          label={t('common.help_center')}
          onPress={handleHelpCenter}
          testID="item-help"
        />
        <ProfileMenuItem
          icon="shield-checkmark-outline"
          label={t('common.privacy_policy')}
          onPress={handlePrivacyPolicy}
          testID="item-privacy"
        />
      </ProfileSection>

      <ProfileSection>
        <ProfileMenuItem
          icon="log-out-outline"
          label={t('common.sign_out')}
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

import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarSource?: ImageSourcePropType;
}

export const ProfileHeader = ({ name, email, avatarSource }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text variant="h2" color={colors.primary[500]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text variant="h2" style={styles.name} testID="profile-name">
          {name}
        </Text>
        <Text variant="body" color={colors.text.secondary} testID="profile-email">
          {email}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  avatarContainer: {
    marginBottom: spacing[4],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    borderWidth: 4,
    borderColor: colors.surface,
  },
  placeholderAvatar: {
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    marginBottom: spacing[1],
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/theme';

interface ProfileSectionProps {
  title?: string;
  children: React.ReactNode;
  testID?: string;
}

export const ProfileSection = ({ title, children, testID }: ProfileSectionProps) => {
  return (
    <View style={styles.container} testID={testID}>
      {title && (
        <Text
          variant="caption"
          color={colors.text.secondary}
          style={styles.title}
          testID={testID ? `${testID}-title` : undefined}
        >
          {title.toUpperCase()}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  title: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[100],
    overflow: 'hidden',
  },
});

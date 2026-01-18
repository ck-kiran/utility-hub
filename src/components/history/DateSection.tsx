import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/theme';

interface DateSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DateSection({ title, children }: DateSectionProps) {
  return (
    <View style={styles.container}>
      <Text variant="labelSmall" color={colors.text.tertiary} style={styles.title}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
    letterSpacing: 1,
  },
});

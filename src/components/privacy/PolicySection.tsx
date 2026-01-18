import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing } from '@/theme';

interface PolicySectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export function PolicySection({ number, title, children }: PolicySectionProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        {number}. {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  title: {
    marginBottom: spacing[3],
    color: colors.text.primary,
  },
});

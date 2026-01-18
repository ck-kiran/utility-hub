import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface ToolCardProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export function ToolCard({ icon, label, onPress }: ToolCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text variant="caption" style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginRight: spacing[3],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  label: {
    textAlign: 'center',
    color: colors.text.primary,
  },
});

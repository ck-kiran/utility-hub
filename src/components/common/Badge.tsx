import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { Text } from './Text';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.neutral[200], text: colors.text.secondary },
  success: { bg: colors.success[100], text: colors.success[700] },
  error: { bg: colors.error[100], text: colors.error[700] },
  warning: { bg: colors.warning[100], text: colors.warning[700] },
  info: { bg: colors.info[100], text: colors.info[700] },
};

export function Badge({ variant = 'default', label }: BadgeProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[styles.container, { backgroundColor: variantStyle.bg }]}>
      <Text variant="labelSmall" color={variantStyle.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
});

export default Badge;

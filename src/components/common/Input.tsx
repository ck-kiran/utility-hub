import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

export function Input({ leftIcon, rightIcon, error, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, error && styles.error, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.transparent,
    paddingHorizontal: spacing[4],
    minHeight: 48,
  },
  error: {
    borderColor: colors.error[500],
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing[3],
  },
  inputWithLeftIcon: {
    marginLeft: spacing[2],
  },
  leftIcon: {
    marginRight: spacing[1],
  },
  rightIcon: {
    marginLeft: spacing[2],
  },
});

export default Input;

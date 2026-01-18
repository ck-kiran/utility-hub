import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; textColor: string }> = {
  primary: {
    container: {
      backgroundColor: colors.primary[500],
      ...shadows.button,
    },
    textColor: colors.white,
  },
  secondary: {
    container: {
      backgroundColor: colors.neutral[100],
    },
    textColor: colors.text.primary,
  },
  outline: {
    container: {
      backgroundColor: colors.transparent,
      borderWidth: 1.5,
      borderColor: colors.primary[500],
    },
    textColor: colors.primary[500],
  },
  ghost: {
    container: {
      backgroundColor: colors.transparent,
    },
    textColor: colors.primary[500],
  },
};

const sizeStyles: Record<
  ButtonSize,
  { container: ViewStyle; text: keyof typeof typography.variants }
> = {
  sm: {
    container: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      borderRadius: borderRadius.md,
    },
    text: 'buttonSmall',
  },
  md: {
    container: {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      borderRadius: borderRadius.lg,
    },
    text: 'button',
  },
  lg: {
    container: {
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[8],
      borderRadius: borderRadius.xl,
    },
    text: 'button',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyle.textColor}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <>
          {leftIcon}
          <Text
            variant={sizeStyle.text}
            color={variantStyle.textColor}
            style={[leftIcon && styles.textWithLeftIcon, rightIcon && styles.textWithRightIcon]}
          >
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  textWithLeftIcon: {
    marginLeft: spacing[2],
  },
  textWithRightIcon: {
    marginRight: spacing[2],
  },
});

export default Button;

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
// spacing values are defined inline in sizeMap

type IconButtonVariant = 'default' | 'primary' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends TouchableOpacityProps {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function IconButton({
  variant = 'default',
  size = 'md',
  icon,
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const buttonSize = sizeMap[size];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        variant === 'default' && styles.default,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: colors.neutral[100],
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;

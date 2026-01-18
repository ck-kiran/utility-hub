import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { typography, TypographyVariant } from '@/theme/typography';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color = colors.text.primary,
  align,
  style,
  children,
  ...props
}: TextProps) {
  const variantStyle = typography.variants[variant];

  return (
    <RNText
      style={[styles.base, variantStyle, { color }, align && { textAlign: align }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.fontFamily.regular,
  },
});

export default Text;

/**
 * Typography system for UtilityHub
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Font families
  fontFamily: {
    regular: fontFamily,
    medium: fontFamily,
    semiBold: fontFamily,
    bold: fontFamily,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  // Pre-defined text styles
  variants: {
    // Headings
    h1: {
      fontSize: 30,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 38,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 26,
    },

    // Body
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },

    // Labels
    label: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 16,
    },

    // Caption
    caption: {
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
    },

    // Button
    button: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;

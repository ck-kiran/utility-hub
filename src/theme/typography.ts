/**
 * Typography system for UtilityHub
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Font families
  fontFamily: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
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
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 30,
      lineHeight: 38,
    },
    h2: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 24,
      lineHeight: 32,
    },
    h3: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 20,
      lineHeight: 28,
    },
    h4: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 18,
      lineHeight: 26,
    },

    // Body
    bodyLarge: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 18,
      lineHeight: 28,
    },
    body: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    bodySmall: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 14,
      lineHeight: 20,
    },

    // Labels
    label: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontSize: 14,
      lineHeight: 20,
    },
    labelSmall: {
      fontFamily: 'PlusJakartaSans_500Medium',
      fontSize: 12,
      lineHeight: 16,
    },

    // Caption
    caption: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 12,
      lineHeight: 16,
    },

    // Button
    button: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    buttonSmall: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 14,
      lineHeight: 20,
    },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;

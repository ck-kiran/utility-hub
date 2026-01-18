/**
 * Color palette for UtilityHub
 * Based on the Stitch design system
 */

export const colors = {
  // Primary
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#4F46E5', // Main primary
    600: '#4338CA',
    700: '#3730A3',
    800: '#312E81',
    900: '#1E1B4B',
  },

  // Neutral / Gray
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F7', // Main background
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Success
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Main success
    600: '#059669',
    700: '#047857',
  },

  // Error / Danger
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main error
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Warning
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main warning
    600: '#D97706',
    700: '#B45309',
  },

  // Info
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main info
    600: '#2563EB',
    700: '#1D4ED8',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Semantic aliases
  background: '#F5F5F7',
  surface: '#FFFFFF',
  text: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    inverse: '#FFFFFF',
  },
  border: '#E5E5E5',
  divider: '#E5E5E5',
} as const;

export type ColorKeys = keyof typeof colors;

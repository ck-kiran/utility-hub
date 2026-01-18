/**
 * Shadow system for UtilityHub
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: blur,
  ...Platform.select({
    android: { elevation },
    default: {},
  }),
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),
  sm: createShadow(1, 2, 0.05, 1),
  md: createShadow(2, 4, 0.08, 3),
  lg: createShadow(4, 8, 0.1, 6),
  xl: createShadow(8, 16, 0.12, 10),
  '2xl': createShadow(12, 24, 0.15, 15),

  // Card shadow (common use case)
  card: createShadow(2, 8, 0.06, 3),

  // Button shadow
  button: createShadow(2, 4, 0.1, 2),

  // Modal shadow
  modal: createShadow(8, 24, 0.15, 12),
} as const;

export type ShadowKeys = keyof typeof shadows;

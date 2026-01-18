/**
 * Theme exports for UtilityHub
 */

export { colors } from './colors';
export type { ColorKeys } from './colors';

export { typography } from './typography';
export type { TypographyVariant } from './typography';

export { spacing, borderRadius, iconSize } from './spacing';
export type { SpacingKeys, BorderRadiusKeys, IconSizeKeys } from './spacing';

export { shadows } from './shadows';
export type { ShadowKeys } from './shadows';

// Combined theme object for convenience
export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  iconSize: require('./spacing').iconSize,
  shadows: require('./shadows').shadows,
} as const;

export default theme;

import { spacing, borderRadius, iconSize } from '@/theme/spacing';

describe('Spacing', () => {
  it('has base spacing values', () => {
    expect(spacing[0]).toBe(0);
    expect(spacing[1]).toBe(4);
    expect(spacing[2]).toBe(8);
    expect(spacing[4]).toBe(16);
    expect(spacing[8]).toBe(32);
  });

  it('has semantic spacing values', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
  });
});

describe('BorderRadius', () => {
  it('has border radius values', () => {
    expect(borderRadius.none).toBe(0);
    expect(borderRadius.sm).toBe(4);
    expect(borderRadius.md).toBe(8);
    expect(borderRadius.lg).toBe(12);
    expect(borderRadius.xl).toBe(16);
    expect(borderRadius.full).toBe(9999);
  });
});

describe('IconSize', () => {
  it('has icon size values', () => {
    expect(iconSize.xs).toBe(16);
    expect(iconSize.sm).toBe(20);
    expect(iconSize.md).toBe(24);
    expect(iconSize.lg).toBe(32);
    expect(iconSize.xl).toBe(40);
  });
});

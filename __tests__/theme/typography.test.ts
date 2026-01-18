import { typography } from '@/theme/typography';

describe('Typography', () => {
  it('has font sizes defined', () => {
    expect(typography.fontSize).toBeDefined();
    expect(typography.fontSize.base).toBe(16);
    expect(typography.fontSize.sm).toBe(14);
    expect(typography.fontSize.lg).toBe(18);
  });

  it('has font weights defined', () => {
    expect(typography.fontWeight).toBeDefined();
    expect(typography.fontWeight.regular).toBe('400');
    expect(typography.fontWeight.bold).toBe('700');
  });

  it('has heading variants', () => {
    expect(typography.variants.h1).toBeDefined();
    expect(typography.variants.h1.fontSize).toBe(30);
    expect(typography.variants.h1.fontFamily).toBe('PlusJakartaSans_700Bold');

    expect(typography.variants.h2).toBeDefined();
    expect(typography.variants.h3).toBeDefined();
    expect(typography.variants.h4).toBeDefined();
  });

  it('has body variants', () => {
    expect(typography.variants.body).toBeDefined();
    expect(typography.variants.body.fontSize).toBe(16);

    expect(typography.variants.bodySmall).toBeDefined();
    expect(typography.variants.bodyLarge).toBeDefined();
  });

  it('has label variants', () => {
    expect(typography.variants.label).toBeDefined();
    expect(typography.variants.labelSmall).toBeDefined();
  });

  it('has button variants', () => {
    expect(typography.variants.button).toBeDefined();
    expect(typography.variants.button.fontFamily).toBe('PlusJakartaSans_600SemiBold');

    expect(typography.variants.buttonSmall).toBeDefined();
  });

  it('has caption variant', () => {
    expect(typography.variants.caption).toBeDefined();
    expect(typography.variants.caption.fontSize).toBe(12);
  });
});

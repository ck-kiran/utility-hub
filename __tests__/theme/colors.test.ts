import { colors } from '@/theme/colors';

describe('Colors', () => {
  it('has primary color palette', () => {
    expect(colors.primary).toBeDefined();
    expect(colors.primary[500]).toBe('#4F46E5');
  });

  it('has neutral color palette', () => {
    expect(colors.neutral).toBeDefined();
    expect(colors.neutral[100]).toBe('#F5F5F7');
  });

  it('has success color palette', () => {
    expect(colors.success).toBeDefined();
    expect(colors.success[500]).toBe('#10B981');
  });

  it('has error color palette', () => {
    expect(colors.error).toBeDefined();
    expect(colors.error[500]).toBe('#EF4444');
  });

  it('has warning color palette', () => {
    expect(colors.warning).toBeDefined();
    expect(colors.warning[500]).toBe('#F59E0B');
  });

  it('has info color palette', () => {
    expect(colors.info).toBeDefined();
    expect(colors.info[500]).toBe('#3B82F6');
  });

  it('has common colors', () => {
    expect(colors.white).toBe('#FFFFFF');
    expect(colors.black).toBe('#000000');
    expect(colors.transparent).toBe('transparent');
  });

  it('has semantic colors', () => {
    expect(colors.background).toBe('#F5F5F7');
    expect(colors.surface).toBe('#FFFFFF');
    expect(colors.text.primary).toBe('#171717');
    expect(colors.text.secondary).toBe('#525252');
  });
});

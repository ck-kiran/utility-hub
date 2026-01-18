import React from 'react';
import { render } from '@testing-library/react-native';
import { LanguageItem } from '@/components/language/LanguageItem';

describe('LanguageItem', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<LanguageItem name="English" onPress={() => {}} />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders with local name', () => {
    const { toJSON } = render(<LanguageItem name="中文" localName="Chinese" onPress={() => {}} />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders selected state', () => {
    const { toJSON } = render(<LanguageItem name="English" isSelected onPress={() => {}} />);

    expect(toJSON()).toBeTruthy();
  });
});

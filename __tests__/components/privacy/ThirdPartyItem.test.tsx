import React from 'react';
import { render } from '@testing-library/react-native';
import { ThirdPartyItem } from '@/components/privacy/ThirdPartyItem';

describe('ThirdPartyItem', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<ThirdPartyItem name="Apple StoreKit" badge="Payments" />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders with onPress handler', () => {
    const mockOnPress = jest.fn();
    const { toJSON } = render(
      <ThirdPartyItem name="Google Firebase" badge="Analytics" onPress={mockOnPress} />
    );

    expect(toJSON()).toBeTruthy();
  });
});

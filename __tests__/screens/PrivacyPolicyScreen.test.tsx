import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivacyPolicyScreen } from '@/screens/PrivacyPolicyScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('PrivacyPolicyScreen', () => {
  const renderWithSafeArea = (component: React.ReactNode) => {
    return render(<SafeAreaProvider>{component}</SafeAreaProvider>);
  };

  it('renders correctly', () => {
    const { toJSON } = renderWithSafeArea(<PrivacyPolicyScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { root } = renderWithSafeArea(<PrivacyPolicyScreen />);
    expect(root).toBeTruthy();
  });
});

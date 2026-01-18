import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageSelectionScreen } from '@/screens/LanguageSelectionScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('LanguageSelectionScreen', () => {
  const renderWithSafeArea = (component: React.ReactNode) => {
    return render(<SafeAreaProvider>{component}</SafeAreaProvider>);
  };

  it('renders correctly', () => {
    const { toJSON } = renderWithSafeArea(<LanguageSelectionScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { root } = renderWithSafeArea(<LanguageSelectionScreen />);
    expect(root).toBeTruthy();
  });
});

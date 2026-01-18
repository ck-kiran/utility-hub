import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelpCenterScreen } from '@/screens/HelpCenterScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('HelpCenterScreen', () => {
  const renderWithSafeArea = (component: React.ReactNode) => {
    return render(<SafeAreaProvider>{component}</SafeAreaProvider>);
  };

  it('renders correctly', () => {
    const { toJSON } = renderWithSafeArea(<HelpCenterScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { root } = renderWithSafeArea(<HelpCenterScreen />);
    expect(root).toBeTruthy();
  });
});

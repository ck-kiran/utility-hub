import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WordCounterScreen } from '@/screens/WordCounterScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('WordCounterScreen', () => {
  const renderWithSafeArea = (component: React.ReactNode) => {
    return render(<SafeAreaProvider>{component}</SafeAreaProvider>);
  };

  it('renders correctly', () => {
    const { toJSON } = renderWithSafeArea(<WordCounterScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { root } = renderWithSafeArea(<WordCounterScreen />);
    expect(root).toBeTruthy();
  });
});

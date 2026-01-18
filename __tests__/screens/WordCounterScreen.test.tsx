import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { WordCounterScreen } from '@/screens/WordCounterScreen';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('WordCounterScreen', () => {
  const renderScreen = () => {
    return render(
      <SafeAreaProvider>
        <WordCounterScreen />
      </SafeAreaProvider>
    );
  };

  it('renders correctly', () => {
    const { UNSAFE_getByType, toJSON } = renderScreen();
    expect(UNSAFE_getByType(TextInput)).toBeTruthy();
    expect(toJSON()).toBeTruthy();
  });
});

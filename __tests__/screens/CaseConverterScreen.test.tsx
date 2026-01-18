import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { CaseConverterScreen } from '@/screens/CaseConverterScreen';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('CaseConverterScreen', () => {
  const renderScreen = () => {
    return render(
      <SafeAreaProvider>
        <CaseConverterScreen />
      </SafeAreaProvider>
    );
  };

  it('renders correctly', () => {
    const { UNSAFE_getAllByType, toJSON } = renderScreen();
    // Verify inputs exist (Input and Output)
    expect(UNSAFE_getAllByType(TextInput).length).toBeGreaterThanOrEqual(2);
    expect(toJSON()).toBeTruthy();
  });
});

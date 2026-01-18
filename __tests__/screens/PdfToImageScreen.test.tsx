import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PdfToImageScreen } from '@/screens/PdfToImageScreen';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

// Mock expo-document-picker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mock expo-sharing
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn(),
}));

describe('PdfToImageScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    return render(
      <SafeAreaProvider>
        <PdfToImageScreen />
      </SafeAreaProvider>
    );
  };

  it('renders correctly', () => {
    const { toJSON } = renderScreen();
    expect(toJSON()).toBeTruthy();
  });
});

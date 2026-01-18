import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/HomeScreen';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 375, height: 812 },
        insets: { top: 44, left: 0, right: 0, bottom: 34 },
      }}
    >
      {component}
    </SafeAreaProvider>
  );
};

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { root } = renderWithProviders(<HomeScreen />);
    expect(root).toBeTruthy();
  });
});

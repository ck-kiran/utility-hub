/* global jest, require */
// Mock expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(),
      uri: 'mock-uri',
    })),
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock @expo-google-fonts/plus-jakarta-sans
jest.mock('@expo-google-fonts/plus-jakarta-sans', () => ({
  useFonts: () => [true], // Return fontsLoaded: true
  PlusJakartaSans_400Regular: 'PlusJakartaSans_400Regular',
  PlusJakartaSans_500Medium: 'PlusJakartaSans_500Medium',
  PlusJakartaSans_600SemiBold: 'PlusJakartaSans_600SemiBold',
  PlusJakartaSans_700Bold: 'PlusJakartaSans_700Bold',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const createMockIcon = (name) => {
    const MockIcon = (props) => React.createElement(Text, props, props.name || name);
    MockIcon.displayName = name;
    return MockIcon;
  };

  return {
    Ionicons: createMockIcon('Ionicons'),
    MaterialIcons: createMockIcon('MaterialIcons'),
    FontAwesome: createMockIcon('FontAwesome'),
    Feather: createMockIcon('Feather'),
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock expo winter runtime if needed
jest.mock('expo', () => {
  const expo = jest.requireActual('expo');
  return {
    ...expo,
  };
}, { virtual: true });

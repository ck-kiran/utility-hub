/* global jest */
// Mock expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock expo winter runtime if needed
jest.mock('expo', () => {
  const expo = jest.requireActual('expo');
  return {
    ...expo,
  };
}, { virtual: true });

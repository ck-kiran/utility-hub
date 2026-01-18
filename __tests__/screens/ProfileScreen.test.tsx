import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ProfileHeader, ProfileMenuItem } from '@/components/profile';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock child components to verify props and avoid rendering issues
jest.mock('@/components/profile', () => ({
  ProfileHeader: jest.fn(() => null),
  ProfileSection: jest.fn(({ children }) => <>{children}</>),
  ProfileMenuItem: jest.fn(() => null),
}));

describe('ProfileScreen', () => {
  const renderWithSafeArea = (component: React.ReactNode) => {
    return render(<SafeAreaProvider>{component}</SafeAreaProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { root } = renderWithSafeArea(<ProfileScreen />);
    expect(root).toBeTruthy();
  });

  it('renders profile header with correct props', () => {
    renderWithSafeArea(<ProfileScreen />);
    expect(ProfileHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
      }),
      undefined
    );
  });

  it('renders menu items with correct labels', () => {
    renderWithSafeArea(<ProfileScreen />);

    // Check for specific items being rendered
    expect(ProfileMenuItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Notifications' }),
      undefined
    );
    expect(ProfileMenuItem).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Sign Out', isDestructive: true }),
      undefined
    );
  });
});

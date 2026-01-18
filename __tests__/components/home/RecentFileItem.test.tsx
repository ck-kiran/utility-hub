import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecentFileItem } from '@/components/home/RecentFileItem';

describe('RecentFileItem', () => {
  const defaultProps = {
    fileName: 'test.pdf',
    action: 'Merged',
    timestamp: '2 mins ago',
    fileType: 'pdf' as const,
  };

  it('renders correctly', () => {
    const { root } = render(<RecentFileItem {...defaultProps} />);
    expect(root).toBeTruthy();
  });

  it('renders with pdf file type', () => {
    const { root } = render(<RecentFileItem {...defaultProps} fileType="pdf" />);
    expect(root).toBeTruthy();
  });

  it('renders with image file type', () => {
    const { root } = render(<RecentFileItem {...defaultProps} fileType="image" />);
    expect(root).toBeTruthy();
  });

  it('renders with zip file type', () => {
    const { root } = render(<RecentFileItem {...defaultProps} fileType="zip" />);
    expect(root).toBeTruthy();
  });

  it('renders with document file type', () => {
    const { root } = render(<RecentFileItem {...defaultProps} fileType="document" />);
    expect(root).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { root } = render(<RecentFileItem {...defaultProps} onPress={onPress} />);

    fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

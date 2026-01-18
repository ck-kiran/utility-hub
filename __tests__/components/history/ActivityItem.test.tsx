import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityItem } from '@/components/history/ActivityItem';

describe('ActivityItem', () => {
  const defaultProps = {
    fileName: 'test.pdf',
    action: 'compressed' as const,
    status: 'completed' as const,
    timestamp: '10:45 AM',
    fileType: 'pdf' as const,
  };

  it('renders correctly', () => {
    const { root } = render(<ActivityItem {...defaultProps} />);
    expect(root).toBeTruthy();
  });

  it('renders with failed status', () => {
    const { root } = render(<ActivityItem {...defaultProps} status="failed" />);
    expect(root).toBeTruthy();
  });

  it('renders with different file types', () => {
    const { root } = render(<ActivityItem {...defaultProps} fileType="image" />);
    expect(root).toBeTruthy();
  });

  it('renders with different actions', () => {
    const { root } = render(<ActivityItem {...defaultProps} action="converted" />);
    expect(root).toBeTruthy();
  });
});

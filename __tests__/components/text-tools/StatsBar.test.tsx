import React from 'react';
import { render } from '@testing-library/react-native';
import { StatsBar } from '@/components/text-tools/StatsBar';

describe('StatsBar', () => {
  const mockStats = [
    { value: 10, label: 'WORDS' },
    { value: 50, label: 'CHARS' },
    { value: 40, label: 'W/O SPC' },
    { value: 2, label: 'PARA' },
  ];

  it('renders correctly', () => {
    const { toJSON } = render(<StatsBar stats={mockStats} />);

    expect(toJSON()).toBeTruthy();
  });

  it('renders with zero values', () => {
    const zeroStats = [
      { value: 0, label: 'WORDS' },
      { value: 0, label: 'CHARS' },
    ];
    const { toJSON } = render(<StatsBar stats={zeroStats} />);

    expect(toJSON()).toBeTruthy();
  });
});

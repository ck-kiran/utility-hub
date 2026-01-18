import React from 'react';
import { render } from '@testing-library/react-native';
import { QualitySelector } from '@/components/pdf-tools/QualitySelector';

describe('QualitySelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with low quality selected', () => {
    const { toJSON } = render(<QualitySelector value="low" onChange={mockOnChange} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with medium quality selected', () => {
    const { toJSON } = render(<QualitySelector value="medium" onChange={mockOnChange} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with high quality selected', () => {
    const { toJSON } = render(<QualitySelector value="high" onChange={mockOnChange} />);
    expect(toJSON()).toBeTruthy();
  });
});

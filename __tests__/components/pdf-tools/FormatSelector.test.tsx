import React from 'react';
import { render } from '@testing-library/react-native';
import { FormatSelector } from '@/components/pdf-tools/FormatSelector';

describe('FormatSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with PNG selected', () => {
    const { toJSON } = render(<FormatSelector value="png" onChange={mockOnChange} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with JPG selected', () => {
    const { toJSON } = render(<FormatSelector value="jpg" onChange={mockOnChange} />);
    expect(toJSON()).toBeTruthy();
  });
});

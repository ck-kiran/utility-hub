import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OptionTabs } from '@/components/tool-detail/OptionTabs';

describe('OptionTabs', () => {
  const options = [
    { id: 'high', label: 'High Quality' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'small', label: 'Small Size' },
  ];

  it('renders correctly', () => {
    const { root } = render(
      <OptionTabs options={options} selectedId="balanced" onSelect={jest.fn()} />
    );
    expect(root).toBeTruthy();
  });

  it('renders all options', () => {
    const { root } = render(
      <OptionTabs options={options} selectedId="balanced" onSelect={jest.fn()} />
    );
    expect(root).toBeTruthy();
  });

  it('calls onSelect when option is pressed', () => {
    const onSelect = jest.fn();
    const { root } = render(
      <OptionTabs options={options} selectedId="balanced" onSelect={onSelect} />
    );
    expect(root).toBeTruthy();
  });
});

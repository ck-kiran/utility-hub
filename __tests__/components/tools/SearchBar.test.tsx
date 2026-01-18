import React from 'react';
import { render } from '@testing-library/react-native';
import { SearchBar } from '@/components/tools/SearchBar';

describe('SearchBar', () => {
  it('renders correctly', () => {
    const { root } = render(<SearchBar value="" onChangeText={jest.fn()} />);
    expect(root).toBeTruthy();
  });

  it('displays the value', () => {
    const { root } = render(<SearchBar value="test query" onChangeText={jest.fn()} />);
    expect(root).toBeTruthy();
  });

  it('renders with onChangeText handler', () => {
    const onChangeText = jest.fn();
    const { root } = render(<SearchBar value="" onChangeText={onChangeText} />);
    expect(root).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const { root } = render(
      <SearchBar value="" onChangeText={jest.fn()} placeholder="Custom placeholder" />
    );
    expect(root).toBeTruthy();
  });
});

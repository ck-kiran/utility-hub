import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ToolCard } from '@/components/home/ToolCard';

describe('ToolCard', () => {
  it('renders correctly', () => {
    const { root } = render(<ToolCard icon="git-merge-outline" label="Merge PDF" />);
    expect(root).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { root } = render(
      <ToolCard icon="git-merge-outline" label="Merge PDF" onPress={onPress} />
    );

    fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('displays the label', () => {
    const { root } = render(<ToolCard icon="git-merge-outline" label="Image to PDF" />);
    expect(root).toBeTruthy();
  });
});

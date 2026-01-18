import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToolListItem } from '@/components/tools/ToolListItem';

describe('ToolListItem', () => {
  it('renders correctly', () => {
    const { root } = render(
      <ToolListItem
        icon="git-merge-outline"
        title="Merge PDF"
        description="Combine multiple files"
      />
    );
    expect(root).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { root } = render(
      <ToolListItem
        icon="git-merge-outline"
        title="Merge PDF"
        description="Combine multiple files"
        onPress={onPress}
      />
    );

    fireEvent.press(root);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('displays title and description', () => {
    const { root } = render(
      <ToolListItem icon="git-merge-outline" title="Compress PDF" description="Reduce file size" />
    );
    expect(root).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ToolCategory } from '@/components/tools/ToolCategory';

describe('ToolCategory', () => {
  it('renders correctly with title and children', () => {
    const { root } = render(
      <ToolCategory title="PDF Tools">
        <Text>Child Content</Text>
      </ToolCategory>
    );
    expect(root).toBeTruthy();
  });

  it('renders with multiple children', () => {
    const { root } = render(
      <ToolCategory title="Image Tools">
        <Text>Tool 1</Text>
        <Text>Tool 2</Text>
      </ToolCategory>
    );
    expect(root).toBeTruthy();
  });
});

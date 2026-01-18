import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ConfigurationCard } from '@/components/tool-detail/ConfigurationCard';

describe('ConfigurationCard', () => {
  it('renders correctly', () => {
    const { root } = render(
      <ConfigurationCard title="Compression Level" subtitle="Medium">
        <Text>Content</Text>
      </ConfigurationCard>
    );
    expect(root).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { root } = render(
      <ConfigurationCard title="Settings" subtitle="Subtitle" icon="settings-outline">
        <Text>Content</Text>
      </ConfigurationCard>
    );
    expect(root).toBeTruthy();
  });

  it('renders collapsed by default when specified', () => {
    const { root } = render(
      <ConfigurationCard title="Title" subtitle="Subtitle" defaultExpanded={false}>
        <Text>Content</Text>
      </ConfigurationCard>
    );
    expect(root).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { SectionHeader } from '@/components/home/SectionHeader';

describe('SectionHeader', () => {
  it('renders correctly with title only', () => {
    const { root } = render(<SectionHeader title="Popular Tools" />);
    expect(root).toBeTruthy();
  });

  it('renders correctly with action label', () => {
    const { root } = render(<SectionHeader title="Popular Tools" actionLabel="See All" />);
    expect(root).toBeTruthy();
  });

  it('renders with action handler', () => {
    const onActionPress = jest.fn();
    const { root } = render(
      <SectionHeader title="Popular Tools" actionLabel="See All" onActionPress={onActionPress} />
    );

    expect(root).toBeTruthy();
  });
});

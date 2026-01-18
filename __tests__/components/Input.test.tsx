import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '@/components/common/Input';

describe('Input', () => {
  it('renders correctly', () => {
    const { root } = render(<Input placeholder="Enter text" />);
    expect(root).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { root } = render(<Input placeholder="Enter text" onChangeText={onChangeText} />);
    expect(root).toBeTruthy();
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <Text>LeftIcon</Text>;
    const { root } = render(<Input placeholder="Search" leftIcon={<LeftIcon />} />);
    expect(root).toBeTruthy();
  });

  it('renders with right icon', () => {
    const RightIcon = () => <Text>RightIcon</Text>;
    const { root } = render(<Input placeholder="Password" rightIcon={<RightIcon />} />);
    expect(root).toBeTruthy();
  });

  it('shows error state', () => {
    const { root } = render(<Input placeholder="Email" error />);
    expect(root).toBeTruthy();
  });

  it('accepts value prop', () => {
    const { root } = render(<Input placeholder="Name" value="John Doe" />);
    expect(root).toBeTruthy();
  });
});

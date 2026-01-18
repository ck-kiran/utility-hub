import React from 'react';
import { render } from '@testing-library/react-native';
import { FileUploadCard } from '@/components/tool-detail/FileUploadCard';

describe('FileUploadCard', () => {
  const defaultProps = {
    title: 'Upload PDF',
    subtitle: 'Select a file',
    onChooseFile: jest.fn(),
  };

  it('renders correctly', () => {
    const { root } = render(<FileUploadCard {...defaultProps} />);
    expect(root).toBeTruthy();
  });

  it('renders with onChooseFile handler', () => {
    const onChooseFile = jest.fn();
    const { root } = render(<FileUploadCard {...defaultProps} onChooseFile={onChooseFile} />);
    expect(root).toBeTruthy();
  });

  it('renders with selected file', () => {
    const { root } = render(<FileUploadCard {...defaultProps} selectedFile="test.pdf" />);
    expect(root).toBeTruthy();
  });
});

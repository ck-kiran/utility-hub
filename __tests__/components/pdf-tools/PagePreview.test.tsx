import React from 'react';
import { render } from '@testing-library/react-native';
import { PagePreview } from '@/components/pdf-tools/PagePreview';
import { FileItem } from '@/types/pdf';

describe('PagePreview', () => {
  const mockFile: FileItem = {
    id: '1',
    uri: 'file://document.pdf',
    name: 'document.pdf',
    size: 102400,
    type: 'pdf',
  };

  it('renders empty state when no file', () => {
    const { toJSON } = render(<PagePreview file={null} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with file and page count', () => {
    const { toJSON } = render(<PagePreview file={mockFile} pageCount={5} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with many pages', () => {
    const { toJSON } = render(<PagePreview file={mockFile} pageCount={10} />);
    expect(toJSON()).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { FileListCard } from '@/components/pdf-tools/FileListCard';
import { FileItem } from '@/types/pdf';

describe('FileListCard', () => {
  const mockOnRemove = jest.fn();
  const mockOnAdd = jest.fn();

  const mockFiles: FileItem[] = [
    { id: '1', uri: 'file://test1.pdf', name: 'document1.pdf', size: 1024, type: 'pdf' },
    { id: '2', uri: 'file://test2.pdf', name: 'document2.pdf', size: 2048, type: 'pdf' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no files', () => {
    const { toJSON } = render(
      <FileListCard
        files={[]}
        onRemove={mockOnRemove}
        onAdd={mockOnAdd}
        emptyStateText="No files selected"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders file list when files are provided', () => {
    const { toJSON } = render(
      <FileListCard files={mockFiles} onRemove={mockOnRemove} onAdd={mockOnAdd} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with reorder function', () => {
    const mockOnReorder = jest.fn();
    const { toJSON } = render(
      <FileListCard
        files={mockFiles}
        onRemove={mockOnRemove}
        onReorder={mockOnReorder}
        onAdd={mockOnAdd}
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});

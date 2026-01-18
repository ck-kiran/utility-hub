import React from 'react';
import { render } from '@testing-library/react-native';
import { ImageGrid } from '@/components/pdf-tools/ImageGrid';
import { FileItem } from '@/types/pdf';

describe('ImageGrid', () => {
  const mockOnRemove = jest.fn();
  const mockOnAdd = jest.fn();

  const mockImages: FileItem[] = [
    { id: '1', uri: 'file://image1.jpg', name: 'image1.jpg', size: 1024, type: 'image' },
    { id: '2', uri: 'file://image2.jpg', name: 'image2.jpg', size: 2048, type: 'image' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no images', () => {
    const { toJSON } = render(
      <ImageGrid
        images={[]}
        onRemove={mockOnRemove}
        onAdd={mockOnAdd}
        emptyStateText="No images selected"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders image grid when images are provided', () => {
    const { toJSON } = render(
      <ImageGrid images={mockImages} onRemove={mockOnRemove} onAdd={mockOnAdd} />
    );
    expect(toJSON()).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressIndicator } from '@/components/pdf-tools/ProgressIndicator';
import { ProcessingState } from '@/types/pdf';

describe('ProgressIndicator', () => {
  it('renders nothing when status is idle', () => {
    const state: ProcessingState = { status: 'idle', progress: 0 };
    const { toJSON } = render(<ProgressIndicator state={state} />);
    expect(toJSON()).toBeNull();
  });

  it('renders processing state', () => {
    const state: ProcessingState = {
      status: 'processing',
      progress: 0.5,
      message: 'Merging pages...',
    };
    const { toJSON } = render(<ProgressIndicator state={state} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders complete state', () => {
    const state: ProcessingState = {
      status: 'complete',
      progress: 1,
      message: 'Ready to save',
    };
    const { toJSON } = render(<ProgressIndicator state={state} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders error state', () => {
    const state: ProcessingState = {
      status: 'error',
      progress: 0,
      message: 'Failed to merge PDFs',
    };
    const { toJSON } = render(<ProgressIndicator state={state} />);
    expect(toJSON()).toBeTruthy();
  });
});

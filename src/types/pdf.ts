/**
 * Shared PDF types for PDF tools
 */

export interface FileItem {
  id: string;
  uri: string;
  name: string;
  size: number;
  type: 'pdf' | 'image';
  mimeType?: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message?: string;
  outputUri?: string;
}

export interface PdfMergeOptions {
  outputFileName?: string;
}

export interface ImageToPdfOptions {
  quality?: 'low' | 'medium' | 'high';
  pageSize?: 'a4' | 'letter' | 'fit';
  outputFileName?: string;
}

export interface PdfToImageOptions {
  format?: 'png' | 'jpg';
  quality?: number;
  pages?: number[] | 'all';
}

export interface SplitPdfOptions {
  pageRanges?: string;
  extractAll?: boolean;
}

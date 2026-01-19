import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FileItem } from '@/types/pdf';

type FileType = 'pdf' | 'image' | 'all';

interface UseFilePickerOptions {
  fileType?: FileType;
  multiple?: boolean;
}

interface UseFilePickerResult {
  files: FileItem[];
  isPickerOpen: boolean;
  pickFiles: () => Promise<void>;
  pickImages: () => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
  error: string | null;
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function useFilePicker(options: UseFilePickerOptions = {}): UseFilePickerResult {
  const { multiple = true } = options;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFiles = useCallback(async () => {
    setError(null);
    setIsPickerOpen(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newFiles: FileItem[] = result.assets.map((asset) => ({
          id: generateId(),
          uri: asset.uri,
          name: asset.name,
          size: asset.size ?? 0,
          type: 'pdf' as const,
          mimeType: asset.mimeType,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch {
      setError('Failed to pick files. Please try again.');
    } finally {
      setIsPickerOpen(false);
    }
  }, [multiple]);

  const pickImages = useCallback(async () => {
    setError(null);
    setIsPickerOpen(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: multiple,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newFiles: FileItem[] = result.assets.map((asset) => ({
          id: generateId(),
          uri: asset.uri,
          name: asset.fileName ?? `image-${Date.now()}.jpg`,
          size: asset.fileSize ?? 0,
          type: 'image' as const,
          mimeType: asset.mimeType,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch {
      setError('Failed to pick images. Please try again.');
    } finally {
      setIsPickerOpen(false);
    }
  }, [multiple]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setError(null);
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    isPickerOpen,
    pickFiles,
    pickImages,
    removeFile,
    reorderFiles,
    clearFiles,
    error,
  };
}

export { formatFileSize };

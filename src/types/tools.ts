import { Ionicons } from '@expo/vector-icons';

export type ToolId =
  | 'merge-pdf'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'split-pdf'
  | 'word-to-pdf'
  | 'resize-image'
  | 'convert-jpg'
  | 'word-counter'
  | 'case-converter'
  | 'audio-to-text'
  | 'text-to-audio'
  | 'json-formatter'
  | 'color-picker';

export interface Tool {
  id: ToolId;
  titleKey: string;
  descriptionKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string; // Specific route name if different from generic ToolDetail
  isPopular?: boolean;
}

export interface ToolCategory {
  id: string;
  titleKey: string;
  toolIds: ToolId[];
}

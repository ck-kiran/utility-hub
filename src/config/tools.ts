import { Tool, ToolCategory, ToolId } from '@/types/tools';

export const TOOLS: Record<ToolId, Tool> = {
  // PDF Tools
  'merge-pdf': {
    id: 'merge-pdf',
    titleKey: 'tools.merge_pdf',
    descriptionKey: 'tools.merge_pdf_desc',
    icon: 'git-merge-outline',
    isPopular: true,
    themeColor: '#EF4444',
  },
  'image-to-pdf': {
    id: 'image-to-pdf',
    titleKey: 'tools.image_to_pdf',
    descriptionKey: 'tools.image_to_pdf_desc',
    icon: 'image-outline',
    themeColor: '#EF4444',
  },
  'pdf-to-image': {
    id: 'pdf-to-image',
    titleKey: 'tools.pdf_to_image',
    descriptionKey: 'tools.pdf_to_image_desc',
    icon: 'images-outline',
    themeColor: '#EF4444',
  },
  'split-pdf': {
    id: 'split-pdf',
    titleKey: 'tools.split_pdf',
    descriptionKey: 'tools.split_pdf_desc',
    icon: 'cut-outline',
    themeColor: '#EF4444',
  },
  'word-to-pdf': {
    id: 'word-to-pdf',
    titleKey: 'tools.word_to_pdf',
    descriptionKey: 'tools.word_to_pdf_desc',
    icon: 'document-text-outline',
    themeColor: '#EF4444',
  },

  // Image Tools
  'resize-image': {
    id: 'resize-image',
    titleKey: 'tools.resize_image',
    descriptionKey: 'tools.resize_image_desc',
    icon: 'expand-outline',
    isPopular: true,
    themeColor: '#3B82F6',
  },
  'convert-jpg': {
    id: 'convert-jpg',
    titleKey: 'tools.convert_jpg',
    descriptionKey: 'tools.convert_jpg_desc',
    icon: 'image-outline',
    themeColor: '#3B82F6',
  },

  // Text Tools
  'word-counter': {
    id: 'word-counter',
    titleKey: 'tools.word_counter',
    descriptionKey: 'tools.word_counter_desc',
    icon: 'list-outline',
    route: 'WordCounter',
    isPopular: true,
    themeColor: '#10B981',
  },
  'case-converter': {
    id: 'case-converter',
    titleKey: 'tools.case_converter',
    descriptionKey: 'tools.case_converter_desc',
    icon: 'text-outline',
    route: 'CaseConverter',
    themeColor: '#10B981',
  },

  // Audio Tools
  'audio-to-text': {
    id: 'audio-to-text',
    titleKey: 'tools.audio_to_text',
    descriptionKey: 'tools.audio_to_text_desc',
    icon: 'mic-outline',
    isPopular: true,
    themeColor: '#8B5CF6',
  },
  'text-to-audio': {
    id: 'text-to-audio',
    titleKey: 'tools.text_to_audio',
    descriptionKey: 'tools.text_to_audio_desc',
    icon: 'volume-high-outline',
    themeColor: '#8B5CF6',
  },

  // Developer Tools
  'json-formatter': {
    id: 'json-formatter',
    titleKey: 'tools.json_formatter',
    descriptionKey: 'tools.json_formatter_desc',
    icon: 'code-slash-outline',
    themeColor: '#F97316',
  },
  'color-picker': {
    id: 'color-picker',
    titleKey: 'tools.color_picker',
    descriptionKey: 'tools.color_picker_desc',
    icon: 'color-palette-outline',
    themeColor: '#F97316',
  },
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'pdf',
    titleKey: 'tools.pdf_tools',
    toolIds: ['merge-pdf', 'image-to-pdf', 'pdf-to-image', 'split-pdf', 'word-to-pdf'],
  },
  {
    id: 'image',
    titleKey: 'tools.image_tools',
    toolIds: ['resize-image', 'convert-jpg'],
  },
  {
    id: 'text',
    titleKey: 'tools.text_tools',
    toolIds: ['word-counter', 'case-converter'],
  },
  {
    id: 'audio',
    titleKey: 'tools.audio_tools',
    toolIds: ['audio-to-text', 'text-to-audio'],
  },
  {
    id: 'developer',
    titleKey: 'tools.dev_tools',
    toolIds: ['json-formatter', 'color-picker'],
  },
];

export const getTool = (id: ToolId): Tool | undefined => TOOLS[id];

export const getPopularTools = (): Tool[] => {
  return Object.values(TOOLS).filter((tool) => tool.isPopular);
};

export const getCategoryTools = (categoryId: string): Tool[] => {
  const category = TOOL_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  return category.toolIds.map((id) => TOOLS[id]).filter((t): t is Tool => !!t);
};

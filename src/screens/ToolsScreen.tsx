import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { SearchBar, ToolListItem, ToolCategory } from '@/components/tools';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import type { ToolsScreenProps } from '@/navigation';

interface Tool {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ToolCategoryData {
  id: string;
  titleKey: string;
  tools: Tool[];
}

const TOOL_CATEGORIES: ToolCategoryData[] = [
  {
    id: 'pdf',
    titleKey: 'tools.pdf_tools',
    tools: [
      {
        id: 'merge-pdf',
        titleKey: 'tools.merge_pdf',
        descriptionKey: 'tools.merge_pdf_desc',
        icon: 'git-merge-outline',
      },
      {
        id: 'image-to-pdf',
        titleKey: 'tools.image_to_pdf',
        descriptionKey: 'tools.image_to_pdf_desc',
        icon: 'image-outline',
      },
      {
        id: 'pdf-to-image',
        titleKey: 'tools.pdf_to_image',
        descriptionKey: 'tools.pdf_to_image_desc',
        icon: 'images-outline',
      },
      {
        id: 'split-pdf',
        titleKey: 'tools.split_pdf',
        descriptionKey: 'tools.split_pdf_desc',
        icon: 'cut-outline',
      },
      {
        id: 'word-to-pdf',
        titleKey: 'tools.word_to_pdf',
        descriptionKey: 'tools.word_to_pdf_desc',
        icon: 'document-text-outline',
      },
    ],
  },
  {
    id: 'image',
    titleKey: 'tools.image_tools',
    tools: [
      {
        id: 'resize-image',
        titleKey: 'tools.resize_image',
        descriptionKey: 'tools.resize_image_desc',
        icon: 'expand-outline',
      },
      {
        id: 'convert-jpg',
        titleKey: 'tools.convert_jpg',
        descriptionKey: 'tools.convert_jpg_desc',
        icon: 'image-outline',
      },
    ],
  },
  {
    id: 'text',
    titleKey: 'tools.text_tools',
    tools: [
      {
        id: 'word-counter',
        titleKey: 'tools.word_counter',
        descriptionKey: 'tools.word_counter_desc',
        icon: 'list-outline',
      },
      {
        id: 'case-converter',
        titleKey: 'tools.case_converter',
        descriptionKey: 'tools.case_converter_desc',
        icon: 'text-outline',
      },
    ],
  },
  {
    id: 'audio',
    titleKey: 'tools.audio_tools',
    tools: [
      {
        id: 'audio-to-text',
        titleKey: 'tools.audio_to_text',
        descriptionKey: 'tools.audio_to_text_desc',
        icon: 'mic-outline',
      },
      {
        id: 'text-to-audio',
        titleKey: 'tools.text_to_audio',
        descriptionKey: 'tools.text_to_audio_desc',
        icon: 'volume-high-outline',
      },
    ],
  },
  {
    id: 'developer',
    titleKey: 'tools.dev_tools',
    tools: [
      {
        id: 'json-formatter',
        titleKey: 'tools.json_formatter',
        descriptionKey: 'tools.json_formatter_desc',
        icon: 'code-slash-outline',
      },
      {
        id: 'color-picker',
        titleKey: 'tools.color_picker',
        descriptionKey: 'tools.color_picker_desc',
        icon: 'color-palette-outline',
      },
    ],
  },
];

export function ToolsScreen() {
  const navigation = useNavigation<ToolsScreenProps['navigation']>();
  const [searchQuery, setSearchQuery] = useState('');
  useAppStore((state) => state.language);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return TOOL_CATEGORIES;
    }

    const query = searchQuery.toLowerCase();
    return TOOL_CATEGORIES.map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        const title = t(tool.titleKey).toLowerCase();
        const description = t(tool.descriptionKey).toLowerCase();
        return title.includes(query) || description.includes(query);
      }),
    })).filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const handleToolPress = (toolId: string, toolName: string) => {
    // Navigate to specific tool screens for text tools
    if (toolId === 'word-counter') {
      navigation.navigate('WordCounter');
      return;
    }
    if (toolId === 'case-converter') {
      navigation.navigate('CaseConverter');
      return;
    }
    // Default to generic tool detail screen
    navigation.navigate('ToolDetail', { toolId, toolName });
  };

  const handleHistoryPress = () => {
    // TODO: Navigate to history
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1">{t('common.library')}</Text>
          <Pressable onPress={handleHistoryPress} style={styles.historyButton}>
            <Ionicons name="time-outline" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Tool Categories */}
        {filteredCategories.map((category) => (
          <ToolCategory key={category.id} title={t(category.titleKey)}>
            {category.tools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <ToolListItem
                  icon={<Ionicons name={tool.icon} size={22} color={colors.primary[500]} />}
                  title={t(tool.titleKey)}
                  description={t(tool.descriptionKey)}
                  onPress={() => handleToolPress(tool.id, t(tool.titleKey))}
                />
                {index < category.tools.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </ToolCategory>
        ))}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.neutral[300]} />
            <Text variant="body" color={colors.text.tertiary} style={styles.emptyText}>
              No tools found for &quot;{searchQuery}&quot;
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  historyButton: {
    padding: spacing[2],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginLeft: spacing[3] + 44 + spacing[3],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  emptyText: {
    marginTop: spacing[3],
    textAlign: 'center',
  },
});

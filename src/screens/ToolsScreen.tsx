import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { SearchBar, ToolListItem, ToolCategory } from '@/components/tools';
import { colors, spacing } from '@/theme';
import type { ToolsScreenProps } from '@/navigation';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ToolCategoryData {
  id: string;
  title: string;
  tools: Tool[];
}

const TOOL_CATEGORIES: ToolCategoryData[] = [
  {
    id: 'pdf',
    title: 'PDF Tools',
    tools: [
      {
        id: 'merge-pdf',
        title: 'Merge PDF',
        description: 'Combine multiple files',
        icon: 'git-merge-outline',
      },
      {
        id: 'compress-pdf',
        title: 'Compress PDF',
        description: 'Reduce file size',
        icon: 'resize-outline',
      },
    ],
  },
  {
    id: 'image',
    title: 'Image Tools',
    tools: [
      {
        id: 'resize-image',
        title: 'Resize Image',
        description: 'Change dimensions',
        icon: 'expand-outline',
      },
      {
        id: 'convert-jpg',
        title: 'Convert to JPG',
        description: 'Change format',
        icon: 'image-outline',
      },
    ],
  },
  {
    id: 'text',
    title: 'Text Tools',
    tools: [
      {
        id: 'word-counter',
        title: 'Word Counter',
        description: 'Count words & chars',
        icon: 'list-outline',
      },
      {
        id: 'case-converter',
        title: 'Case Converter',
        description: 'UPPER, lower, Title',
        icon: 'text-outline',
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    tools: [
      {
        id: 'json-formatter',
        title: 'JSON Formatter',
        description: 'Prettify code',
        icon: 'code-slash-outline',
      },
      {
        id: 'color-picker',
        title: 'Color Picker',
        description: 'Get Hex & RGB',
        icon: 'color-palette-outline',
      },
    ],
  },
];

export function ToolsScreen() {
  const navigation = useNavigation<ToolsScreenProps['navigation']>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return TOOL_CATEGORIES;
    }

    const query = searchQuery.toLowerCase();
    return TOOL_CATEGORIES.map((category) => ({
      ...category,
      tools: category.tools.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)
      ),
    })).filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const handleToolPress = (toolId: string, toolName: string) => {
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
          <Text variant="h1">Library</Text>
          <Pressable onPress={handleHistoryPress} style={styles.historyButton}>
            <Ionicons name="time-outline" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Tool Categories */}
        {filteredCategories.map((category) => (
          <ToolCategory key={category.id} title={category.title}>
            {category.tools.map((tool, index) => (
              <React.Fragment key={tool.id}>
                <ToolListItem
                  icon={<Ionicons name={tool.icon} size={22} color={colors.primary[500]} />}
                  title={tool.title}
                  description={tool.description}
                  onPress={() => handleToolPress(tool.id, tool.title)}
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

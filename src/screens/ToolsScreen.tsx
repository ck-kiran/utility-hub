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
import { TOOL_CATEGORIES, getCategoryTools, getTool } from '@/config/tools';
import { ToolId } from '@/types/tools';
import type { ToolsScreenProps } from '@/navigation';

export function ToolsScreen() {
  const navigation = useNavigation<ToolsScreenProps['navigation']>();
  const [searchQuery, setSearchQuery] = useState('');
  useAppStore((state) => state.language);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return TOOL_CATEGORIES.map((category) => ({
        ...category,
        tools: getCategoryTools(category.id),
      }));
    }

    const query = searchQuery.toLowerCase();
    return TOOL_CATEGORIES.map((category) => {
      const categoryTools = getCategoryTools(category.id);
      return {
        ...category,
        tools: categoryTools.filter((tool) => {
          const title = t(tool.titleKey).toLowerCase();
          const description = t(tool.descriptionKey).toLowerCase();
          return title.includes(query) || description.includes(query);
        }),
      };
    }).filter((category) => category.tools.length > 0);
  }, [searchQuery]);

  const handleToolPress = (toolId: string, toolName: string) => {
    const tool = getTool(toolId as ToolId);
    if (tool?.route) {
      // @ts-expect-error - Dynamic navigation
      navigation.navigate(tool.route);
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
                  icon={tool.icon}
                  title={t(tool.titleKey)}
                  description={t(tool.descriptionKey)}
                  themeColor={tool.themeColor}
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

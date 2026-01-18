import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { ToolCard, RecentFileItem, SectionHeader } from '@/components/home';
import { colors, spacing, borderRadius } from '@/theme';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import { getPopularTools } from '@/config/tools';
import type { HomeScreenProps } from '@/navigation';

const RECENT_FILES = [
  {
    id: '1',
    fileName: 'Project_Proposal_v2.pdf',
    action: 'Merged',
    timestamp: '2 mins ago',
    fileType: 'pdf' as const,
  },
  {
    id: '2',
    fileName: 'Vacation_Photos_Optimized.zip',
    action: 'Compressed',
    timestamp: 'Yesterday',
    fileType: 'zip' as const,
  },
];

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  useAppStore((state) => state.language);
  const popularTools = getPopularTools();

  const handleSearch = () => {
    navigation.navigate('MainTabs', { screen: 'Tools' });
  };

  const handleToolPress = (toolId: string, toolName: string) => {
    const tool = getPopularTools().find((t) => t.id === toolId);
    if (tool?.route) {
      // @ts-expect-error - Dynamic route navigation
      navigation.navigate(tool.route);
    } else {
      navigation.navigate('ToolDetail', { toolId, toolName });
    }
  };

  const handleSeeAllTools = () => {
    navigation.navigate('MainTabs', { screen: 'Tools' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="grid" size={20} color={colors.surface} />
            </View>
            <Text variant="h3">UtilityHub</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text variant="h1" style={styles.heroTitle}>
            {t('common.hero_title')}
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.heroSubtitle}>
            {t('common.hero_subtitle')}
          </Text>

          <Pressable style={styles.searchBar} onPress={handleSearch}>
            <View style={styles.searchContent}>
              <Ionicons name="search-outline" size={24} color={colors.primary[500]} />
              <Text color={colors.text.tertiary} style={styles.searchPlaceholder}>
                Search for tools...
              </Text>
            </View>
            <View style={styles.searchButton}>
              <Ionicons name="arrow-forward" size={20} color={colors.surface} />
            </View>
          </Pressable>
        </View>

        {/* Popular Tools */}
        <View style={styles.section}>
          <SectionHeader
            title={t('common.popular_tools')}
            actionLabel={t('common.see_all')}
            onActionPress={handleSeeAllTools}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll}>
            {popularTools.map((tool) => (
              <ToolCard
                key={tool.id}
                label={t(tool.titleKey)}
                icon={tool.icon}
                themeColor={tool.themeColor}
                onPress={() => handleToolPress(tool.id, t(tool.titleKey))}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Files */}
        <View style={styles.section}>
          <SectionHeader title={t('common.recent_files')} />
          {RECENT_FILES.map((file) => (
            <RecentFileItem
              key={file.id}
              fileName={file.fileName}
              action={file.action}
              timestamp={file.timestamp}
              fileType={file.fileType}
            />
          ))}
        </View>
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
    paddingVertical: spacing[3],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  heroSection: {
    paddingVertical: spacing[6],
  },
  heroTitle: {
    marginBottom: spacing[2],
    maxWidth: '80%',
  },
  heroSubtitle: {
    marginBottom: spacing[6],
    maxWidth: '90%',
    lineHeight: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing[2],
    paddingLeft: spacing[4],
    borderRadius: borderRadius.full,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: spacing[3],
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: spacing[6],
  },
  toolsScroll: {
    marginHorizontal: -spacing[4],
    paddingHorizontal: spacing[4],
  },
});

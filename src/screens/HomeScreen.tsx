import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/common';
import { ToolCard, RecentFileItem, SectionHeader } from '@/components/home';
import { colors, spacing } from '@/theme';
import type { HomeScreenProps } from '@/navigation';

const POPULAR_TOOLS = [
  { id: '1', label: 'Merge PDF', icon: 'git-merge-outline' as const },
  { id: '2', label: 'Image to PDF', icon: 'image-outline' as const },
  { id: '3', label: 'Compress PDF', icon: 'resize-outline' as const },
  { id: '4', label: 'Split PDF', icon: 'cut-outline' as const },
];

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

  const handleUpload = () => {
    // TODO: Implement file upload
  };

  const handleToolPress = (toolId: string, toolName: string) => {
    navigation.navigate('ToolDetail', { toolId, toolName });
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
          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text variant="h1" style={styles.heroTitle}>
            All Your File & Text Tools
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.heroSubtitle}>
            Convert, merge, and edit files in seconds. Simple and fast.
          </Text>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Ionicons name="cloud-upload-outline" size={20} color={colors.surface} />}
            onPress={handleUpload}
          >
            Upload File
          </Button>
        </View>

        {/* Popular Tools */}
        <View style={styles.section}>
          <SectionHeader
            title="Popular Tools"
            actionLabel="See All"
            onActionPress={handleSeeAllTools}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll}>
            {POPULAR_TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                label={tool.label}
                icon={<Ionicons name={tool.icon} size={28} color={colors.primary[500]} />}
                onPress={() => handleToolPress(tool.id, tool.label)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Files */}
        <View style={styles.section}>
          <SectionHeader title="Recent Files" />
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
  settingsButton: {
    padding: spacing[2],
  },
  heroSection: {
    paddingVertical: spacing[6],
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  heroSubtitle: {
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  section: {
    marginBottom: spacing[6],
  },
  toolsScroll: {
    marginHorizontal: -spacing[4],
    paddingHorizontal: spacing[4],
  },
});

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface RecentFileItemProps {
  fileName: string;
  action: string;
  timestamp: string;
  fileType: 'pdf' | 'image' | 'zip' | 'document';
  onPress?: () => void;
  onMenuPress?: () => void;
}

const FILE_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  pdf: { icon: 'document-text', color: colors.error[500] },
  image: { icon: 'image', color: colors.info[500] },
  zip: { icon: 'archive', color: colors.warning[500] },
  document: { icon: 'document', color: colors.neutral[500] },
};

export function RecentFileItem({
  fileName,
  action,
  timestamp,
  fileType,
  onPress,
  onMenuPress,
}: RecentFileItemProps) {
  const fileConfig = FILE_ICONS[fileType] || FILE_ICONS.document;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${fileConfig.color}15` }]}>
        <Ionicons name={fileConfig.icon} size={24} color={fileConfig.color} />
      </View>
      <View style={styles.content}>
        <Text variant="body" numberOfLines={1}>
          {fileName}
        </Text>
        <Text variant="caption" color={colors.text.tertiary}>
          {action} • {timestamp}
        </Text>
      </View>
      <Pressable onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={colors.neutral[400]} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
  menuButton: {
    padding: spacing[2],
  },
});

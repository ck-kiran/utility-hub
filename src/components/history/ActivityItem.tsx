import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Badge } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

type ActivityStatus = 'completed' | 'failed' | 'processing';
type ActionType = 'compressed' | 'converted' | 'extracted' | 'formatted' | 'merged';

interface ActivityItemProps {
  fileName: string;
  action: ActionType;
  status: ActivityStatus;
  timestamp: string;
  fileType: 'pdf' | 'image' | 'audio' | 'document' | 'archive';
  onPress?: () => void;
  onActionPress?: () => void;
}

const FILE_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  pdf: { icon: 'document-text', color: colors.primary[500] },
  image: { icon: 'image', color: colors.info[500] },
  audio: { icon: 'musical-notes', color: colors.error[400] },
  document: { icon: 'document', color: colors.info[500] },
  archive: { icon: 'archive', color: colors.warning[500] },
};

const ACTION_LABELS: Record<ActionType, string> = {
  compressed: 'COMPRESSED',
  converted: 'PNG CONVERT',
  extracted: 'EXTRACT',
  formatted: 'JSON FORMAT',
  merged: 'MERGED',
};

const STATUS_VARIANTS: Record<
  ActivityStatus,
  'default' | 'success' | 'error' | 'warning' | 'info'
> = {
  completed: 'info',
  failed: 'error',
  processing: 'warning',
};

export function ActivityItem({
  fileName,
  action,
  status,
  timestamp,
  fileType,
  onPress,
  onActionPress,
}: ActivityItemProps) {
  const fileConfig = FILE_ICONS[fileType] || FILE_ICONS.document;
  const actionLabel = status === 'failed' ? 'FAILED' : ACTION_LABELS[action];
  const badgeVariant = STATUS_VARIANTS[status];

  const getActionIcon = (): keyof typeof Ionicons.glyphMap => {
    if (status === 'failed') return 'refresh';
    if (action === 'converted') return 'share-outline';
    return 'download-outline';
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${fileConfig.color}15` }]}>
        <Ionicons name={fileConfig.icon} size={24} color={fileConfig.color} />
      </View>
      <View style={styles.content}>
        <Text variant="body" numberOfLines={1}>
          {fileName}
        </Text>
        <View style={styles.metaRow}>
          <Badge label={actionLabel} variant={badgeVariant} />
          <Text variant="caption" color={colors.text.tertiary} style={styles.timestamp}>
            • {timestamp}
          </Text>
        </View>
      </View>
      <Pressable onPress={onActionPress} style={styles.actionButton}>
        <Ionicons
          name={getActionIcon()}
          size={22}
          color={status === 'failed' ? colors.error[500] : colors.neutral[400]}
        />
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  timestamp: {
    marginLeft: spacing[2],
  },
  actionButton: {
    padding: spacing[2],
  },
});

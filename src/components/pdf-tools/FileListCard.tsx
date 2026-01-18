import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { FileItem } from '@/types/pdf';

interface FileListCardProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onAdd: () => void;
  maxFiles?: number;
  emptyStateText?: string;
  addButtonText?: string;
  testID?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function FileListCard({
  files,
  onRemove,
  onReorder,
  onAdd,
  maxFiles = 10,
  emptyStateText = 'No files selected',
  addButtonText = 'Add Files',
  testID,
}: FileListCardProps) {
  const canAddMore = files.length < maxFiles;

  const handleMoveUp = (index: number) => {
    if (onReorder && index > 0) {
      onReorder(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (onReorder && index < files.length - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <Card variant="outlined" padding={0} testID={testID}>
      {files.length === 0 ? (
        <Pressable style={styles.emptyState} onPress={onAdd} testID={`${testID}-empty`}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-outline" size={48} color={colors.neutral[300]} />
          </View>
          <Text variant="body" color={colors.text.tertiary} style={styles.emptyText}>
            {emptyStateText}
          </Text>
          <Text variant="caption" color={colors.primary[500]}>
            Tap to add files
          </Text>
        </Pressable>
      ) : (
        <View style={styles.listContainer}>
          {files.map((file, index) => (
            <View
              key={file.id}
              style={[styles.fileItem, index !== files.length - 1 && styles.fileItemBorder]}
            >
              <View style={styles.fileIcon}>
                <Ionicons
                  name={file.type === 'pdf' ? 'document' : 'image'}
                  size={24}
                  color={colors.error[500]}
                />
              </View>
              <View style={styles.fileInfo}>
                <Text variant="body" numberOfLines={1} style={styles.fileName}>
                  {file.name}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {formatFileSize(file.size)}
                </Text>
              </View>
              <View style={styles.fileActions}>
                {onReorder && files.length > 1 && (
                  <>
                    <Pressable
                      onPress={() => handleMoveUp(index)}
                      style={[styles.actionButton, index === 0 && styles.actionButtonDisabled]}
                      disabled={index === 0}
                    >
                      <Ionicons
                        name="chevron-up"
                        size={20}
                        color={index === 0 ? colors.neutral[300] : colors.text.secondary}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleMoveDown(index)}
                      style={[
                        styles.actionButton,
                        index === files.length - 1 && styles.actionButtonDisabled,
                      ]}
                      disabled={index === files.length - 1}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color={
                          index === files.length - 1 ? colors.neutral[300] : colors.text.secondary
                        }
                      />
                    </Pressable>
                  </>
                )}
                <Pressable
                  onPress={() => onRemove(file.id)}
                  style={styles.actionButton}
                  testID={`${testID}-remove-${index}`}
                >
                  <Ionicons name="close-circle" size={22} color={colors.error[400]} />
                </Pressable>
              </View>
            </View>
          ))}
          {canAddMore && (
            <Pressable style={styles.addMoreButton} onPress={onAdd} testID={`${testID}-add-more`}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
              <Text variant="body" color={colors.primary[500]} style={styles.addMoreText}>
                {addButtonText}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
  },
  emptyIconContainer: {
    marginBottom: spacing[3],
  },
  emptyText: {
    marginBottom: spacing[1],
  },
  listContainer: {
    paddingVertical: spacing[1],
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  fileItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  fileInfo: {
    flex: 1,
    marginRight: spacing[2],
  },
  fileName: {
    fontWeight: '500',
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing[1],
  },
  actionButtonDisabled: {
    opacity: 0.3,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  addMoreText: {
    marginLeft: spacing[1],
    fontWeight: '500',
  },
});

export default FileListCard;

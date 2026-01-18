import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { FileItem } from '@/types/pdf';

interface PagePreviewProps {
  file: FileItem | null;
  pageCount?: number;
  testID?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function PagePreview({ file, pageCount = 0, testID }: PagePreviewProps) {
  if (!file) {
    return (
      <Card variant="outlined" padding={4} testID={testID}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="document-outline" size={48} color={colors.neutral[300]} />
          </View>
          <Text variant="body" color={colors.text.tertiary}>
            No PDF selected
          </Text>
          <Text variant="caption" color={colors.text.tertiary}>
            Select a PDF to preview pages
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding={0} testID={testID}>
      <View style={styles.container}>
        <View style={styles.fileHeader}>
          <View style={styles.fileIcon}>
            <Ionicons name="document" size={32} color={colors.error[500]} />
          </View>
          <View style={styles.fileInfo}>
            <Text variant="body" numberOfLines={1} style={styles.fileName}>
              {file.name}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.pageGrid}>
          {Array.from({ length: Math.min(pageCount, 6) }, (_, index) => (
            <View key={index} style={styles.pageItem}>
              <View style={styles.pageThumbnail}>
                <Ionicons name="document-text-outline" size={24} color={colors.neutral[400]} />
              </View>
              <Text variant="caption" color={colors.text.secondary} style={styles.pageNumber}>
                Page {index + 1}
              </Text>
            </View>
          ))}
          {pageCount > 6 && (
            <View style={styles.pageItem}>
              <View style={[styles.pageThumbnail, styles.morePages]}>
                <Text variant="body" color={colors.text.secondary} style={styles.moreText}>
                  +{pageCount - 6}
                </Text>
              </View>
              <Text variant="caption" color={colors.text.secondary} style={styles.pageNumber}>
                More
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  emptyIconContainer: {
    marginBottom: spacing[3],
  },
  container: {
    paddingVertical: spacing[3],
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.error[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  pageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[2],
    gap: spacing[2],
  },
  pageItem: {
    width: '30%',
    alignItems: 'center',
  },
  pageThumbnail: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  morePages: {
    backgroundColor: colors.neutral[50],
  },
  moreText: {
    fontWeight: '600',
  },
  pageNumber: {
    fontSize: 11,
  },
});

export default PagePreview;

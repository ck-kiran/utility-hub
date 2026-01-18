import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { FileItem } from '@/types/pdf';

interface ImageGridProps {
  images: FileItem[];
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onAdd: () => void;
  maxImages?: number;
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

export function ImageGrid({
  images,
  onRemove,
  onAdd,
  maxImages = 20,
  emptyStateText = 'No images selected',
  addButtonText = 'Add Images',
  testID,
}: ImageGridProps) {
  const canAddMore = images.length < maxImages;

  return (
    <Card variant="outlined" padding={0} testID={testID}>
      {images.length === 0 ? (
        <Pressable style={styles.emptyState} onPress={onAdd} testID={`${testID}-empty`}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="images-outline" size={48} color={colors.neutral[300]} />
          </View>
          <Text variant="body" color={colors.text.tertiary} style={styles.emptyText}>
            {emptyStateText}
          </Text>
          <Text variant="caption" color={colors.primary[500]}>
            Tap to add images
          </Text>
        </Pressable>
      ) : (
        <View style={styles.container}>
          <View style={styles.grid}>
            {images.map((image, index) => (
              <View key={image.id} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
                <View style={styles.imageOverlay}>
                  <View style={styles.imageNumber}>
                    <Text variant="caption" color={colors.white} style={styles.numberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => onRemove(image.id)}
                    style={styles.removeButton}
                    testID={`${testID}-remove-${index}`}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.white} />
                  </Pressable>
                </View>
                <View style={styles.imageInfo}>
                  <Text variant="caption" numberOfLines={1} color={colors.white}>
                    {image.name}
                  </Text>
                  <Text variant="caption" color={colors.neutral[300]}>
                    {formatFileSize(image.size)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
  container: {
    paddingVertical: spacing[1],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing[2],
    gap: spacing[2],
  },
  imageItem: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.neutral[100],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[2],
  },
  imageNumber: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontWeight: '700',
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: borderRadius.full,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing[2],
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

export default ImageGrid;

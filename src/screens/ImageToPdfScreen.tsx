import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { ImageGrid, QualitySelector, ProgressIndicator } from '@/components/pdf-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';

type Quality = 'low' | 'medium' | 'high';

export function ImageToPdfScreen() {
  const navigation = useNavigation();
  const {
    files: images,
    pickImages,
    removeFile,
    clearFiles,
  } = useFilePicker({
    fileType: 'image',
    multiple: true,
  });

  const [quality, setQuality] = useState<Quality>('medium');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    clearFiles();
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      Alert.alert('No images', 'Please select at least one image to convert.');
      return;
    }

    setProcessingState({ status: 'processing', progress: 0, message: 'Preparing images...' });

    try {
      // Simulate image to PDF conversion progress
      // TODO: Replace with actual conversion logic when native library is available
      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProcessingState({
          status: 'processing',
          progress: i / 10,
          message:
            i < 3 ? 'Processing images...' : i < 7 ? 'Optimizing quality...' : 'Creating PDF...',
        });
      }

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: `Conversion complete! Quality: ${quality}`,
        outputUri: images[0].uri, // Placeholder - would be the generated PDF
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : 'Failed to convert images to PDF',
      });
    }
  }, [images, quality]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(processingState.outputUri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save PDF',
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert('Error', 'Failed to share the file.');
      }
    }
  }, [processingState.outputUri]);

  const canConvert = images.length > 0 && processingState.status !== 'processing';
  const canSave = processingState.status === 'complete' && processingState.outputUri;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text variant="h3" style={styles.headerTitle}>
              Image to PDF
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={images.length === 0}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={images.length > 0 ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              Select images to convert into a single PDF document. Images will be added in order.
            </Text>
          </View>

          {/* Image Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                SELECTED IMAGES ({images.length})
              </Text>
            </View>
            <ImageGrid
              images={images}
              onRemove={removeFile}
              onAdd={pickImages}
              maxImages={50}
              emptyStateText="No images selected"
              addButtonText="Add More Images"
              testID="image-grid"
            />
          </View>

          {/* Quality Selection */}
          {images.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  PDF QUALITY
                </Text>
              </View>
              <QualitySelector value={quality} onChange={setQuality} testID="quality-selector" />
            </View>
          )}

          {/* Progress */}
          {processingState.status !== 'idle' && (
            <View style={styles.section}>
              <ProgressIndicator state={processingState} testID="progress" />
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {canSave ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="share-outline" size={20} color={colors.surface} />}
              onPress={handleSave}
              testID="save-button"
            >
              Save & Share
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.surface} />}
              onPress={handleConvert}
              disabled={!canConvert}
              loading={processingState.status === 'processing'}
              testID="convert-button"
            >
              Convert to PDF
            </Button>
          )}
        </View>
      </View>
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
  },
  scrollContent: {
    paddingBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  clearButton: {
    padding: spacing[2],
    marginRight: -spacing[2],
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  sectionHeader: {
    marginBottom: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

export default ImageToPdfScreen;

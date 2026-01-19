import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { ProgressIndicator } from '@/components/pdf-tools';
import { ImageCropper, CropArea } from '@/components/image-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';
import { t } from '@/i18n';

type ViewMode = 'select' | 'crop' | 'result';

export function ResizeImageScreen() {
  const navigation = useNavigation();
  const {
    files: images,
    pickImages,
    clearFiles,
  } = useFilePicker({
    fileType: 'image',
    multiple: false,
  });

  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const selectedImage = images.length > 0 ? images[0] : null;

  // Switch to crop mode when image is selected
  useEffect(() => {
    if (images.length > 0 && viewMode === 'select') {
      setViewMode('crop');
    }
  }, [images, viewMode]);

  const handleBack = () => {
    if (viewMode === 'crop') {
      setViewMode('select');
    } else {
      navigation.goBack();
    }
  };

  const handleClear = () => {
    clearFiles();
    setViewMode('select');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleSelectImage = async () => {
    await pickImages();
    // pickImages updates the files state in the hook
    // The view mode will be set via useEffect when images change
  };

  const handleApplyCrop = useCallback(async () => {
    if (!selectedImage) return;

    setProcessingState({ status: 'processing', progress: 0, message: 'Cropping image...' });

    try {
      const { cropImage } = await import('@/services/imageService');

      setProcessingState({
        status: 'processing',
        progress: 0.3,
        message: 'Processing image...',
      });

      const outputUri = await cropImage({
        imageUri: selectedImage.uri,
        cropArea,
        onProgress: (progress: number, message: string) => {
          setProcessingState({
            status: 'processing',
            progress,
            message,
          });
        },
      });

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: 'Image cropped successfully!',
        outputUri,
      });

      setViewMode('result');
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('common.error'),
      });
      Alert.alert(t('common.error'), 'Failed to crop image');
    }
  }, [selectedImage, cropArea]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(processingState.outputUri, {
            mimeType: 'image/png',
            dialogTitle: t('common.save'),
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert(t('common.error'), 'Failed to share the file.');
      }
    }
  }, [processingState.outputUri]);

  const handleCropAnother = () => {
    setViewMode('select');
    clearFiles();
    setProcessingState({ status: 'idle', progress: 0 });
  };

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
              {viewMode === 'crop' ? 'Crop Image' : t('tools.resize_image')}
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={!selectedImage}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={selectedImage ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Select Image View */}
          {viewMode === 'select' && !selectedImage && (
            <View style={styles.section}>
              <View style={styles.uploadCard}>
                <Ionicons name="image-outline" size={64} color={colors.text.tertiary} />
                <Text variant="body" color={colors.text.secondary} style={styles.uploadText}>
                  Select an image to resize and crop
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Ionicons name="add" size={20} color={colors.surface} />}
                  onPress={handleSelectImage}
                  testID="select-image-button"
                >
                  Select Image
                </Button>
              </View>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                  Interactive Crop: Drag corners to adjust crop area. Supports all standard image
                  formats (JPG, PNG, etc.)
                </Text>
              </View>
            </View>
          )}

          {/* Crop View */}
          {viewMode === 'crop' && selectedImage && (
            <View style={styles.section}>
              {/* Aspect Ratio Presets */}
              <View style={styles.aspectRatioContainer}>
                <Text
                  variant="caption"
                  color={colors.text.secondary}
                  style={styles.aspectRatioLabel}
                >
                  Aspect Ratio:
                </Text>
                <View style={styles.aspectRatioButtons}>
                  <Pressable
                    style={[
                      styles.aspectRatioButton,
                      aspectRatio === null && styles.aspectRatioButtonActive,
                    ]}
                    onPress={() => setAspectRatio(null)}
                  >
                    <Text
                      variant="caption"
                      color={aspectRatio === null ? colors.surface : colors.text.primary}
                      style={styles.aspectRatioButtonText}
                    >
                      Free
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.aspectRatioButton,
                      aspectRatio === 1 && styles.aspectRatioButtonActive,
                    ]}
                    onPress={() => setAspectRatio(1)}
                  >
                    <Text
                      variant="caption"
                      color={aspectRatio === 1 ? colors.surface : colors.text.primary}
                      style={styles.aspectRatioButtonText}
                    >
                      1:1
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.aspectRatioButton,
                      aspectRatio === 16 / 9 && styles.aspectRatioButtonActive,
                    ]}
                    onPress={() => setAspectRatio(16 / 9)}
                  >
                    <Text
                      variant="caption"
                      color={aspectRatio === 16 / 9 ? colors.surface : colors.text.primary}
                      style={styles.aspectRatioButtonText}
                    >
                      16:9
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.aspectRatioButton,
                      aspectRatio === 4 / 3 && styles.aspectRatioButtonActive,
                    ]}
                    onPress={() => setAspectRatio(4 / 3)}
                  >
                    <Text
                      variant="caption"
                      color={aspectRatio === 4 / 3 ? colors.surface : colors.text.primary}
                      style={styles.aspectRatioButtonText}
                    >
                      4:3
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.aspectRatioButton,
                      aspectRatio === 3 / 2 && styles.aspectRatioButtonActive,
                    ]}
                    onPress={() => setAspectRatio(3 / 2)}
                  >
                    <Text
                      variant="caption"
                      color={aspectRatio === 3 / 2 ? colors.surface : colors.text.primary}
                      style={styles.aspectRatioButtonText}
                    >
                      3:2
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.cropContainer}>
                <ImageCropper
                  imageUri={selectedImage.uri}
                  onCropChange={setCropArea}
                  aspectRatio={aspectRatio}
                />
              </View>

              <View style={styles.instructionsCard}>
                <Ionicons name="hand-left-outline" size={20} color={colors.primary[500]} />
                <View style={styles.instructionsText}>
                  <Text variant="caption" color={colors.text.secondary}>
                    • Drag corners to resize crop area{'\n'}• Tap inside to move crop area{'\n'}•
                    Use grid for alignment
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Processing State */}
          {processingState.status === 'processing' && (
            <View style={styles.section}>
              <ProgressIndicator state={processingState} />
            </View>
          )}

          {/* Result View */}
          {viewMode === 'result' &&
            processingState.status === 'complete' &&
            processingState.outputUri && (
              <View style={styles.section}>
                <View style={styles.resultCard}>
                  <Image
                    source={{ uri: processingState.outputUri }}
                    style={styles.resultImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.successCard}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success[500]} />
                  <Text variant="body" color={colors.success[700]} style={styles.successText}>
                    {processingState.message}
                  </Text>
                </View>
              </View>
            )}

          {/* Error State */}
          {processingState.status === 'error' && (
            <View style={styles.section}>
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle" size={24} color={colors.error[500]} />
                <Text variant="body" color={colors.error[700]} style={styles.errorText}>
                  {processingState.message}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {viewMode === 'crop' && selectedImage && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="checkmark" size={20} color={colors.surface} />}
              onPress={handleApplyCrop}
              disabled={processingState.status === 'processing'}
              testID="apply-crop-button"
            >
              Apply Crop
            </Button>
          )}

          {viewMode === 'result' && processingState.status === 'complete' && (
            <View style={styles.actionButtons}>
              <Button
                variant="outline"
                size="lg"
                style={styles.actionButton}
                leftIcon={<Ionicons name="refresh" size={20} color={colors.primary[500]} />}
                onPress={handleCropAnother}
                testID="crop-another-button"
              >
                Crop Another
              </Button>
              <Button
                variant="primary"
                size="lg"
                style={styles.actionButton}
                leftIcon={<Ionicons name="download-outline" size={20} color={colors.surface} />}
                onPress={handleSave}
                testID="save-button"
              >
                Save
              </Button>
            </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
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
    marginTop: spacing[4],
  },
  uploadCard: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[3],
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  uploadText: {
    textAlign: 'center',
    marginTop: spacing[3],
    marginBottom: spacing[4],
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[3],
    borderRadius: spacing[2],
    backgroundColor: colors.info[50],
    borderWidth: 1,
    borderColor: colors.info[200],
    marginTop: spacing[4],
  },
  infoText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  cropContainer: {
    backgroundColor: colors.neutral[900],
    borderRadius: spacing[2],
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[3],
    borderRadius: spacing[2],
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    marginTop: spacing[4],
  },
  instructionsText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  resultCard: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[2],
    padding: spacing[3],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  resultImage: {
    width: '100%',
    height: 400,
    borderRadius: spacing[2],
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: spacing[2],
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
    marginTop: spacing[4],
  },
  successText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: spacing[2],
    backgroundColor: colors.error[50],
    borderWidth: 1,
    borderColor: colors.error[200],
  },
  errorText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
  aspectRatioContainer: {
    marginBottom: spacing[3],
  },
  aspectRatioLabel: {
    marginBottom: spacing[2],
  },
  aspectRatioButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  aspectRatioButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aspectRatioButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  aspectRatioButtonText: {
    fontWeight: '600',
  },
});

export default ResizeImageScreen;

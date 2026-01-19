import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { ProgressIndicator } from '@/components/pdf-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';
import { t } from '@/i18n';

type ConversionFormat = 'jpeg' | 'png';
type QualityLevel = 'low' | 'medium' | 'high' | 'maximum';

export function ConvertToJpgScreen() {
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

  const [format, setFormat] = useState<ConversionFormat>('jpeg');
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('high');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    clearFiles();
    setFormat('jpeg');
    setQualityLevel('high');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const getQualityValue = (level: QualityLevel): number => {
    const qualityMap = {
      low: 0.5,
      medium: 0.7,
      high: 0.9,
      maximum: 1.0,
    };
    return qualityMap[level];
  };

  const handleConvert = useCallback(async () => {
    if (images.length === 0) {
      Alert.alert(t('common.error'), 'Please select at least one image');
      return;
    }

    setProcessingState({ status: 'processing', progress: 0, message: 'Starting conversion...' });

    try {
      const { batchConvertImages } = await import('@/services/imageService');

      const quality = getQualityValue(qualityLevel);
      const outputUris: string[] = [];

      // Use batch conversion
      const results = await batchConvertImages(
        images.map((img) => img.uri),
        {
          format,
          quality,
        },
        (current, total, message) => {
          setProcessingState({
            status: 'processing',
            progress: current / total,
            message,
          });
        }
      );

      outputUris.push(...results);

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: `${images.length} ${images.length === 1 ? 'image' : 'images'} converted to ${format.toUpperCase()}!`,
        outputUri: outputUris[0], // Store first image for sharing
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('common.error'),
      });
    }
  }, [images, format, qualityLevel]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
          await Sharing.shareAsync(processingState.outputUri, {
            mimeType,
            dialogTitle: t('common.save'),
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert(t('common.error'), 'Failed to share the file.');
      }
    }
  }, [processingState.outputUri, format]);

  const canConvert = images.length > 0 && processingState.status !== 'processing';
  const canSave = processingState.status === 'complete' && processingState.outputUri;

  const formatOptions = [
    {
      value: 'jpeg' as const,
      label: 'JPG/JPEG',
      description: 'Smaller file size, lossy compression',
      icon: 'image-outline' as const,
    },
    {
      value: 'png' as const,
      label: 'PNG',
      description: 'Larger file size, lossless compression',
      icon: 'images-outline' as const,
    },
  ];

  const qualityOptions = [
    { value: 'low' as const, label: 'Low', description: 'Smallest file (50%)' },
    { value: 'medium' as const, label: 'Medium', description: 'Balanced (70%)' },
    { value: 'high' as const, label: 'High', description: 'Better quality (90%)' },
    { value: 'maximum' as const, label: 'Maximum', description: 'Best quality (100%)' },
  ];

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
              Convert Image
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
              Select images and choose format to convert them
            </Text>
          </View>

          {/* Image Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                SELECTED IMAGES ({images.length})
              </Text>
            </View>
            {images.length > 0 ? (
              <View style={styles.imageList}>
                {images.map((image) => (
                  <View key={image.id} style={styles.imageItem}>
                    <View style={styles.imageItemContent}>
                      <Ionicons name="image" size={24} color={colors.primary[500]} />
                      <View style={styles.imageItemInfo}>
                        <Text variant="body" numberOfLines={1}>
                          {image.name}
                        </Text>
                        <Text variant="caption" color={colors.text.tertiary}>
                          {(image.size / 1024).toFixed(2)} KB
                        </Text>
                      </View>
                    </View>
                    <Pressable onPress={() => removeFile(image.id)} style={styles.removeButton}>
                      <Ionicons name="close-circle" size={24} color={colors.error[500]} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={<Ionicons name="add-outline" size={20} color={colors.primary[500]} />}
              onPress={pickImages}
              style={{ marginTop: images.length > 0 ? spacing[3] : 0 }}
              testID="select-images-button"
            >
              {images.length > 0 ? 'Add More Images' : 'Select Images'}
            </Button>
          </View>

          {/* Format Selection */}
          {images.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  OUTPUT FORMAT
                </Text>
              </View>
              {formatOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.formatOption,
                    format === option.value && styles.formatOptionSelected,
                  ]}
                  onPress={() => setFormat(option.value)}
                  testID={`format-${option.value}`}
                >
                  <View style={styles.formatIconContainer}>
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={format === option.value ? colors.primary[500] : colors.text.secondary}
                    />
                  </View>
                  <View style={styles.formatInfo}>
                    <Text
                      variant="body"
                      color={format === option.value ? colors.primary[500] : colors.text.primary}
                    >
                      {option.label}
                    </Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      {option.description}
                    </Text>
                  </View>
                  {format === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Quality Selection (for JPEG) */}
          {images.length > 0 && format === 'jpeg' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  QUALITY
                </Text>
              </View>
              {qualityOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    qualityLevel === option.value && styles.qualityOptionSelected,
                  ]}
                  onPress={() => setQualityLevel(option.value)}
                  testID={`quality-${option.value}`}
                >
                  <View style={styles.qualityInfo}>
                    <Text
                      variant="body"
                      color={
                        qualityLevel === option.value ? colors.primary[500] : colors.text.primary
                      }
                    >
                      {option.label}
                    </Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      {option.description}
                    </Text>
                  </View>
                  {qualityLevel === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                  )}
                </Pressable>
              ))}
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
              leftIcon={
                <Ionicons name="swap-horizontal-outline" size={20} color={colors.surface} />
              }
              onPress={handleConvert}
              disabled={!canConvert}
              loading={processingState.status === 'processing'}
              testID="convert-button"
            >
              Convert Images
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
  imageList: {
    marginBottom: spacing[2],
  },
  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
  },
  imageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageItemInfo: {
    marginLeft: spacing[3],
    flex: 1,
  },
  removeButton: {
    marginLeft: spacing[2],
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
  },
  formatOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  formatIconContainer: {
    marginRight: spacing[3],
  },
  formatInfo: {
    flex: 1,
  },
  qualityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
  },
  qualityOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  qualityInfo: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

export default ConvertToJpgScreen;

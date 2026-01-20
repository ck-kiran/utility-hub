import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, TextInput } from 'react-native';
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

type ResizePreset = 'small' | 'medium' | 'large' | 'custom';

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

  const [preset, setPreset] = useState<ResizePreset>('medium');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const selectedImage = images.length > 0 ? images[0] : null;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    clearFiles();
    setPreset('medium');
    setCustomWidth('');
    setCustomHeight('');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleResize = useCallback(async () => {
    if (!selectedImage) {
      Alert.alert(t('common.error'), 'Please select an image to resize');
      return;
    }

    // Validate custom dimensions
    if (preset === 'custom') {
      const width = parseInt(customWidth);
      const height = parseInt(customHeight);

      if (!customWidth && !customHeight) {
        Alert.alert(t('common.error'), 'Please enter at least width or height');
        return;
      }

      if ((customWidth && isNaN(width)) || (customHeight && isNaN(height))) {
        Alert.alert(t('common.error'), 'Please enter valid dimensions');
        return;
      }

      if ((customWidth && width <= 0) || (customHeight && height <= 0)) {
        Alert.alert(t('common.error'), 'Dimensions must be greater than 0');
        return;
      }
    }

    setProcessingState({ status: 'processing', progress: 0, message: 'Starting...' });

    try {
      const { resizeImage } = await import('@/services/imageService');

      const baseOptions = {
        imageUri: selectedImage.uri,
        maintainAspectRatio,
        quality: 0.9,
        onProgress: (progress: number, message: string) => {
          setProcessingState({
            status: 'processing',
            progress,
            message,
          });
        },
      };

      const options =
        preset === 'custom'
          ? {
              ...baseOptions,
              width: customWidth ? parseInt(customWidth) : undefined,
              height: customHeight ? parseInt(customHeight) : undefined,
            }
          : {
              ...baseOptions,
              preset,
            };

      const outputUri = await resizeImage(options);

      const presetText =
        preset === 'custom' ? `${customWidth || 'auto'}x${customHeight || 'auto'}` : preset;

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: `Image resized to ${presetText}!`,
        outputUri,
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('common.error'),
      });
    }
  }, [selectedImage, preset, customWidth, customHeight, maintainAspectRatio]);

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

  const canResize = selectedImage && processingState.status !== 'processing';
  const canSave = processingState.status === 'complete' && processingState.outputUri;

  const presetOptions = [
    { value: 'small', label: 'Small (640x480)', icon: 'contract-outline' },
    { value: 'medium', label: 'Medium (1280x720)', icon: 'resize-outline' },
    { value: 'large', label: 'Large (1920x1080)', icon: 'expand-outline' },
    { value: 'custom', label: 'Custom Size', icon: 'settings-outline' },
  ] as const;

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
              {t('tools.resize_image')}
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
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              Select an image and choose dimensions to resize it
            </Text>
          </View>

          {/* Image Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                IMAGE
              </Text>
            </View>
            {selectedImage ? (
              <View style={styles.imagePreview}>
                <Ionicons name="image" size={48} color={colors.primary[500]} />
                <Text variant="body" style={styles.imageName}>
                  {selectedImage.name}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {(selectedImage.size / 1024).toFixed(2)} KB
                </Text>
              </View>
            ) : (
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<Ionicons name="image-outline" size={20} color={colors.primary[500]} />}
                onPress={pickImages}
                testID="select-image-button"
              >
                Select Image
              </Button>
            )}
          </View>

          {/* Preset Selection */}
          {selectedImage && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  SIZE PRESET
                </Text>
              </View>
              {presetOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.presetOption,
                    preset === option.value && styles.presetOptionSelected,
                  ]}
                  onPress={() => setPreset(option.value)}
                  testID={`preset-${option.value}`}
                >
                  <View style={styles.presetIconContainer}>
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={preset === option.value ? colors.primary[500] : colors.text.secondary}
                    />
                  </View>
                  <Text
                    variant="body"
                    color={preset === option.value ? colors.primary[500] : colors.text.primary}
                  >
                    {option.label}
                  </Text>
                  {preset === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Custom Dimensions */}
          {selectedImage && preset === 'custom' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  CUSTOM DIMENSIONS (PX)
                </Text>
              </View>
              <View style={styles.dimensionInputs}>
                <View style={styles.dimensionInput}>
                  <Text variant="caption" color={colors.text.tertiary} style={styles.inputLabel}>
                    Width
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={customWidth}
                    onChangeText={setCustomWidth}
                    keyboardType="numeric"
                    placeholder="Auto"
                    placeholderTextColor={colors.text.tertiary}
                  />
                </View>
                <Text variant="h3" color={colors.text.tertiary}>
                  ×
                </Text>
                <View style={styles.dimensionInput}>
                  <Text variant="caption" color={colors.text.tertiary} style={styles.inputLabel}>
                    Height
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={customHeight}
                    onChangeText={setCustomHeight}
                    keyboardType="numeric"
                    placeholder="Auto"
                    placeholderTextColor={colors.text.tertiary}
                  />
                </View>
              </View>
              <Pressable
                style={styles.aspectRatioToggle}
                onPress={() => setMaintainAspectRatio(!maintainAspectRatio)}
              >
                <Ionicons
                  name={maintainAspectRatio ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={maintainAspectRatio ? colors.primary[500] : colors.text.tertiary}
                />
                <Text variant="body" color={colors.text.secondary} style={styles.aspectRatioText}>
                  Maintain aspect ratio
                </Text>
              </Pressable>
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
              leftIcon={<Ionicons name="resize-outline" size={20} color={colors.surface} />}
              onPress={handleResize}
              disabled={!canResize}
              loading={processingState.status === 'processing'}
              testID="resize-button"
            >
              Resize Image
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
  imagePreview: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing[4],
    alignItems: 'center',
  },
  imageName: {
    marginTop: spacing[2],
    textAlign: 'center',
  },
  presetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
  },
  presetOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  presetIconContainer: {
    marginRight: spacing[3],
  },
  dimensionInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  dimensionInput: {
    flex: 1,
  },
  inputLabel: {
    marginBottom: spacing[1],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: spacing[2],
    padding: spacing[3],
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  aspectRatioToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aspectRatioText: {
    marginLeft: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

export default ResizeImageScreen;

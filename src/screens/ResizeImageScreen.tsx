import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { ProgressIndicator } from '@/components/pdf-tools';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';
import { t } from '@/i18n';

type ViewMode = 'select' | 'result';
type AspectRatio = [number, number] | undefined;

const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: [1, 1] },
  { label: '16:9', value: [16, 9] },
  { label: '4:3', value: [4, 3] },
  { label: '3:2', value: [3, 2] },
];

export function ResizeImageScreen() {
  const navigation = useNavigation();

  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setSelectedImage(null);
    setViewMode('select');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleSelectAndCropImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant access to your photo library.');
        return;
      }

      // Launch image picker with crop editor
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: selectedAspectRatio,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const croppedUri = result.assets[0].uri;
        setSelectedImage(croppedUri);
        setProcessingState({
          status: 'complete',
          progress: 1,
          message: 'Image cropped successfully!',
          outputUri: croppedUri,
        });
        setViewMode('result');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error'), 'Failed to pick and crop image');
    }
  };

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
    setSelectedImage(null);
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
          {/* Select Image View */}
          {viewMode === 'select' && !selectedImage && (
            <View style={styles.section}>
              {/* Aspect Ratio Selection */}
              <View style={styles.aspectRatioCard}>
                <Text variant="body" style={styles.aspectRatioTitle}>
                  Select Aspect Ratio
                </Text>
                <View style={styles.aspectRatioButtons}>
                  {ASPECT_RATIOS.map((ratio) => (
                    <Pressable
                      key={ratio.label}
                      style={[
                        styles.aspectRatioButton,
                        selectedAspectRatio === ratio.value && styles.aspectRatioButtonActive,
                      ]}
                      onPress={() => setSelectedAspectRatio(ratio.value)}
                    >
                      <Text
                        variant="caption"
                        color={
                          selectedAspectRatio === ratio.value ? colors.surface : colors.text.primary
                        }
                        style={styles.aspectRatioButtonText}
                      >
                        {ratio.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.uploadCard}>
                <Ionicons name="image-outline" size={64} color={colors.text.tertiary} />
                <Text variant="body" color={colors.text.secondary} style={styles.uploadText}>
                  Select an image to crop
                </Text>
                <Text variant="caption" color={colors.text.tertiary} style={styles.uploadSubtext}>
                  Uses native crop editor for smooth experience
                </Text>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Ionicons name="crop" size={20} color={colors.surface} />}
                  onPress={handleSelectAndCropImage}
                  testID="select-image-button"
                  style={styles.selectButton}
                >
                  Select & Crop Image
                </Button>
              </View>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                  Native Crop UI: Select an aspect ratio above, then pick your image. You&apos;ll be
                  able to crop it using your device&apos;s built-in crop tool.
                </Text>
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
  aspectRatioCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing[3],
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  aspectRatioTitle: {
    marginBottom: spacing[3],
    fontWeight: '600',
  },
  aspectRatioButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  aspectRatioButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
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
    marginBottom: spacing[1],
  },
  uploadSubtext: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  selectButton: {
    minWidth: 200,
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
});

export default ResizeImageScreen;

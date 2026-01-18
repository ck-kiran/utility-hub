import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { FormatSelector, PagePreview, ProgressIndicator } from '@/components/pdf-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';

type ImageFormat = 'png' | 'jpg';

export function PdfToImageScreen() {
  const navigation = useNavigation();
  const { files, pickFiles, clearFiles } = useFilePicker({
    fileType: 'pdf',
    multiple: false,
  });

  const [format, setFormat] = useState<ImageFormat>('png');
  const [pageCount, setPageCount] = useState(0);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  const pdfFile = files.length > 0 ? files[0] : null;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    clearFiles();
    setPageCount(0);
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleSelectPdf = useCallback(async () => {
    await pickFiles();
    // Simulate getting page count from PDF
    // TODO: Replace with actual PDF page count when native library is available
    const simulatedPageCount = Math.floor(Math.random() * 10) + 1;
    setPageCount(simulatedPageCount);
  }, [pickFiles]);

  const handleConvert = useCallback(async () => {
    if (!pdfFile) {
      Alert.alert('No PDF', 'Please select a PDF file to convert.');
      return;
    }

    setProcessingState({ status: 'processing', progress: 0, message: 'Loading PDF...' });

    try {
      // Simulate PDF to image conversion progress
      // TODO: Replace with actual conversion logic when native library is available
      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setProcessingState({
          status: 'processing',
          progress: i / 10,
          message:
            i < 3
              ? 'Reading PDF pages...'
              : i < 7
                ? `Extracting pages...`
                : `Converting to ${format.toUpperCase()}...`,
        });
      }

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: `${pageCount} ${pageCount === 1 ? 'image' : 'images'} created (${format.toUpperCase()})`,
        outputUri: pdfFile.uri, // Placeholder - would be folder with images
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : 'Failed to convert PDF to images',
      });
    }
  }, [pdfFile, format, pageCount]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // In real implementation, would share a ZIP file of images
          await Sharing.shareAsync(processingState.outputUri, {
            dialogTitle: 'Save Images',
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert('Error', 'Failed to share the files.');
      }
    }
  }, [processingState.outputUri]);

  const canConvert = pdfFile && pageCount > 0 && processingState.status !== 'processing';
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
              PDF to Image
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={!pdfFile}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={pdfFile ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              Select a PDF file to extract pages as individual images.
            </Text>
          </View>

          {/* PDF Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                PDF FILE
              </Text>
            </View>
            <PagePreview file={pdfFile} pageCount={pageCount} testID="page-preview" />
            {!pdfFile && (
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={
                  <Ionicons name="document-outline" size={20} color={colors.primary[500]} />
                }
                onPress={handleSelectPdf}
                style={styles.selectButton}
                testID="select-pdf-button"
              >
                Select PDF
              </Button>
            )}
          </View>

          {/* Format Selection */}
          {pdfFile && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  OUTPUT FORMAT
                </Text>
              </View>
              <FormatSelector value={format} onChange={setFormat} testID="format-selector" />
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
              leftIcon={<Ionicons name="images-outline" size={20} color={colors.surface} />}
              onPress={handleConvert}
              disabled={!canConvert}
              loading={processingState.status === 'processing'}
              testID="convert-button"
            >
              Convert to Images
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
  selectButton: {
    marginTop: spacing[3],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

export default PdfToImageScreen;

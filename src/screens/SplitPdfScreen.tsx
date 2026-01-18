import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { PagePreview, PageRangeSelector, ProgressIndicator } from '@/components/pdf-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';
import { t } from '@/i18n';

type SplitMode = 'all' | 'custom';

export function SplitPdfScreen() {
  const navigation = useNavigation();
  const { files, pickFiles, clearFiles } = useFilePicker({
    fileType: 'pdf',
    multiple: false,
  });

  const [splitMode, setSplitMode] = useState<SplitMode>('all');
  const [pageRange, setPageRange] = useState('');
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
    setPageRange('');
    setSplitMode('all');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const handleSelectPdf = useCallback(async () => {
    await pickFiles();
    // Simulate getting page count from PDF
    // TODO: Replace with actual PDF page count when native library is available
    const simulatedPageCount = Math.floor(Math.random() * 15) + 3;
    setPageCount(simulatedPageCount);
  }, [pickFiles]);

  const validatePageRange = (range: string, maxPage: number): boolean => {
    if (!range.trim()) return false;

    const parts = range.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPage || start > end) {
          return false;
        }
      } else {
        const page = parseInt(part);
        if (isNaN(page) || page < 1 || page > maxPage) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSplit = useCallback(async () => {
    if (!pdfFile) {
      Alert.alert(t('common.error'), t('pdf.no_pdf_alert'));
      return;
    }

    if (splitMode === 'custom') {
      if (!pageRange.trim()) {
        Alert.alert(t('pdf.invalid_range'), t('pdf.extract_pages_prompt'));
        return;
      }
      if (!validatePageRange(pageRange, pageCount)) {
        Alert.alert(t('pdf.invalid_range'), t('pdf.enter_valid_pages', { max: pageCount }));
        return;
      }
    }

    setProcessingState({
      status: 'processing',
      progress: 0,
      message: t('pdf.processing'),
    });

    try {
      // Simulate PDF splitting progress
      // TODO: Replace with actual splitting logic when native library is available
      const ranges =
        splitMode === 'all'
          ? Array.from({ length: pageCount }, (_, i) => (i + 1).toString())
          : pageRange.split(',').map((p) => p.trim());

      for (let i = 0; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        let message = '';
        if (i < 3) {
          message = 'Reading PDF...';
        } else if (i < 8) {
          const currentIdx = Math.floor(((i - 3) / 5) * ranges.length);
          const currentPage = ranges[currentIdx] || ranges[ranges.length - 1];
          message = `Extracting page ${currentPage}...`;
        } else {
          message = 'Creating PDFs...';
        }

        setProcessingState({
          status: 'processing',
          progress: i / 10,
          message,
        });
      }

      const filesCreated =
        splitMode === 'all' ? pageCount : pageRange.split(',').map((p) => p.trim()).length;

      setProcessingState({
        status: 'complete',
        progress: 1,
        message: t('pdf.created_files', {
          count: filesCreated,
          unit: filesCreated === 1 ? 'file' : 'files',
        }),
        outputUri: pdfFile.uri, // Placeholder - would be folder with split PDFs
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('common.error'),
      });
    }
  }, [pdfFile, splitMode, pageRange, pageCount]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // In real implementation, would share a ZIP file of split PDFs
          await Sharing.shareAsync(processingState.outputUri, {
            mimeType: 'application/zip',
            dialogTitle: t('pdf.save_split_pdfs'),
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert(t('common.error'), 'Failed to share the files.');
      }
    }
  }, [processingState.outputUri]);

  const canSplit = pdfFile && pageCount > 0 && processingState.status !== 'processing';
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
              {t('tools.split_pdf')}
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
              {t('pdf.split_instructions')}
            </Text>
          </View>

          {/* PDF Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                {t('common.upload_file').toUpperCase()}
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
                {t('pdf.select_pdf')}
              </Button>
            )}
          </View>

          {/* Page Range Selection */}
          {pdfFile && pageCount > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  {t('pdf.split_options')}
                </Text>
              </View>
              <PageRangeSelector
                mode={splitMode}
                onModeChange={setSplitMode}
                pageRange={pageRange}
                onPageRangeChange={setPageRange}
                pageCount={pageCount}
                testID="page-range-selector"
              />
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
              {t('pdf.save_share')}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="cut-outline" size={20} color={colors.surface} />}
              onPress={handleSplit}
              disabled={!canSplit}
              loading={processingState.status === 'processing'}
              testID="split-button"
            >
              {t('tools.split_pdf')}
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

export default SplitPdfScreen;

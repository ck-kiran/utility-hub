import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { FileListCard, ProgressIndicator } from '@/components/pdf-tools';
import { useFilePicker } from '@/hooks';
import { colors, spacing } from '@/theme';
import { ProcessingState } from '@/types/pdf';
import { t } from '@/i18n';

export function MergePdfScreen() {
  const navigation = useNavigation();
  const { files, pickFiles, removeFile, reorderFiles, clearFiles } = useFilePicker({
    fileType: 'pdf',
    multiple: true,
  });

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

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      Alert.alert(t('common.error'), t('pdf.at_least_two_files'));
      return;
    }

    setProcessingState({ status: 'processing', progress: 0, message: t('pdf.processing') });

    try {
      const { mergePdfs } = await import('@/services/pdfService');

      const outputUri = await mergePdfs({
        pdfUris: files.map((f) => f.uri),
        onProgress: (progress, message) => {
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
        message: `${files.length} PDFs merged successfully!`,
        outputUri,
      });
    } catch (err) {
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : t('common.error'),
      });
    }
  }, [files]);

  const handleSave = useCallback(async () => {
    if (processingState.outputUri) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(processingState.outputUri, {
            mimeType: 'application/pdf',
            dialogTitle: t('pdf.save_share'),
          });
        } else {
          Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        }
      } catch {
        Alert.alert(t('common.error'), 'Failed to share the file.');
      }
    }
  }, [processingState.outputUri]);

  const canMerge = files.length >= 2 && processingState.status !== 'processing';
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
              {t('tools.merge_pdf')}
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={files.length === 0}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={files.length > 0 ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              {t('pdf.drag_to_reorder')}
            </Text>
          </View>

          {/* File Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                {t('pdf.select_files').toUpperCase()} ({files.length})
              </Text>
            </View>
            <FileListCard
              files={files}
              onRemove={removeFile}
              onReorder={reorderFiles}
              onAdd={pickFiles}
              maxFiles={20}
              emptyStateText={t('pdf.no_files_selected')}
              addButtonText={t('pdf.add_pdf_files')}
              testID="file-list"
            />
          </View>

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
              leftIcon={<Ionicons name="git-merge-outline" size={20} color={colors.surface} />}
              onPress={handleMerge}
              disabled={!canMerge}
              loading={processingState.status === 'processing'}
              testID="merge-button"
            >
              {t('pdf.merge_pdfs')}
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

export default MergePdfScreen;

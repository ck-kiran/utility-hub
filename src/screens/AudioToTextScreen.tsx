import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAudioRecorder,
  useAudioPlayer,
  useAudioRecorderState,
  RecordingPresets,
} from 'expo-audio';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Text, Button } from '@/components/common';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';

type ViewMode = 'idle' | 'recording' | 'recorded' | 'playing' | 'recognizing';

export function AudioToTextScreen() {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<ViewMode>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Audio recorder with high quality preset
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  // Audio player for playback
  const [playerSource, setPlayerSource] = useState<string | null>(null);
  const player = useAudioPlayer(playerSource);

  // Speech recognition is not available in Expo Go
  // Remove these unused states and effects since auto transcribe is disabled
  useEffect(() => {
    setRecognitionAvailable(false);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = async () => {
    try {
      setIsRecognizing(false);
      setViewMode('idle');
      setRecordingUri(null);
      setTranscriptionText('');
      setSelectedFileName('');
      setPlayerSource(null);
    } catch {
      // Ignore cleanup errors
    }
  };

  const startRecording = useCallback(() => {
    try {
      recorder.record();
      setViewMode('recording');
    } catch {
      Alert.alert(t('common.error'), 'Failed to start recording');
    }
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (uri) {
        setRecordingUri(uri);
        setViewMode('recorded');
      }
    } catch {
      Alert.alert(t('common.error'), 'Failed to stop recording');
    }
  }, [recorder]);

  const playRecording = useCallback(() => {
    if (recordingUri) {
      setPlayerSource(recordingUri);
      setViewMode('playing');
      player.play();

      // Monitor playback completion
      const checkPlayback = setInterval(() => {
        if (!player.playing) {
          setViewMode('recorded');
          clearInterval(checkPlayback);
        }
      }, 100);
    }
  }, [recordingUri, player]);

  const stopPlayback = useCallback(() => {
    player.pause();
    setViewMode('recorded');
  }, [player]);

  const handlePickAudioFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setRecordingUri(file.uri);
        setSelectedFileName(file.name);
        setViewMode('recorded');
      }
    } catch {
      Alert.alert(t('common.error'), 'Failed to pick audio file');
    }
  }, []);

  const handleAutoTranscribe = useCallback(async () => {
    // Speech recognition is only available in development builds
    // For now, show unavailable message
    Alert.alert(
      'Feature Unavailable',
      "Automatic speech recognition requires a development build.\n\nThis feature is not available in Expo Go. Please build the app with:\n\n• npx expo run:ios\n• npx expo run:android\n\nIn the meantime, you can type the transcription manually using your keyboard's voice input feature."
    );
  }, []);

  const handleStopTranscribe = useCallback(async () => {
    setIsRecognizing(false);
    setViewMode('recorded');
  }, []);

  const handleDownloadTranscription = useCallback(async () => {
    if (!transcriptionText.trim()) {
      Alert.alert(t('common.error'), 'No transcription to download');
      return;
    }

    try {
      const { File, Paths } = await import('expo-file-system/next');
      const fileName = `transcription-${Date.now()}.txt`;
      const outputFile = new File(Paths.cache, fileName);
      outputFile.create({ overwrite: true });
      outputFile.write(transcriptionText);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(t('common.error'), 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(outputFile.uri, {
        mimeType: 'text/plain',
        dialogTitle: 'Save Transcription',
        UTI: 'public.plain-text',
      });
    } catch {
      Alert.alert(t('common.error'), 'Failed to download transcription');
    }
  }, [transcriptionText]);

  const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              {t('tools.audio_to_text')}
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={viewMode === 'idle'}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={viewMode !== 'idle' ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              {viewMode === 'idle'
                ? 'Record audio or upload an audio file to transcribe'
                : viewMode === 'recording'
                  ? 'Recording in progress... Tap stop when finished'
                  : viewMode === 'recognizing'
                    ? 'Listening and transcribing... Speak clearly'
                    : selectedFileName
                      ? `Selected: ${selectedFileName}`
                      : 'Use auto transcribe or type manually'}
            </Text>
          </View>

          {/* Upload Audio File Button */}
          {viewMode === 'idle' && (
            <View style={styles.section}>
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={
                  <Ionicons name="cloud-upload-outline" size={20} color={colors.primary[500]} />
                }
                onPress={handlePickAudioFile}
                testID="upload-audio-button"
              >
                Upload Audio File
              </Button>
            </View>
          )}

          {/* Recording Visualizer */}
          <View style={styles.section}>
            <View style={styles.visualizerContainer}>
              {viewMode === 'recording' ? (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingPulse} />
                  <Ionicons name="mic" size={48} color={colors.error[500]} />
                  <Text variant="h2" style={styles.durationText}>
                    {formatDuration(recorderState.durationMillis || 0)}
                  </Text>
                  <Text variant="caption" color={colors.error[500]}>
                    Recording...
                  </Text>
                </View>
              ) : viewMode === 'recognizing' ? (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingPulse} />
                  <Ionicons name="ear" size={48} color={colors.primary[500]} />
                  <Text variant="body" style={styles.durationText}>
                    Transcribing...
                  </Text>
                  <Text variant="caption" color={colors.primary[500]}>
                    Speak clearly into the microphone
                  </Text>
                </View>
              ) : viewMode === 'recorded' || viewMode === 'playing' ? (
                <View style={styles.recordedIndicator}>
                  <Ionicons
                    name={viewMode === 'playing' ? 'volume-high' : 'checkmark-circle'}
                    size={48}
                    color={colors.success[500]}
                  />
                  <Text variant="h2" style={styles.durationText}>
                    {formatDuration(recorderState.durationMillis || 0)}
                  </Text>
                  <Text variant="caption" color={colors.success[500]}>
                    {viewMode === 'playing' ? 'Playing...' : 'Recording Complete'}
                  </Text>
                </View>
              ) : (
                <View style={styles.idleIndicator}>
                  <Ionicons name="mic-outline" size={64} color={colors.text.tertiary} />
                  <Text variant="body" color={colors.text.tertiary} style={styles.idleText}>
                    Ready to record
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Playback Controls */}
          {(viewMode === 'recorded' || viewMode === 'playing') && recordingUri && (
            <View style={styles.section}>
              <View style={styles.playbackControls}>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={
                    <Ionicons
                      name={viewMode === 'playing' ? 'stop' : 'play'}
                      size={20}
                      color={colors.primary[500]}
                    />
                  }
                  onPress={viewMode === 'playing' ? stopPlayback : playRecording}
                  testID="play-button"
                >
                  {viewMode === 'playing' ? 'Stop' : 'Play Recording'}
                </Button>
              </View>
            </View>
          )}

          {/* Auto Transcribe Button */}
          {viewMode === 'recorded' && !isRecognizing && (
            <View style={styles.section}>
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Ionicons name="mic-circle" size={20} color={colors.surface} />}
                onPress={handleAutoTranscribe}
                testID="auto-transcribe-button"
              >
                Auto Transcribe (Speak Live)
              </Button>
              {!recognitionAvailable && (
                <Text variant="caption" color={colors.warning[600]} style={styles.warningText}>
                  ⚠️ Requires development build (run: npx expo run:ios/android)
                </Text>
              )}
            </View>
          )}

          {/* Stop Transcribing Button */}
          {isRecognizing && (
            <View style={styles.section}>
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<Ionicons name="stop-circle" size={20} color={colors.surface} />}
                onPress={handleStopTranscribe}
                testID="stop-transcribe-button"
                style={{ backgroundColor: colors.error[500] }}
              >
                Stop Transcribing
              </Button>
            </View>
          )}

          {/* Transcription Input */}
          {(viewMode === 'recorded' || viewMode === 'playing' || viewMode === 'recognizing') && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  TRANSCRIPTION
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {transcriptionText.length} characters
                </Text>
              </View>
              <TextInput
                style={styles.transcriptionInput}
                value={transcriptionText}
                onChangeText={setTranscriptionText}
                placeholder="Transcription will appear here...&#10;&#10;Use Auto Transcribe to speak live, or type manually."
                placeholderTextColor={colors.text.tertiary}
                multiline
                textAlignVertical="top"
                testID="transcription-input"
                editable={!isRecognizing}
              />
            </View>
          )}

          {/* Info Card */}
          {viewMode === 'recorded' && !transcriptionText && !isRecognizing && (
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                  Two transcription options:{'\n'}• Auto Transcribe: Speak live and text appears
                  automatically (requires dev build){'\n'}• Manual: Type while playing the audio
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {viewMode === 'idle' && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="mic-outline" size={20} color={colors.surface} />}
              onPress={startRecording}
              testID="record-button"
            >
              Start Recording
            </Button>
          )}

          {viewMode === 'recording' && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="stop" size={20} color={colors.surface} />}
              onPress={stopRecording}
              testID="stop-button"
              style={{ backgroundColor: colors.error[500] }}
            >
              Stop Recording
            </Button>
          )}

          {(viewMode === 'recorded' || viewMode === 'playing' || viewMode === 'recognizing') &&
            transcriptionText.trim() && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Ionicons name="download-outline" size={20} color={colors.surface} />}
                onPress={handleDownloadTranscription}
                testID="download-transcription-button"
                disabled={isRecognizing}
              >
                Download Transcription
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  visualizerContainer: {
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[3],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing[6],
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  recordingIndicator: {
    alignItems: 'center',
    position: 'relative',
  },
  recordingPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error[100],
    opacity: 0.5,
  },
  recordedIndicator: {
    alignItems: 'center',
  },
  idleIndicator: {
    alignItems: 'center',
  },
  idleText: {
    marginTop: spacing[3],
  },
  durationText: {
    marginTop: spacing[3],
    marginBottom: spacing[2],
    color: colors.text.primary,
  },
  playbackControls: {
    alignItems: 'center',
  },
  transcriptionInput: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: spacing[2],
    padding: spacing[3],
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    minHeight: 200,
    maxHeight: 300,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[3],
    borderRadius: spacing[2],
    backgroundColor: colors.info[50],
    borderWidth: 1,
    borderColor: colors.info[200],
  },
  infoText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  warningText: {
    marginTop: spacing[2],
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

export default AudioToTextScreen;

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { Text, Button } from '@/components/common';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';
import { ProcessingState } from '@/types/pdf';

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing';
type AudioSource = 'recording' | 'file';

export function AudioToTextScreen() {
  const navigation = useNavigation();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [audioSource, setAudioSource] = useState<AudioSource | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  // Language selection (fixed to auto for now, full selector coming soon)
  const selectedLanguage = 'auto';

  useEffect(() => {
    return () => {
      // Cleanup
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, [recording, sound]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    if (sound) {
      sound.unloadAsync().catch(console.error);
      setSound(null);
    }
    setRecordingStatus('idle');
    setRecording(null);
    setRecordingUri(null);
    setRecordingDuration(0);
    setTranscriptionText('');
    setAudioSource(null);
    setSelectedFileName('');
    setProcessingState({ status: 'idle', progress: 0 });
  };

  const startRecording = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setRecordingStatus('recording');

      // Monitor duration
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setRecordingDuration(status.durationMillis / 1000);
        }
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert(t('common.error'), 'Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecordingUri(uri);
      setRecordingStatus('recorded');
      setRecording(null);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert(t('common.error'), 'Failed to stop recording');
    }
  }, [recording]);

  const playRecording = useCallback(async () => {
    if (!recordingUri) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordingUri });

      setSound(newSound);
      setRecordingStatus('playing');

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setRecordingStatus('recorded');
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert(t('common.error'), 'Failed to play recording');
    }
  }, [recordingUri]);

  const stopPlayback = useCallback(async () => {
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setRecordingStatus('recorded');
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }, [sound]);

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
        setAudioSource('file');
        setRecordingStatus('recorded');

        // Load the audio file to get its duration
        try {
          const { sound: tempSound } = await Audio.Sound.createAsync({ uri: file.uri });
          const status = await tempSound.getStatusAsync();
          if (status.isLoaded && status.durationMillis) {
            setRecordingDuration(status.durationMillis / 1000);
          }
          await tempSound.unloadAsync();
        } catch (err) {
          console.error('Failed to get audio duration:', err);
          // Don't show error to user, just continue without duration
        }
      }
    } catch (error) {
      console.error('Failed to pick audio file:', error);
      Alert.alert(t('common.error'), 'Failed to pick audio file');
    }
  }, []);

  const handleTranscribe = useCallback(async () => {
    if (!recordingUri) return;

    setProcessingState({ status: 'processing', progress: 0, message: 'Starting transcription...' });

    try {
      const { transcribeAudio } = await import('@/services/audioService');

      const result = await transcribeAudio({
        audioUri: recordingUri,
        language: selectedLanguage,
        onProgress: (progress, message) => {
          setProcessingState({ status: 'processing', progress, message });
        },
      });

      setTranscriptionText(result.text);
      setProcessingState({
        status: 'complete',
        progress: 1,
        message: 'Transcription complete!',
      });
    } catch (err) {
      console.error('Transcription error:', err);
      setProcessingState({
        status: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : 'Failed to transcribe audio',
      });
      Alert.alert(
        t('common.error'),
        err instanceof Error ? err.message : 'Failed to transcribe audio'
      );
    }
  }, [recordingUri, selectedLanguage]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
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
            disabled={recordingStatus === 'idle'}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={recordingStatus !== 'idle' ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              {recordingStatus === 'idle'
                ? 'Record audio or upload an audio file to transcribe'
                : recordingStatus === 'recording'
                  ? 'Recording in progress... Tap stop when finished'
                  : audioSource === 'file'
                    ? `Selected: ${selectedFileName}`
                    : 'Tap transcribe to convert your recording to text'}
            </Text>
          </View>

          {/* Upload Audio File Button */}
          {recordingStatus === 'idle' && (
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
              {recordingStatus === 'recording' ? (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingPulse} />
                  <Ionicons name="mic" size={48} color={colors.error[500]} />
                  <Text variant="h2" style={styles.durationText}>
                    {formatDuration(recordingDuration)}
                  </Text>
                  <Text variant="caption" color={colors.error[500]}>
                    Recording...
                  </Text>
                </View>
              ) : recordingStatus === 'recorded' || recordingStatus === 'playing' ? (
                <View style={styles.recordedIndicator}>
                  <Ionicons
                    name={recordingStatus === 'playing' ? 'volume-high' : 'checkmark-circle'}
                    size={48}
                    color={colors.success[500]}
                  />
                  <Text variant="h2" style={styles.durationText}>
                    {formatDuration(recordingDuration)}
                  </Text>
                  <Text variant="caption" color={colors.success[500]}>
                    {recordingStatus === 'playing' ? 'Playing...' : 'Recording Complete'}
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
          {(recordingStatus === 'recorded' || recordingStatus === 'playing') && (
            <View style={styles.section}>
              <View style={styles.playbackControls}>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={
                    <Ionicons
                      name={recordingStatus === 'playing' ? 'stop' : 'play'}
                      size={20}
                      color={colors.primary[500]}
                    />
                  }
                  onPress={recordingStatus === 'playing' ? stopPlayback : playRecording}
                  testID="play-button"
                >
                  {recordingStatus === 'playing' ? 'Stop' : 'Play Recording'}
                </Button>
              </View>
            </View>
          )}

          {/* Language Selection */}
          {(recordingStatus === 'recorded' || recordingStatus === 'playing') &&
            !transcriptionText &&
            processingState.status === 'idle' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="labelSmall" color={colors.text.tertiary}>
                    TRANSCRIPTION LANGUAGE
                  </Text>
                </View>
                <View style={styles.languageSelector}>
                  <Ionicons name="language-outline" size={20} color={colors.text.secondary} />
                  <Text variant="body" color={colors.text.secondary} style={styles.languageText}>
                    {selectedLanguage === 'auto' ? 'Auto Detect' : selectedLanguage.toUpperCase()}
                  </Text>
                  <Text variant="caption" color={colors.text.tertiary}>
                    (Language selection coming soon)
                  </Text>
                </View>
              </View>
            )}

          {/* Processing State */}
          {processingState.status === 'processing' && (
            <View style={styles.section}>
              <View style={styles.processingCard}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text variant="body" style={styles.processingText}>
                  {processingState.message}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${processingState.progress * 100}%` }]}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Transcription Result */}
          {transcriptionText && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  TRANSCRIPTION
                </Text>
              </View>
              <View style={styles.transcriptionCard}>
                <Text variant="body" style={styles.transcriptionText}>
                  {transcriptionText}
                </Text>
              </View>
            </View>
          )}

          {/* Info Card */}
          {recordingStatus !== 'idle' &&
            !transcriptionText &&
            processingState.status === 'idle' && (
              <View style={styles.section}>
                <View style={styles.infoCard}>
                  <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                  <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                    Transcription uses OpenAI Whisper API. Make sure you have set
                    EXPO_PUBLIC_OPENAI_API_KEY in your .env file.
                  </Text>
                </View>
              </View>
            )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {recordingStatus === 'idle' && (
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

          {recordingStatus === 'recording' && (
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

          {(recordingStatus === 'recorded' || recordingStatus === 'playing') &&
            !transcriptionText && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Ionicons name="text-outline" size={20} color={colors.surface} />}
                onPress={handleTranscribe}
                disabled={recordingStatus === 'playing' || processingState.status === 'processing'}
                testID="transcribe-button"
              >
                {processingState.status === 'processing' ? 'Transcribing...' : 'Transcribe Audio'}
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
  transcriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing[4],
  },
  transcriptionText: {
    lineHeight: 24,
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
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing[3],
    gap: spacing[2],
  },
  languageText: {
    flex: 1,
  },
  processingCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing[4],
    alignItems: 'center',
  },
  processingText: {
    marginTop: spacing[3],
    textAlign: 'center',
    color: colors.text.secondary,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: 2,
    marginTop: spacing[3],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
  },
});

export default AudioToTextScreen;

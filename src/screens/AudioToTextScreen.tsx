import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Text, Button } from '@/components/common';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';

type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing';

export function AudioToTextScreen() {
  const navigation = useNavigation();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transcriptionText, setTranscriptionText] = useState('');

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

  const handleTranscribe = useCallback(() => {
    // This is a placeholder for actual transcription
    // In a real app, you would:
    // 1. Upload the audio file to a transcription service (e.g., OpenAI Whisper, Google Speech-to-Text)
    // 2. Get the transcribed text
    // 3. Display it

    setTranscriptionText(
      '(Transcription placeholder)\n\n' +
        'To implement actual transcription, integrate with:\n\n' +
        '• OpenAI Whisper API\n' +
        '• Google Cloud Speech-to-Text\n' +
        '• AWS Transcribe\n' +
        '• Azure Speech Services\n\n' +
        'The audio has been recorded successfully and can be sent to any of these services for transcription.'
    );
  }, []);

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
                ? 'Tap the microphone button to start recording audio'
                : recordingStatus === 'recording'
                  ? 'Recording in progress... Tap stop when finished'
                  : 'Tap transcribe to convert your recording to text'}
            </Text>
          </View>

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
          {recordingStatus !== 'idle' && !transcriptionText && (
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                  Note: Actual transcription requires integration with a cloud transcription service
                  (OpenAI Whisper, Google Speech-to-Text, etc.)
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
                disabled={recordingStatus === 'playing'}
                testID="transcribe-button"
              >
                Transcribe Audio
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
});

export default AudioToTextScreen;

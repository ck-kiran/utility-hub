import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Text, Button } from '@/components/common';
import { colors, spacing } from '@/theme';
import { t } from '@/i18n';

export function TextToAudioScreen() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  useEffect(() => {
    const loadAvailableVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        // Voices are available but not used in current implementation
        console.log('Available voices:', voices.length);
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };

    loadAvailableVoices();
    return () => {
      // Cleanup: stop speech when component unmounts
      Speech.stop();
    };
  }, []);

  const handleBack = () => {
    Speech.stop();
    navigation.goBack();
  };

  const handleClear = () => {
    setInputText('');
    setIsSpeaking(false);
    setIsPaused(false);
    Speech.stop();
  };

  const handleSpeak = useCallback(() => {
    if (!inputText.trim()) {
      Alert.alert(t('common.error'), 'Please enter some text to convert');
      return;
    }

    if (isPaused) {
      Speech.resume();
      setIsPaused(false);
      return;
    }

    setIsSpeaking(true);
    setIsPaused(false);

    Speech.speak(inputText, {
      language: selectedLanguage,
      pitch,
      rate,
      onDone: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onStopped: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setIsPaused(false);
        Alert.alert(t('common.error'), 'Failed to convert text to speech');
      },
    });
  }, [inputText, selectedLanguage, pitch, rate, isPaused]);

  const handlePause = () => {
    Speech.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'hi-IN', label: 'Hindi' },
  ];

  const pitchOptions = [
    { value: 0.5, label: 'Very Low' },
    { value: 0.75, label: 'Low' },
    { value: 1.0, label: 'Normal' },
    { value: 1.25, label: 'High' },
    { value: 1.5, label: 'Very High' },
  ];

  const rateOptions = [
    { value: 0.5, label: 'Very Slow' },
    { value: 0.75, label: 'Slow' },
    { value: 1.0, label: 'Normal' },
    { value: 1.25, label: 'Fast' },
    { value: 1.5, label: 'Very Fast' },
  ];

  const canSpeak = inputText.trim().length > 0 && !isSpeaking;
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = inputText.length;

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
              {t('tools.text_to_audio')}
            </Text>
          </View>
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            testID="clear-button"
            disabled={!inputText}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={inputText ? colors.text.secondary : colors.neutral[300]}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <View style={styles.section}>
            <Text variant="body" color={colors.text.secondary}>
              Enter text below to convert it to speech
            </Text>
          </View>

          {/* Text Input */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                TEXT INPUT
              </Text>
              <Text variant="caption" color={colors.text.tertiary}>
                {wordCount} words • {charCount} characters
              </Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter or paste your text here..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              textAlignVertical="top"
              testID="text-input"
            />
          </View>

          {/* Language Selection */}
          {inputText && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  LANGUAGE
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {languageOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, selectedLanguage === option.value && styles.chipSelected]}
                    onPress={() => setSelectedLanguage(option.value)}
                  >
                    <Text
                      variant="caption"
                      color={
                        selectedLanguage === option.value
                          ? colors.primary[500]
                          : colors.text.secondary
                      }
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Voice Settings */}
          {inputText && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="labelSmall" color={colors.text.tertiary}>
                    PITCH
                  </Text>
                </View>
                <View style={styles.optionButtons}>
                  {pitchOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.optionButton,
                        pitch === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => setPitch(option.value)}
                    >
                      <Text
                        variant="caption"
                        color={pitch === option.value ? colors.primary[500] : colors.text.secondary}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="labelSmall" color={colors.text.tertiary}>
                    SPEED
                  </Text>
                </View>
                <View style={styles.optionButtons}>
                  {rateOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.optionButton,
                        rate === option.value && styles.optionButtonSelected,
                      ]}
                      onPress={() => setRate(option.value)}
                    >
                      <Text
                        variant="caption"
                        color={rate === option.value ? colors.primary[500] : colors.text.secondary}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Status */}
          {isSpeaking && (
            <View style={styles.section}>
              <View style={styles.statusCard}>
                <Ionicons
                  name={isPaused ? 'pause-circle' : 'volume-high'}
                  size={32}
                  color={colors.primary[500]}
                />
                <Text variant="body" style={styles.statusText}>
                  {isPaused ? 'Paused' : 'Speaking...'}
                </Text>
              </View>
            </View>
          )}

          {/* Info Card */}
          {!isSpeaking && inputText.trim() && (
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={colors.info[500]} />
                <Text variant="caption" color={colors.text.secondary} style={styles.infoText}>
                  Uses device&apos;s built-in text-to-speech engine. Audio plays in real-time but
                  cannot be downloaded. For downloadable audio files, a cloud TTS service is
                  required.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {isSpeaking ? (
            <View style={styles.controlButtons}>
              <Button
                variant="outline"
                size="lg"
                style={styles.controlButton}
                leftIcon={
                  <Ionicons
                    name={isPaused ? 'play' : 'pause'}
                    size={20}
                    color={colors.primary[500]}
                  />
                }
                onPress={isPaused ? handleSpeak : handlePause}
                testID="pause-button"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                style={styles.controlButton}
                leftIcon={<Ionicons name="stop" size={20} color={colors.error[500]} />}
                onPress={handleStop}
                testID="stop-button"
              >
                Stop
              </Button>
            </View>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="volume-high-outline" size={20} color={colors.surface} />}
              onPress={handleSpeak}
              disabled={!canSpeak}
              testID="speak-button"
            >
              Convert to Speech
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
  textInput: {
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
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing[5],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
    marginRight: spacing[2],
  },
  chipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  optionButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: spacing[2],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.surface,
  },
  optionButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: spacing[2],
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  statusText: {
    marginLeft: spacing[3],
    color: colors.primary[700],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  controlButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  controlButton: {
    flex: 1,
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
});

export default TextToAudioScreen;

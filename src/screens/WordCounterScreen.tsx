import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Clipboard,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/common';
import { TextInputCard, StatsBar } from '@/components/text-tools';
import { colors, spacing } from '@/theme';

export function WordCounterScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();

    // Words: split by whitespace and filter empty strings
    const words = trimmedText ? trimmedText.split(/\s+/).filter((w) => w.length > 0).length : 0;

    // Characters: total length
    const chars = text.length;

    // Characters without spaces
    const charsNoSpaces = text.replace(/\s/g, '').length;

    // Paragraphs: split by newlines and filter empty
    const paragraphs = trimmedText
      ? trimmedText.split(/\n\n+/).filter((p) => p.trim().length > 0).length
      : 0;

    return [
      { value: words, label: 'WORDS' },
      { value: chars, label: 'CHARS' },
      { value: charsNoSpaces, label: 'W/O SPC' },
      { value: paragraphs, label: 'PARA' },
    ];
  }, [text]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopyStats = () => {
    const statsText = stats.map((s) => `${s.label}: ${s.value}`).join('\n');
    Clipboard.setString(statsText);
    Alert.alert('Copied', 'Stats copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text variant="h3" style={styles.headerTitle}>
            Word Counter
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* Text Input */}
              <View style={styles.content}>
                <View style={styles.inputWrapper}>
                  <TextInputCard
                    value={text}
                    onChangeText={setText}
                    label="PLAIN TEXT"
                    testID="word-counter-input"
                  />
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <StatsBar stats={stats} testID="word-counter-stats" />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Ionicons name="trash-outline" size={20} color={colors.primary[500]} />}
              onPress={handleClear}
              style={styles.clearButton}
            >
              Clear
            </Button>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Ionicons name="copy-outline" size={20} color={colors.surface} />}
              onPress={handleCopyStats}
              style={styles.copyButton}
            >
              Copy Stats
            </Button>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  inputWrapper: {
    height: 300,
  },
  statsContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
    gap: spacing[3],
  },
  clearButton: {
    flex: 1,
  },
  copyButton: {
    flex: 2,
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Clipboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, KeyboardDoneAccessory } from '@/components/common';
import { TextInputCard } from '@/components/text-tools';
import { colors, spacing, borderRadius } from '@/theme';

export function JsonFormatterScreen() {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputAccessoryViewID = 'json-formatter-done';

  const handleFormat = (mode: 'prettify' | 'minify') => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const formatted =
        mode === 'prettify' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      setOutputText(formatted);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputText('');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const handleCopy = () => {
    if (outputText) {
      Clipboard.setString(outputText);
      Alert.alert('Copied', 'JSON copied to clipboard');
    }
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
              JSON Formatter
            </Text>
          </View>
          <Pressable onPress={handleClear} style={styles.clearButton} testID="clear-button">
            <Ionicons name="trash-outline" size={24} color={colors.text.secondary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Input Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  INPUT JSON
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInputCard
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder='Paste your JSON here... e.g. {"name": "John"}'
                  testID="json-input"
                  inputAccessoryViewID={inputAccessoryViewID}
                />
              </View>
              {error && (
                <Text variant="caption" color={colors.error[500]} style={styles.errorText}>
                  {error}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionsGrid}>
              <Pressable style={styles.actionButton} onPress={() => handleFormat('prettify')}>
                <Ionicons name="code-working-outline" size={20} color={colors.primary[500]} />
                <Text variant="body" style={styles.actionLabel}>
                  Prettify
                </Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => handleFormat('minify')}>
                <Ionicons name="contract-outline" size={20} color={colors.primary[500]} />
                <Text variant="body" style={styles.actionLabel}>
                  Minify
                </Text>
              </Pressable>
            </View>

            {/* Output Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  OUTPUT
                </Text>
              </View>
              <View style={styles.outputContainer}>
                <TextInputCard
                  value={outputText}
                  onChangeText={() => {}}
                  placeholder="Formatted JSON will appear here..."
                  editable={false}
                  testID="json-output"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="copy-outline" size={20} color={colors.surface} />}
              onPress={handleCopy}
              disabled={!outputText}
            >
              Copy Result
            </Button>
          </View>
        </KeyboardAvoidingView>
        <KeyboardDoneAccessory inputAccessoryViewID={inputAccessoryViewID} />
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
  inputContainer: {
    height: 200,
  },
  outputContainer: {
    height: 300,
  },
  errorText: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[1],
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  actionLabel: {
    marginLeft: spacing[2],
    fontWeight: '600',
    color: colors.text.primary,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
});

import React, { useState, useMemo } from 'react';
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
import { CaseType, transformText } from '@/utils/textTransforms';

interface CaseOption {
  id: CaseType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CASE_OPTIONS: CaseOption[] = [
  { id: 'uppercase', label: 'UPPERCASE', icon: 'arrow-up-outline' },
  { id: 'lowercase', label: 'lowercase', icon: 'arrow-down-outline' },
  { id: 'titlecase', label: 'Title Case', icon: 'text-outline' },
  { id: 'sentencecase', label: 'Sentence case', icon: 'remove-outline' },
  { id: 'camelcase', label: 'camelCase', icon: 'return-down-forward-outline' },
  { id: 'pascalcase', label: 'PascalCase', icon: 'arrow-forward-circle-outline' },
  { id: 'snakecase', label: 'snake_case', icon: 'remove-outline' },
  { id: 'kebabcase', label: 'kebab-case', icon: 'ellipsis-horizontal-outline' },
];

export function CaseConverterScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('uppercase');
  const inputAccessoryViewID = 'case-converter-done';

  const transformedText = useMemo(() => {
    return transformText(text, selectedCase);
  }, [text, selectedCase]);

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim()
      ? text
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length
      : 0;
    return { chars, words };
  }, [text]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopy = () => {
    if (transformedText) {
      Clipboard.setString(transformedText);
      Alert.alert('Copied', 'Text copied to clipboard');
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
              Case Converter
            </Text>
          </View>
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={24} color={colors.text.secondary} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Text Input */}
            <View style={styles.section}>
              <View style={styles.inputContainer}>
                <TextInputCard
                  value={text}
                  onChangeText={setText}
                  placeholder="Type or paste text here..."
                  testID="case-converter-input"
                  inputAccessoryViewID={inputAccessoryViewID}
                />
                <View style={styles.statsOverlay}>
                  <Text variant="caption" color={colors.primary[500]}>
                    CHARS {stats.chars}
                  </Text>
                  <View style={styles.statsDivider} />
                  <Text variant="caption" color={colors.primary[500]}>
                    WORDS {stats.words}
                  </Text>
                </View>
              </View>
            </View>

            {/* Transform Options */}
            <View style={styles.section}>
              <View style={styles.transformHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  TRANSFORM
                </Text>
              </View>
              <View style={styles.optionsGrid}>
                {CASE_OPTIONS.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.optionButton,
                      selectedCase === option.id && styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedCase(option.id)}
                  >
                    <Text
                      variant="body"
                      style={[
                        styles.optionLabel,
                        selectedCase === option.id && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={selectedCase === option.id ? colors.text.primary : colors.neutral[400]}
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Output */}
            <View style={styles.section}>
              <View style={styles.transformHeader}>
                <Text variant="labelSmall" color={colors.text.tertiary}>
                  OUTPUT
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInputCard
                  value={transformedText}
                  onChangeText={() => {}}
                  placeholder="Result will appear here..."
                  editable={false}
                  testID="case-converter-output"
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Ionicons name="copy-outline" size={20} color={colors.surface} />}
              onPress={handleCopy}
              disabled={!transformedText}
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
  headerSubtitle: {
    marginTop: -2,
  },
  clearButton: {
    padding: spacing[2],
    marginRight: -spacing[2],
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  inputContainer: {
    height: 150,
    position: 'relative',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: spacing[3],
    right: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  statsDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing[2],
  },
  transformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  optionButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionLabel: {
    fontWeight: '500',
  },
  optionLabelSelected: {
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

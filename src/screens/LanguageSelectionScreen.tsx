import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/common';
import { SearchBar } from '@/components/tools';
import { LanguageItem } from '@/components/language';
import { colors, spacing } from '@/theme';
import { useAppStore } from '@/store';
import { setLocale } from '@/i18n';

interface Language {
  code: string;
  name: string;
  localName?: string;
}

const SUGGESTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', localName: 'United States' },
];

const ALL_LANGUAGES: Language[] = [
  { code: 'hi', name: 'हिन्दी', localName: 'Hindi' },
  { code: 'ml', name: 'മലയാളം', localName: 'Malayalam' },
  { code: 'ta', name: 'தமிழ்', localName: 'Tamil' },
];

export function LanguageSelectionScreen() {
  const navigation = useNavigation();
  const { language, setLanguage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuggested = useMemo(() => {
    if (!searchQuery.trim()) {
      return SUGGESTED_LANGUAGES;
    }
    const query = searchQuery.toLowerCase();
    return SUGGESTED_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        (lang.localName && lang.localName.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredAll = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_LANGUAGES;
    }
    const query = searchQuery.toLowerCase();
    return ALL_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        (lang.localName && lang.localName.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleDone = () => {
    navigation.goBack();
  };

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    setLocale(code);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text variant="h3" style={styles.headerTitle}>
            Language
          </Text>
          <Pressable onPress={handleDone} style={styles.doneButton}>
            <Text variant="body" color={colors.primary[500]} style={styles.doneText}>
              Done
            </Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search language"
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Suggested Section */}
          {filteredSuggested.length > 0 && (
            <View style={styles.section}>
              <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
                SUGGESTED
              </Text>
              <View style={styles.languageList}>
                {filteredSuggested.map((lang) => (
                  <LanguageItem
                    key={lang.code}
                    name={lang.name}
                    localName={lang.localName}
                    isSelected={language === lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    testID={`language-${lang.code}`}
                  />
                ))}
              </View>
            </View>
          )}

          {/* All Languages Section */}
          {filteredAll.length > 0 && (
            <View style={styles.section}>
              <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
                REGIONAL LANGUAGES
              </Text>
              <View style={styles.languageList}>
                {filteredAll.map((lang) => (
                  <LanguageItem
                    key={lang.code}
                    name={lang.name}
                    localName={lang.localName}
                    isSelected={language === lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    testID={`language-${lang.code}`}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {filteredSuggested.length === 0 && filteredAll.length === 0 && (
            <View style={styles.emptyState}>
              <Text variant="body" color={colors.text.tertiary}>
                No languages found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  headerSpacer: {
    width: 50,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  doneButton: {
    padding: spacing[2],
  },
  doneText: {
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionLabel: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    letterSpacing: 1,
  },
  languageList: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[100],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
});

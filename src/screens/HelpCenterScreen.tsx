import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/common';
import { SearchBar } from '@/components/tools';
import { HelpCategoryItem } from '@/components/help';
import { colors, spacing } from '@/theme';

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpCategory {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackgroundColor: string;
  title: string;
  faqs: FAQItem[];
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    icon: 'rocket-outline',
    iconColor: colors.primary[500],
    iconBackgroundColor: colors.primary[50],
    title: 'Getting Started',
    faqs: [
      {
        question: 'How do I upload a file?',
        answer:
          'Tap the "Upload File" button on the home screen or navigate to any tool and select your file from your device.',
      },
      {
        question: 'What file formats are supported?',
        answer:
          'We support PDF, JPG, PNG, GIF, and many other common formats. Check each tool for specific format support.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'Free users can upload files up to 20MB. Premium users have a 100MB limit per file.',
      },
    ],
  },
  {
    id: 'file-troubleshooting',
    icon: 'warning-outline',
    iconColor: colors.error[500],
    iconBackgroundColor: colors.error[50],
    title: 'File Troubleshooting',
    faqs: [
      {
        question: 'Why did my file fail to process?',
        answer:
          'Files may fail if they are corrupted, password-protected, or exceed size limits. Try re-uploading or using a different file.',
      },
      {
        question: 'How do I recover a failed conversion?',
        answer:
          'Go to History, find the failed item, and tap the retry button. If it still fails, try a different file format.',
      },
    ],
  },
  {
    id: 'text-tools',
    icon: 'text-outline',
    iconColor: '#8B5CF6',
    iconBackgroundColor: '#F3E8FF',
    title: 'Text Tools Guide',
    faqs: [
      {
        question: 'How does the Word Counter work?',
        answer:
          'Paste or type your text, and the tool instantly counts words, characters, characters without spaces, and paragraphs.',
      },
      {
        question: 'What case conversions are available?',
        answer: 'We support UPPERCASE, lowercase, Title Case, and Sentence case transformations.',
      },
    ],
  },
  {
    id: 'billing',
    icon: 'card-outline',
    iconColor: colors.success[500],
    iconBackgroundColor: colors.success[50],
    title: 'Billing & Subscription',
    faqs: [
      {
        question: 'How do I upgrade to Premium?',
        answer:
          'Go to Profile > Subscription and select a plan. Payment is processed through your app store account.',
      },
      {
        question: 'Can I cancel my subscription?',
        answer:
          'Yes, you can cancel anytime through your app store subscription settings. Your access continues until the end of the billing period.',
      },
    ],
  },
  {
    id: 'account',
    icon: 'people-outline',
    iconColor: colors.info[500],
    iconBackgroundColor: colors.info[50],
    title: 'Account Settings',
    faqs: [
      {
        question: 'How do I change my email?',
        answer: 'Go to Profile > Account Settings > Email and enter your new email address.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Go to Profile > Privacy Policy > Request Data Deletion. This will permanently delete your account and all data.',
      },
    ],
  },
];

export function HelpCenterScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return HELP_CATEGORIES;
    }

    const query = searchQuery.toLowerCase();
    return HELP_CATEGORIES.map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      ),
    })).filter(
      (category) => category.faqs.length > 0 || category.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support (email or in-app chat)
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
            Help Center
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help..."
          />

          {/* Categories */}
          <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
            CATEGORIES
          </Text>

          {filteredCategories.map((category) => (
            <HelpCategoryItem
              key={category.id}
              icon={category.icon}
              iconColor={category.iconColor}
              iconBackgroundColor={category.iconBackgroundColor}
              title={category.title}
              faqs={category.faqs}
              testID={`help-category-${category.id}`}
            />
          ))}

          {filteredCategories.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.neutral[300]} />
              <Text variant="body" color={colors.text.tertiary} style={styles.emptyText}>
                No results found for &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Contact Support Button */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Ionicons name="headset-outline" size={20} color={colors.surface} />}
            onPress={handleContactSupport}
          >
            Contact Support
          </Button>
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
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  scrollContent: {
    paddingBottom: spacing[4],
  },
  sectionLabel: {
    marginTop: spacing[4],
    marginBottom: spacing[3],
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  emptyText: {
    marginTop: spacing[3],
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpCategoryItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackgroundColor: string;
  title: string;
  faqs: FAQItem[];
  testID?: string;
}

export function HelpCategoryItem({
  icon,
  iconColor,
  iconBackgroundColor,
  title,
  faqs,
  testID,
}: HelpCategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        onPress={toggleExpand}
        testID={testID ? `${testID}-header` : undefined}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text variant="body" style={styles.title}>
          {title}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.neutral[400]}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.content}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text variant="body" style={styles.question}>
                {faq.question}
              </Text>
              <Text variant="caption" color={colors.text.secondary} style={styles.answer}>
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing[3],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  headerPressed: {
    backgroundColor: colors.neutral[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  faqItem: {
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  question: {
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  answer: {
    lineHeight: 20,
  },
});

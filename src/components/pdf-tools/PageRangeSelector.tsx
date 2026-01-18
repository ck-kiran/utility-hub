import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { t } from '@/i18n';

type SplitMode = 'all' | 'custom';

interface PageRangeSelectorProps {
  mode: SplitMode;
  onModeChange: (mode: SplitMode) => void;
  pageRange: string;
  onPageRangeChange: (range: string) => void;
  pageCount: number;
  testID?: string;
}

export function PageRangeSelector({
  mode,
  onModeChange,
  pageRange,
  onPageRangeChange,
  pageCount,
  testID,
}: PageRangeSelectorProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Card variant="outlined" padding={0} testID={testID}>
      <View style={styles.container}>
        {/* All Pages Option */}
        <Pressable
          style={[styles.option, mode === 'all' && styles.optionSelected]}
          onPress={() => onModeChange('all')}
          testID={`${testID}-all`}
        >
          <View style={[styles.iconContainer, mode === 'all' && styles.iconContainerSelected]}>
            <Ionicons
              name="documents-outline"
              size={24}
              color={mode === 'all' ? colors.primary[500] : colors.text.secondary}
            />
          </View>
          <View style={styles.optionText}>
            <Text variant="body" style={[styles.label, mode === 'all' && styles.labelSelected]}>
              {t('pdf.all_pages')}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              {t('pdf.all_pages_desc')}
            </Text>
          </View>
          {mode === 'all' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
          )}
        </Pressable>

        {/* Custom Range Option */}
        <Pressable
          style={[styles.option, mode === 'custom' && styles.optionSelected]}
          onPress={() => onModeChange('custom')}
          testID={`${testID}-custom`}
        >
          <View style={[styles.iconContainer, mode === 'custom' && styles.iconContainerSelected]}>
            <Ionicons
              name="list-outline"
              size={24}
              color={mode === 'custom' ? colors.primary[500] : colors.text.secondary}
            />
          </View>
          <View style={styles.optionText}>
            <Text variant="body" style={[styles.label, mode === 'custom' && styles.labelSelected]}>
              {t('pdf.custom_range')}
            </Text>
            <Text variant="caption" color={colors.text.tertiary}>
              {t('pdf.custom_range_desc')}
            </Text>
          </View>
          {mode === 'custom' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
          )}
        </Pressable>

        {/* Custom Range Input */}
        {mode === 'custom' && (
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text variant="labelSmall" color={colors.text.tertiary}>
                {t('pdf.page_numbers')}
              </Text>
              <Text variant="caption" color={colors.text.tertiary}>
                (1-{pageCount})
              </Text>
            </View>
            <TextInput
              style={[styles.input, focused && styles.inputFocused]}
              value={pageRange}
              onChangeText={onPageRangeChange}
              placeholder="e.g., 1-3, 5, 7-9"
              placeholderTextColor={colors.neutral[400]}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              testID={`${testID}-input`}
            />
            <Text variant="caption" color={colors.text.tertiary} style={styles.hint}>
              {t('pdf.hint_ranges', {
                defaultValue: 'Enter page numbers or ranges separated by commas',
              })}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[1],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  optionSelected: {
    backgroundColor: colors.primary[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  iconContainerSelected: {
    backgroundColor: colors.primary[100],
  },
  optionText: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.primary[50],
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    fontSize: 16,
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: colors.primary[500],
  },
  hint: {
    marginTop: spacing[2],
  },
});

export default PageRangeSelector;

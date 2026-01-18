import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius, typography } from '@/theme';

interface TextInputCardProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  testID?: string;
  editable?: boolean;
}

export function TextInputCard({
  value,
  onChangeText,
  placeholder = 'Start typing or paste your document here...',
  label,
  testID,
  editable = true,
}: TextInputCardProps) {
  return (
    <View style={styles.container} testID={testID}>
      {label && (
        <Text variant="labelSmall" color={colors.text.tertiary} style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        multiline
        textAlignVertical="top"
        testID={testID ? `${testID}-input` : undefined}
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
  },
  label: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[4],
    letterSpacing: 0.5,
  },
  input: {
    flex: 1,
    fontSize: typography.variants.body.fontSize,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    lineHeight: 24,
    paddingTop: 0,
  },
});

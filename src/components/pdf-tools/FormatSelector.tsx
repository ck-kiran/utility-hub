import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

type ImageFormat = 'png' | 'jpg';

interface FormatSelectorProps {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
  testID?: string;
}

interface FormatOption {
  value: ImageFormat;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const formatOptions: FormatOption[] = [
  {
    value: 'png',
    label: 'PNG',
    description: 'Lossless, supports transparency',
    icon: 'image-outline',
  },
  {
    value: 'jpg',
    label: 'JPG',
    description: 'Smaller file size',
    icon: 'images-outline',
  },
];

export function FormatSelector({ value, onChange, testID }: FormatSelectorProps) {
  return (
    <Card variant="outlined" padding={0} testID={testID}>
      <View style={styles.container}>
        {formatOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(option.value)}
              testID={`${testID}-${option.value}`}
            >
              <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={isSelected ? colors.primary[500] : colors.text.secondary}
                />
              </View>
              <View style={styles.optionText}>
                <Text variant="body" style={[styles.label, isSelected && styles.labelSelected]}>
                  {option.label}
                </Text>
                <Text variant="caption" color={colors.text.tertiary}>
                  {option.description}
                </Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary[500]} />
              )}
            </Pressable>
          );
        })}
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
});

export default FormatSelector;

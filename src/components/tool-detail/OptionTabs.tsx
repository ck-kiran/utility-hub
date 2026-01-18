import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface Option {
  id: string;
  label: string;
}

interface OptionTabsProps {
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OptionTabs({ options, selectedId, onSelect }: OptionTabsProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={[styles.tab, isSelected && styles.tabSelected]}
          >
            <Text variant="caption" color={isSelected ? colors.primary[500] : colors.text.tertiary}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
  },
});

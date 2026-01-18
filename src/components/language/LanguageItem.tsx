import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing } from '@/theme';

interface LanguageItemProps {
  name: string;
  localName?: string;
  isSelected?: boolean;
  onPress: () => void;
  testID?: string;
}

export function LanguageItem({
  name,
  localName,
  isSelected = false,
  onPress,
  testID,
}: LanguageItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.content}>
        <Text variant="body" style={[styles.name, isSelected && styles.selectedText]}>
          {name}
        </Text>
        {localName && (
          <Text variant="caption" color={colors.text.tertiary} style={styles.localName}>
            {localName}
          </Text>
        )}
      </View>
      {isSelected && <Ionicons name="checkmark" size={24} color={colors.primary[500]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  selected: {
    backgroundColor: colors.primary[50],
  },
  pressed: {
    backgroundColor: colors.neutral[50],
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '400',
  },
  selectedText: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  localName: {
    marginTop: spacing[1],
  },
});

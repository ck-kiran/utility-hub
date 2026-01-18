import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { hexToRgba } from '@/utils/colors';

interface ToolListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  themeColor?: string;
  onPress?: () => void;
}

export function ToolListItem({
  icon,
  title,
  description,
  themeColor = colors.primary[500],
  onPress,
}: ToolListItemProps) {
  const backgroundColor = hexToRgba(themeColor, 0.1);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={icon} size={24} color={themeColor} />
      </View>
      <View style={styles.content}>
        <Text variant="body">{title}</Text>
        <Text variant="caption" color={colors.text.tertiary}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.neutral[300]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
});

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface ToolListItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
}

export function ToolListItem({ icon, title, description, onPress }: ToolListItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text variant="body" weight="medium">
          {title}
        </Text>
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
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
});

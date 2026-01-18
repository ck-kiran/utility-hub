import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { hexToRgba } from '@/utils/colors';

interface ToolCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  themeColor?: string;
  onPress?: () => void;
}

export function ToolCard({
  icon,
  label,
  themeColor = colors.primary[500],
  onPress,
}: ToolCardProps) {
  const backgroundColor = hexToRgba(themeColor, 0.1);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={icon} size={32} color={themeColor} />
      </View>
      <Text variant="caption" style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginRight: spacing[3],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  label: {
    textAlign: 'center',
    color: colors.text.primary,
  },
});

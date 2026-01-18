import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Badge } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface ThirdPartyItemProps {
  name: string;
  badge: string;
  onPress?: () => void;
}

export function ThirdPartyItem({ name, badge, onPress }: ThirdPartyItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text variant="body">{name}</Text>
      <View style={styles.right}>
        <Badge label={badge} variant="info" />
        {onPress && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.neutral[400]}
            style={styles.chevron}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  pressed: {
    backgroundColor: colors.neutral[50],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: spacing[2],
  },
});

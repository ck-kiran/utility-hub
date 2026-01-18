import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius, iconSize } from '@/theme';

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
  testID?: string;
}

export const ProfileMenuItem = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  isDestructive = false,
  rightElement,
  testID,
}: ProfileMenuItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
      testID={testID}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, isDestructive && styles.destructiveIconContainer]}>
          <Ionicons
            name={icon}
            size={iconSize.sm}
            color={isDestructive ? colors.error[500] : colors.primary[500]}
          />
        </View>
        <Text
          variant="body"
          style={[styles.label, isDestructive && styles.destructiveLabel]}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
        </Text>
      </View>

      <View style={styles.rightContent}>
        {value && (
          <Text
            variant="caption"
            color={colors.text.secondary}
            style={styles.value}
            testID={testID ? `${testID}-value` : undefined}
          >
            {value}
          </Text>
        )}
        {rightElement}
        {showChevron && !rightElement && (
          <Ionicons name="chevron-forward" size={iconSize.sm} color={colors.neutral[400]} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface,
    marginBottom: 1, // Separator
  },
  pressed: {
    backgroundColor: colors.neutral[50],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  destructiveIconContainer: {
    backgroundColor: colors.error[50],
  },
  label: {
    fontWeight: '500',
  },
  destructiveLabel: {
    color: colors.error[500],
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    marginRight: spacing[2],
  },
});

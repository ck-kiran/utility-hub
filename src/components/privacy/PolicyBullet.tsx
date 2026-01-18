import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing } from '@/theme';

interface PolicyBulletProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function PolicyBullet({ title, description, icon }: PolicyBulletProps) {
  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={16} color={colors.primary[500]} />
        </View>
      ) : (
        <View style={styles.bullet} />
      )}
      <View style={styles.content}>
        <Text variant="body" style={styles.title}>
          {title}
        </Text>
        <Text variant="caption" color={colors.text.secondary} style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing[3],
    paddingLeft: spacing[2],
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
    marginTop: 2,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginRight: spacing[3],
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
    marginBottom: spacing[1],
  },
  description: {
    lineHeight: 20,
  },
});

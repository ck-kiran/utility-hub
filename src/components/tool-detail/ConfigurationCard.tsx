import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing } from '@/theme';

interface ConfigurationCardProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ConfigurationCard({
  title,
  subtitle,
  icon = 'options-outline',
  children,
  defaultExpanded = true,
}: ConfigurationCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card variant="elevated" padding={0}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={colors.primary[500]} />
        </View>
        <View style={styles.headerContent}>
          <Text variant="body">{title}</Text>
          <Text variant="caption" color={colors.text.tertiary}>
            {subtitle}
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.neutral[400]}
        />
      </Pressable>
      {expanded && <View style={styles.content}>{children}</View>}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  headerContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
});

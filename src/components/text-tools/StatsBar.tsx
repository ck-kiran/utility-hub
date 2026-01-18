import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface StatItem {
  value: number;
  label: string;
}

interface StatsBarProps {
  stats: StatItem[];
  testID?: string;
}

export function StatsBar({ stats, testID }: StatsBarProps) {
  return (
    <View style={styles.container} testID={testID}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <View style={styles.statItem}>
            <Text variant="h2" style={styles.value}>
              {stat.value}
            </Text>
            <Text variant="labelSmall" color={colors.text.tertiary} style={styles.label}>
              {stat.label}
            </Text>
          </View>
          {index < stats.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    marginBottom: spacing[1],
  },
  label: {
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing[1],
  },
});

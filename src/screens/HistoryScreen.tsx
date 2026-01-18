import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors } from '@/theme';

export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">History</Text>
      <Text variant="body" color={colors.neutral[500]}>
        View your recent activity
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

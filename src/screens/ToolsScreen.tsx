import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors } from '@/theme';

export function ToolsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Tools</Text>
      <Text variant="body" color={colors.neutral[500]}>
        Browse all utility tools
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

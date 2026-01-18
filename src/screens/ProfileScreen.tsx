import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/common';
import { colors } from '@/theme';

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Profile</Text>
      <Text variant="body" color={colors.neutral[500]}>
        Manage your account settings
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

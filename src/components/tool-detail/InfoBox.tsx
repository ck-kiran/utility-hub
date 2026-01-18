import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface InfoBoxProps {
  message: string;
}

export function InfoBox({ message }: InfoBoxProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="information-circle" size={20} color={colors.info[500]} style={styles.icon} />
      <Text variant="caption" color={colors.text.secondary} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.info[50],
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: spacing[2],
    marginTop: 2,
  },
  text: {
    flex: 1,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface DividerProps {
  spacing?: keyof typeof spacing;
}

export function Divider({ spacing: dividerSpacing = 4 }: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical: spacing[dividerSpacing],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
});

export default Divider;

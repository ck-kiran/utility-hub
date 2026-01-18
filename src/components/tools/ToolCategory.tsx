import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from '@/components/common';
import { spacing } from '@/theme';

interface ToolCategoryProps {
  title: string;
  children: React.ReactNode;
}

export function ToolCategory({ title, children }: ToolCategoryProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      <Card variant="elevated" padding={0}>
        {children}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  title: {
    marginBottom: spacing[3],
  },
});

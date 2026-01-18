import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  safeArea?: boolean;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = true,
  padding = true,
  safeArea = true,
  style,
}: ScreenContainerProps) {
  const content = (
    <View style={[styles.container, padding && styles.padding, style]}>{children}</View>
  );

  const scrollContent = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  if (safeArea) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {scrollContent}
      </SafeAreaView>
    );
  }

  return scrollContent;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: spacing[4],
  },
});

export default ScreenContainer;

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';
import { ProcessingState } from '@/types/pdf';

interface ProgressIndicatorProps {
  state: ProcessingState;
  testID?: string;
}

export function ProgressIndicator({ state, testID }: ProgressIndicatorProps) {
  const { status, progress, message } = state;

  if (status === 'idle') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: null,
          color: colors.primary[500],
          backgroundColor: colors.primary[50],
          showProgress: true,
        };
      case 'complete':
        return {
          icon: 'checkmark-circle' as const,
          color: colors.success[500],
          backgroundColor: colors.success[50],
          showProgress: false,
        };
      case 'error':
        return {
          icon: 'alert-circle' as const,
          color: colors.error[500],
          backgroundColor: colors.error[50],
          showProgress: false,
        };
      default:
        return {
          icon: null,
          color: colors.neutral[500],
          backgroundColor: colors.neutral[50],
          showProgress: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card variant="filled" padding={4} testID={testID} style={styles.container}>
      <View style={[styles.content, { backgroundColor: config.backgroundColor }]}>
        <View style={styles.iconContainer}>
          {config.showProgress ? (
            <ActivityIndicator size="small" color={config.color} />
          ) : (
            config.icon && <Ionicons name={config.icon} size={24} color={config.color} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text variant="body" style={{ color: config.color, fontWeight: '600' }}>
            {status === 'processing'
              ? `Processing... ${Math.round(progress * 100)}%`
              : status === 'complete'
                ? 'Complete!'
                : 'Error'}
          </Text>
          {message && (
            <Text variant="caption" color={colors.text.secondary} style={styles.message}>
              {message}
            </Text>
          )}
        </View>
      </View>
      {status === 'processing' && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
  },
  message: {
    marginTop: spacing[1],
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.sm,
    marginTop: spacing[3],
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.sm,
  },
});

export default ProgressIndicator;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/common';
import { colors, spacing, borderRadius } from '@/theme';

interface FileUploadCardProps {
  title: string;
  subtitle: string;
  onChooseFile: () => void;
  selectedFile?: string;
}

export function FileUploadCard({
  title,
  subtitle,
  onChooseFile,
  selectedFile,
}: FileUploadCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-upload" size={32} color={colors.primary[500]} />
      </View>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      <Text variant="caption" color={colors.text.tertiary} style={styles.subtitle}>
        {subtitle}
      </Text>
      {selectedFile ? (
        <View style={styles.selectedFile}>
          <Ionicons name="document" size={20} color={colors.primary[500]} />
          <Text variant="body" style={styles.fileName} numberOfLines={1}>
            {selectedFile}
          </Text>
        </View>
      ) : (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Ionicons name="add" size={18} color={colors.primary[500]} />}
          onPress={onChooseFile}
        >
          Choose File
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    marginBottom: spacing[2],
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
  },
  fileName: {
    marginLeft: spacing[2],
    maxWidth: 200,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '@/components/common';
import { FileUploadCard, ConfigurationCard, OptionTabs, InfoBox } from '@/components/tool-detail';
import { colors, spacing } from '@/theme';

const COMPRESSION_OPTIONS = [
  { id: 'high', label: 'High Quality' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'small', label: 'Small Size' },
];

const COMPRESSION_INFO: Record<string, string> = {
  high: 'High quality compression maintains excellent visual quality with minimal file size reduction.',
  balanced:
    'Medium compression reduces file size significantly while maintaining good quality for reading.',
  small: 'Maximum compression creates the smallest file size but may reduce visual quality.',
};

export function ToolDetailScreen() {
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [compressionLevel, setCompressionLevel] = useState('balanced');
  const [sliderValue, setSliderValue] = useState(0.5);

  const handleChooseFile = () => {
    // TODO: Implement file picker
    setSelectedFile('example_document.pdf');
  };

  const handleCompress = () => {
    // TODO: Implement compression
  };

  const handleBack = () => {
    // TODO: Navigate back
  };

  const handleCompressionChange = (id: string) => {
    setCompressionLevel(id);
    switch (id) {
      case 'high':
        setSliderValue(0.25);
        break;
      case 'balanced':
        setSliderValue(0.5);
        break;
      case 'small':
        setSliderValue(0.75);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text variant="h3" style={styles.headerTitle}>
            Compress PDF
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* File Upload */}
          <FileUploadCard
            title="Upload PDF"
            subtitle="Drag & drop or select files from your device. Max 20MB."
            onChooseFile={handleChooseFile}
            selectedFile={selectedFile}
          />

          {/* Configuration */}
          <View style={styles.configSection}>
            <Text variant="labelSmall" color={colors.text.tertiary} style={styles.sectionLabel}>
              CONFIGURATION
            </Text>
            <ConfigurationCard
              title="Compression Level"
              subtitle="Medium (Recommended)"
              icon="options-outline"
            >
              <OptionTabs
                options={COMPRESSION_OPTIONS}
                selectedId={compressionLevel}
                onSelect={handleCompressionChange}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={sliderValue}
                onValueChange={setSliderValue}
                minimumTrackTintColor={colors.primary[500]}
                maximumTrackTintColor={colors.neutral[200]}
                thumbTintColor={colors.primary[500]}
              />
              <InfoBox message={COMPRESSION_INFO[compressionLevel]} />
            </ConfigurationCard>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Ionicons name="resize-outline" size={20} color={colors.surface} />}
            onPress={handleCompress}
            disabled={!selectedFile}
          >
            Compress PDF
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  configSection: {
    marginTop: spacing[6],
  },
  sectionLabel: {
    marginBottom: spacing[3],
    letterSpacing: 1,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: spacing[3],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background,
  },
});

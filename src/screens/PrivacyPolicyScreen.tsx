import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common';
import { PolicySection, PolicyBullet, ThirdPartyItem } from '@/components/privacy';
import { colors, spacing, borderRadius } from '@/theme';

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRequestDataDeletion = () => {
    // TODO: Implement data deletion request
  };

  const handleOptOutAnalytics = () => {
    // TODO: Implement analytics opt-out
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:privacy@utilityapp.com');
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
            Privacy Policy
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Effective Date */}
          <View style={styles.effectiveDate}>
            <Text variant="labelSmall" color={colors.text.tertiary}>
              EFFECTIVE DATE
            </Text>
            <Text variant="body" color={colors.text.secondary}>
              October 24, 2023
            </Text>
          </View>

          {/* Introduction */}
          <Text variant="body" color={colors.text.secondary} style={styles.intro}>
            We believe privacy is a fundamental human right. This policy outlines how we handle your
            data when you use our file and text processing utility tools. Our philosophy is simple:{' '}
            <Text variant="body" style={styles.highlight}>
              what happens on your device, stays on your device.
            </Text>
          </Text>

          {/* Section 1: Data Collection */}
          <PolicySection number="1" title="Data Collection">
            <Text variant="body" color={colors.text.secondary} style={styles.paragraph}>
              We collect minimal data necessary to provide our services. Because our tools function
              primarily as offline utilities, we do not upload your files to any cloud server for
              processing.
            </Text>

            <PolicyBullet
              icon="phone-portrait-outline"
              title="Local Processing"
              description="All file conversions and text manipulations occur locally on your device's CPU."
            />

            <PolicyBullet
              icon="analytics-outline"
              title="Usage Analytics"
              description="We collect anonymous crash reports and feature usage statistics to improve app stability. This data is never linked to your identity."
            />
          </PolicySection>

          {/* Section 2: Security */}
          <PolicySection number="2" title="Security">
            <Text variant="body" color={colors.text.secondary} style={styles.paragraph}>
              We implement industry-standard security measures to protect the limited data we hold.
            </Text>
            <Text variant="body" color={colors.text.secondary} style={styles.paragraph}>
              Since your files (PDFs, images, text documents) never leave your device during
              processing, they are secured by your device&apos;s native sandboxing and encryption
              (e.g., iOS Data Protection). We do not have access to your file contents.
            </Text>
          </PolicySection>

          {/* Section 3: Third-Party Services */}
          <PolicySection number="3" title="Third-Party Services">
            <Text variant="body" color={colors.text.secondary} style={styles.paragraph}>
              Our application may utilize the following third-party services for specific
              functionalities, such as analytics or premium subscription management.
            </Text>

            <ThirdPartyItem name="Apple StoreKit" badge="Payments" />
            <ThirdPartyItem name="Google Firebase" badge="Analytics" />
          </PolicySection>

          {/* Section 4: Your Rights */}
          <PolicySection number="4" title="Your Rights">
            <Text variant="body" color={colors.text.secondary} style={styles.paragraph}>
              Depending on your location, you may have rights regarding your personal information,
              including the right to request access, correction, or deletion of your data.
            </Text>

            <Pressable style={styles.actionButton} onPress={handleRequestDataDeletion}>
              <Text variant="body" color={colors.primary[500]}>
                Request Data Deletion
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
            </Pressable>

            <Pressable style={styles.actionButton} onPress={handleOptOutAnalytics}>
              <Text variant="body" color={colors.primary[500]}>
                Opt-out of Analytics
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
            </Pressable>
          </PolicySection>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text variant="h3" style={styles.contactTitle}>
              Have questions?
            </Text>
            <Text variant="body" color={colors.text.secondary} style={styles.contactText}>
              If you have any concerns about our policy or your data, please reach out to our
              privacy officer.
            </Text>
            <Pressable style={styles.emailButton} onPress={handleEmailPress}>
              <Ionicons name="mail-outline" size={20} color={colors.primary[500]} />
              <Text variant="body" color={colors.primary[500]} style={styles.emailText}>
                privacy@utilityapp.com
              </Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: spacing[8],
  },
  effectiveDate: {
    marginBottom: spacing[4],
  },
  intro: {
    marginBottom: spacing[6],
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '500',
    color: colors.text.primary,
  },
  paragraph: {
    marginBottom: spacing[4],
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing[2],
  },
  contactSection: {
    marginTop: spacing[4],
    paddingTop: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  contactTitle: {
    marginBottom: spacing[2],
  },
  contactText: {
    marginBottom: spacing[4],
    lineHeight: 22,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    marginLeft: spacing[2],
  },
});

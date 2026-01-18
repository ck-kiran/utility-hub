import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from '@/components/common';
import { ActivityItem, DateSection } from '@/components/history';
import { colors, spacing } from '@/theme';

const TODAY_ACTIVITIES = [
  {
    id: '1',
    fileName: 'Invoice_2023.pdf',
    action: 'compressed' as const,
    status: 'completed' as const,
    timestamp: '10:45 AM',
    fileType: 'pdf' as const,
  },
  {
    id: '2',
    fileName: 'Vacation_Photo.jpg',
    action: 'converted' as const,
    status: 'completed' as const,
    timestamp: '09:30 AM',
    fileType: 'image' as const,
  },
  {
    id: '3',
    fileName: 'Voice_Memo_001.m4a',
    action: 'converted' as const,
    status: 'failed' as const,
    timestamp: '08:15 AM',
    fileType: 'audio' as const,
  },
];

const YESTERDAY_ACTIVITIES = [
  {
    id: '4',
    fileName: 'Meeting_Notes.txt',
    action: 'formatted' as const,
    status: 'completed' as const,
    timestamp: '4:15 PM',
    fileType: 'document' as const,
  },
  {
    id: '5',
    fileName: 'Project_Assets.zip',
    action: 'extracted' as const,
    status: 'completed' as const,
    timestamp: '1:20 PM',
    fileType: 'archive' as const,
  },
];

export function HistoryScreen() {
  const handleClearHistory = () => {
    // TODO: Implement clear history
  };

  const handleActivityPress = (_activityId: string) => {
    // TODO: Show activity details
  };

  const handleActionPress = (_activityId: string) => {
    // TODO: Download/share/retry
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h1">Recent Activity</Text>
            <Text variant="body" color={colors.text.tertiary}>
              Your processing history
            </Text>
          </View>
          <Button variant="outline" size="sm" onPress={handleClearHistory}>
            CLEAR
          </Button>
        </View>

        {/* Today Section */}
        <DateSection title="TODAY">
          {TODAY_ACTIVITIES.map((activity) => (
            <ActivityItem
              key={activity.id}
              fileName={activity.fileName}
              action={activity.action}
              status={activity.status}
              timestamp={activity.timestamp}
              fileType={activity.fileType}
              onPress={() => handleActivityPress(activity.id)}
              onActionPress={() => handleActionPress(activity.id)}
            />
          ))}
        </DateSection>

        {/* Yesterday Section */}
        <DateSection title="YESTERDAY">
          {YESTERDAY_ACTIVITIES.map((activity) => (
            <ActivityItem
              key={activity.id}
              fileName={activity.fileName}
              action={activity.action}
              status={activity.status}
              timestamp={activity.timestamp}
              fileType={activity.fileType}
              onPress={() => handleActivityPress(activity.id)}
              onActionPress={() => handleActionPress(activity.id)}
            />
          ))}
        </DateSection>
      </ScrollView>
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
    paddingHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[4],
  },
});

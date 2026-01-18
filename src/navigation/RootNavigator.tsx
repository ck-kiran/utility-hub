import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import {
  ToolDetailScreen,
  WordCounterScreen,
  CaseConverterScreen,
  PrivacyPolicyScreen,
  HelpCenterScreen,
  LanguageSelectionScreen,
} from '@/screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ToolDetail" component={ToolDetailScreen} />
      <Stack.Screen name="WordCounter" component={WordCounterScreen} />
      <Stack.Screen name="CaseConverter" component={CaseConverterScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}

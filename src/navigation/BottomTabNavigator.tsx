import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, ToolsScreen, HistoryScreen, ProfileScreen } from '@/screens';
import { colors } from '@/theme';
import { t } from '@/i18n';
import { useAppStore } from '@/store';
import type { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type TabIconName =
  | 'home'
  | 'home-outline'
  | 'grid'
  | 'grid-outline'
  | 'time'
  | 'time-outline'
  | 'person'
  | 'person-outline';

const TAB_ICONS: Record<
  keyof BottomTabParamList,
  { focused: TabIconName; unfocused: TabIconName }
> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Tools: { focused: 'grid', unfocused: 'grid-outline' },
  History: { focused: 'time', unfocused: 'time-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export function BottomTabNavigator() {
  useAppStore((state) => state.language);

  return (
    <Tab.Navigator
      id="BottomTabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconConfig = TAB_ICONS[route.name];
          const iconName = focused ? iconConfig.focused : iconConfig.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Tools" component={ToolsScreen} options={{ tabBarLabel: t('tabs.tools') }} />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: t('tabs.history') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
}

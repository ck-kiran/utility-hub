import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, ToolsScreen, HistoryScreen, ProfileScreen } from '@/screens';
import { colors } from '@/theme';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ToolDetail: { toolId: string; toolName: string };
};

// Bottom Tabs
export type BottomTabParamList = {
  Home: undefined;
  Tools: undefined;
  History: undefined;
  Profile: undefined;
};

// Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Home'>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ToolsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Tools'>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type HistoryScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'History'>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Profile'>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ToolDetailScreenProps = RootStackScreenProps<'ToolDetail'>;

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
  Home: undefined;
  Tools: undefined;
  History: undefined;
  Profile: undefined;
};

export type HomeScreenProps = BottomTabScreenProps<BottomTabParamList, 'Home'>;
export type ToolsScreenProps = BottomTabScreenProps<BottomTabParamList, 'Tools'>;
export type HistoryScreenProps = BottomTabScreenProps<BottomTabParamList, 'History'>;
export type ProfileScreenProps = BottomTabScreenProps<BottomTabParamList, 'Profile'>;

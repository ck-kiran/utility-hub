import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ToolDetail: { toolId: string; toolName: string };
  WordCounter: undefined;
  CaseConverter: undefined;
  JsonFormatter: undefined;
  MergePdf: undefined;
  ImageToPdf: undefined;
  PdfToImage: undefined;
  SplitPdf: undefined;
  TextToAudio: undefined;
  AudioToText: undefined;
  ResizeImage: undefined;
  ConvertToJpg: undefined;
  PrivacyPolicy: undefined;
  HelpCenter: undefined;
  LanguageSelection: undefined;
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
export type PrivacyPolicyScreenProps = RootStackScreenProps<'PrivacyPolicy'>;
export type HelpCenterScreenProps = RootStackScreenProps<'HelpCenter'>;
export type LanguageSelectionScreenProps = RootStackScreenProps<'LanguageSelection'>;
export type WordCounterScreenProps = RootStackScreenProps<'WordCounter'>;
export type CaseConverterScreenProps = RootStackScreenProps<'CaseConverter'>;
export type JsonFormatterScreenProps = RootStackScreenProps<'JsonFormatter'>;
export type MergePdfScreenProps = RootStackScreenProps<'MergePdf'>;
export type ImageToPdfScreenProps = RootStackScreenProps<'ImageToPdf'>;
export type PdfToImageScreenProps = RootStackScreenProps<'PdfToImage'>;
export type SplitPdfScreenProps = RootStackScreenProps<'SplitPdf'>;
export type TextToAudioScreenProps = RootStackScreenProps<'TextToAudio'>;
export type AudioToTextScreenProps = RootStackScreenProps<'AudioToText'>;
export type ResizeImageScreenProps = RootStackScreenProps<'ResizeImage'>;
export type ConvertToJpgScreenProps = RootStackScreenProps<'ConvertToJpg'>;

import React from 'react';
import { InputAccessoryView, StyleSheet, View, Button, Platform, Keyboard } from 'react-native';
import { colors } from '@/theme';

interface KeyboardDoneAccessoryProps {
  inputAccessoryViewID: string;
}

export function KeyboardDoneAccessory({ inputAccessoryViewID }: KeyboardDoneAccessoryProps) {
  if (Platform.OS !== 'ios') return null;

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.container}>
        <View style={styles.spacer} />
        <Button title="Done" onPress={Keyboard.dismiss} color={colors.primary[500]} />
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  spacer: {
    flex: 1,
  },
});

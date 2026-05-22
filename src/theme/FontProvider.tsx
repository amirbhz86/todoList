import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import { DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { useFonts } from 'expo-font';
import React, { createContext, useContext, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { taskflowSemantic } from '@/theme/taskflow';

const FontContext = createContext({ fontsReady: false });

export function FontProvider({ children }: { children: ReactNode }) {
  const [loaded] = useFonts({
    Syne: Syne_700Bold,
    Syne_600: Syne_600SemiBold,
    Syne_800: Syne_800ExtraBold,
    DMSans: DMSans_400Regular,
    DMSans_500: DMSans_500Medium,
    DMMono: DMMono_500Medium,
    IranianSans: require('../../assets/fonts/IranianSans.ttf'),
  });

  if (!loaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={taskflowSemantic.blue} />
      </View>
    );
  }

  return <FontContext.Provider value={{ fontsReady: true }}>{children}</FontContext.Provider>;
}

export function useFontsReady(): boolean {
  return useContext(FontContext).fontsReady;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: taskflowSemantic.bg,
  },
});

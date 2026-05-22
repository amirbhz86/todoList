import 'react-native-reanimated';

import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { initializeDatabase } from '@/infrastructure/database/client';
import i18n, { defaultNS } from '@/i18n';
import { PreferencesProvider } from '@/preferences/PreferencesProvider';
import { store } from '@/store';
import { FontProvider } from '@/theme/FontProvider';
import { useRootLayoutStyles } from '@/hooks/useRootLayoutStyles';
import { TaskSheetsProvider } from '@/features/tasks/sheets/TaskSheetsProvider';
import { MaterialThemeProvider } from '@/theme/ThemeProvider';

export default function RootLayout() {
  const styles = useRootLayoutStyles();

  useEffect(() => {
    initializeDatabase().catch(console.error);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n} defaultNS={defaultNS}>
          <PreferencesProvider>
            <FontProvider>
              <MaterialThemeProvider>
                <BottomSheetModalProvider>
                  <TaskSheetsProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                  </TaskSheetsProvider>
                </BottomSheetModalProvider>
              </MaterialThemeProvider>
            </FontProvider>
          </PreferencesProvider>
        </I18nextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { BottomNav } from '@/components/navigation/BottomNav';
import { useMaterialTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { semantic } = useMaterialTheme();

  return (
    <View style={{ flex: 1, backgroundColor: semantic.bg }}>
      <Tabs
        tabBar={(props) => <BottomNav {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          sceneStyle: { backgroundColor: semantic.bg },
        }}>
        <Tabs.Screen name="index" options={{ title: t('tabs.tasks') }} />
        <Tabs.Screen name="board" options={{ title: t('tabs.board') }} />
        <Tabs.Screen name="stats" options={{ title: t('tabs.stats') }} />
      </Tabs>
    </View>
  );
}

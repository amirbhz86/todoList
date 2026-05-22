import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { AppView } from '@/components/ui/AppView';
import { useThemeShellStyles } from '@/theme/useStyles';

import { usePreferences } from '@/preferences/PreferencesProvider';

import { appFontFamilies, typographyForLanguage } from './appFonts';
import { AppFontDefaults } from './AppFontDefaults';
import { useFontsReady } from './FontProvider';
import {
  getMaterial3Colors,
  material3Dark,
  motion,
  shape,
  spacing,
  type Material3Colors,
} from './material3';
import { taskflowSemantic, type TaskFlowSemantic } from './taskflow';

type ThemeContextValue = {
  colors: Material3Colors;
  semantic: TaskFlowSemantic;
  typography: ReturnType<typeof typographyForLanguage>;
  fonts: ReturnType<typeof appFontFamilies>;
  shape: typeof shape;
  spacing: typeof spacing;
  motion: typeof motion;
  isDark: true;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeShell({ children, value }: { children: React.ReactNode; value: ThemeContextValue }) {
  const { colors } = value;
  const styles = useThemeShellStyles();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.surface).catch(() => undefined);
  }, [colors.surface]);

  return (
    <AppView surface="surface" style={styles.shell}>
      <StatusBar style="light" />
      {children}
    </AppView>
  );
}

export function MaterialThemeProvider({ children }: { children: React.ReactNode }) {
  const { language } = usePreferences();
  const fontsReady = useFontsReady();

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: getMaterial3Colors(),
      semantic: taskflowSemantic,
      typography: typographyForLanguage(language, fontsReady),
      fonts: appFontFamilies(language, fontsReady),
      shape,
      spacing,
      motion,
      isDark: true,
    }),
    [language, fontsReady],
  );

  return (
    <ThemeContext.Provider value={value}>
      <AppFontDefaults />
      <ThemeShell value={value}>{children}</ThemeShell>
    </ThemeContext.Provider>
  );
}

export function useMaterialTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      colors: material3Dark,
      semantic: taskflowSemantic,
      typography: typographyForLanguage('en', true),
      fonts: appFontFamilies('en', true),
      shape,
      spacing,
      motion,
      isDark: true,
    };
  }
  return ctx;
}

export { material3Dark };

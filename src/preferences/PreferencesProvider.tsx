import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, I18nManager, StyleSheet, View } from "react-native";

import {
  applyAppLanguageText,
  applyAppLayoutDirection,
  isRtlLanguage,
} from "./applyLanguage";
import { loadPreferences, savePreferences } from "./storage";
import {
  DEFAULT_PREFERENCES,
  type AppLanguage,
  type AppPreferences,
} from "./types";

type PreferencesContextValue = {
  language: AppLanguage;
  isRtl: boolean;
  hydrated: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function syncRtlLayout(language: AppLanguage): void {
  const shouldUseRtl = isRtlLanguage(language);
  if (I18nManager.isRTL !== shouldUseRtl) {
    I18nManager.allowRTL(shouldUseRtl);
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);
  const preferencesRef = useRef(preferences);
  preferencesRef.current = preferences;

  useEffect(() => {
    let mounted = true;

    (async () => {
      const stored = await loadPreferences();
      await applyAppLanguageText(stored.language);
      syncRtlLayout(stored.language);

      if (mounted) {
        setPreferences(stored);
        preferencesRef.current = stored;
        setHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (language: AppLanguage) => {
    const prev = preferencesRef.current;
    if (prev.language === language) {
      return;
    }

    const wasRtl = isRtlLanguage(prev.language);
    const next: AppPreferences = { ...prev, language };

    setPreferences(next);
    preferencesRef.current = next;

    await savePreferences(next);
    await applyAppLanguageText(language);

    if (wasRtl !== isRtlLanguage(language)) {
      await applyAppLayoutDirection(language);
    }
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language: preferences.language,
      isRtl: preferences.language === "fa",
      hydrated,
      setLanguage,
    }),
    [preferences, hydrated, setLanguage],
  );

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

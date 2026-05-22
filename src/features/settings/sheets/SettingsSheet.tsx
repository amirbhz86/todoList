import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import {
  TaskFlowBottomSheet,
  type TaskFlowBottomSheetRef,
} from "@/components/sheets/TaskFlowBottomSheet";
import { TaskFlowSheetHeader } from "@/components/sheets/TaskFlowSheetLayout";
import { AppView } from "@/components/ui/AppView";
import { Chip } from "@/components/ui/Chip";
import { useSettingsSheetStyles } from "@/features/settings/screens/useStyles";
import { usePreferences } from "@/preferences/PreferencesProvider";
import type { AppLanguage } from "@/preferences/types";

type SettingsSheetProps = {
  sheetRef: React.RefObject<TaskFlowBottomSheetRef | null>;
};

export function SettingsSheet({ sheetRef }: SettingsSheetProps) {
  const { t, i18n, ready } = useTranslation();
  const styles = useSettingsSheetStyles();
  const { language, setLanguage } = usePreferences();

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
  }, [sheetRef]);

  const handleLanguage = useCallback(
    (next: AppLanguage) => {
      void setLanguage(next);
    },
    [setLanguage],
  );

  return (
    <TaskFlowBottomSheet ref={sheetRef} snapPoints={['42%']}>
      <TaskFlowSheetHeader title={t("settings.title")} onClose={close} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
        <AppView surface="transparent" style={styles.chipRow}>
          <Chip
            index={0}
            label={t("settings.languageFa")}
            selected={language === "fa"}
            onPress={() => handleLanguage("fa")}
          />
          <Chip
            index={1}
            label={t("settings.languageEn")}
            selected={language === "en"}
            onPress={() => handleLanguage("en")}
          />
        </AppView>
        {ready ? (
          <Text style={styles.currentLanguage}>
            {t("settings.currentLanguage", { code: i18n.language })}
          </Text>
        ) : null}
      </View>
    </TaskFlowBottomSheet>
  );
}

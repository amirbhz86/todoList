import { reloadAppAsync } from "expo";
import { I18nManager } from "react-native";

import i18n from "@/i18n";

import type { AppLanguage } from "./types";

export function isRtlLanguage(language: AppLanguage): boolean {
  return language === "fa";
}

/** Updates translated strings and notifies react-i18next (languageChanged). */
export async function applyAppLanguageText(
  language: AppLanguage,
): Promise<void> {
  if (i18n.language === language) {
    return;
  }
  await i18n.changeLanguage(language);
}

/** Applies layout direction; requires a reload when RTL ↔ LTR changes. */
export async function applyAppLayoutDirection(
  language: AppLanguage,
): Promise<void> {
  const shouldUseRtl = isRtlLanguage(language);

  if (I18nManager.isRTL === shouldUseRtl) {
    return;
  }

  await reloadAppAsync();
}

export async function changeAppLanguage(language: AppLanguage): Promise<void> {
  await applyAppLanguageText(language);
  await applyAppLayoutDirection(language);
}

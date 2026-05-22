import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import resources from "./lang";

I18nManager.allowRTL(true);

export const defaultNS = "translation";

export const i18nReady = i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["fa", "en"],
  defaultNS,
  debug: false,
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    bindI18n: "languageChanged",
    bindI18nStore: "added removed",
  },
});

export default i18n;

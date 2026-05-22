import type { AppLanguage } from "@/preferences/types";

export type LanguageTextAlign = "left" | "right";

/** Label and body text: fa → right, en → left. */
export function getTextAlignForLanguage(
  language: AppLanguage | string,
): LanguageTextAlign {
  return language === "fa" ? "right" : "left";
}

/** TextInput fields: fa (RTL) → right, en (LTR) → left. */
export function getInputTextAlign(isRtl: boolean): LanguageTextAlign {
  return isRtl ? "right" : "left";
}

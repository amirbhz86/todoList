import type { TextStyle } from 'react-native';

import type { AppLanguage } from '@/preferences/types';
import { taskflowTypography, type TypographyScale } from '@/theme/taskflow';

export const PERSIAN_FONT_FAMILY = 'IranianSans';

export type AppFontFamilies = {
  displayBold: string;
  displaySemiBold: string;
  displayExtraBold: string;
  body: string;
  bodyMedium: string;
  mono: string;
};

export function appFontFamilies(language: AppLanguage, fontsReady: boolean): AppFontFamilies {
  if (!fontsReady) {
    return {
      displayBold: 'System',
      displaySemiBold: 'System',
      displayExtraBold: 'System',
      body: 'System',
      bodyMedium: 'System',
      mono: 'System',
    };
  }

  if (language === 'fa') {
    return {
      displayBold: PERSIAN_FONT_FAMILY,
      displaySemiBold: PERSIAN_FONT_FAMILY,
      displayExtraBold: PERSIAN_FONT_FAMILY,
      body: PERSIAN_FONT_FAMILY,
      bodyMedium: PERSIAN_FONT_FAMILY,
      mono: PERSIAN_FONT_FAMILY,
    };
  }

  return {
    displayBold: 'Syne',
    displaySemiBold: 'Syne_600',
    displayExtraBold: 'Syne_800',
    body: 'DMSans',
    bodyMedium: 'DMSans_500',
    mono: 'DMMono',
  };
}

/** Android/iOS: custom font files ignore fontWeight — drop it when fontFamily is set. */
export function withoutFontWeight(style: TextStyle): TextStyle {
  const { fontWeight: _fontWeight, ...rest } = style;
  return rest;
}

export function typographyForLanguage(
  language: AppLanguage,
  fontsReady: boolean,
): TypographyScale {
  const fonts = appFontFamilies(language, fontsReady);

  return {
    display: { ...withoutFontWeight(taskflowTypography.display), fontFamily: fonts.displayBold },
    body: { ...withoutFontWeight(taskflowTypography.body), fontFamily: fonts.body },
    mono: { ...withoutFontWeight(taskflowTypography.mono), fontFamily: fonts.mono },
    displayLarge: {
      ...withoutFontWeight(taskflowTypography.displayLarge),
      fontFamily: fonts.displayBold,
    },
    headlineLarge: {
      ...withoutFontWeight(taskflowTypography.headlineLarge),
      fontFamily: fonts.displayBold,
    },
    headlineMedium: {
      ...withoutFontWeight(taskflowTypography.headlineMedium),
      fontFamily: fonts.displayBold,
    },
    titleLarge: {
      ...withoutFontWeight(taskflowTypography.titleLarge),
      fontFamily: fonts.displaySemiBold,
    },
    titleMedium: {
      ...withoutFontWeight(taskflowTypography.titleMedium),
      fontFamily: fonts.displaySemiBold,
    },
    bodyLarge: {
      ...withoutFontWeight(taskflowTypography.bodyLarge),
      fontFamily: fonts.body,
    },
    bodyMedium: {
      ...withoutFontWeight(taskflowTypography.bodyMedium),
      fontFamily: fonts.body,
    },
    labelLarge: {
      ...withoutFontWeight(taskflowTypography.labelLarge),
      fontFamily: fonts.bodyMedium,
    },
    labelMedium: {
      ...withoutFontWeight(taskflowTypography.labelMedium),
      fontFamily: fonts.mono,
    },
  };
}

export function defaultBodyFontFamily(language: AppLanguage, fontsReady: boolean): string {
  return appFontFamilies(language, fontsReady).body;
}

import { useMemo } from 'react';
import { Platform, type TextStyle } from 'react-native';

import { usePreferences } from '@/preferences/PreferencesProvider';
import { getInputTextAlign, getTextAlignForLanguage } from '@/utils/textAlign';

export type AppTextStyles = {
  text: Pick<TextStyle, 'textAlign' | 'writingDirection'>;
  textCenter: Pick<TextStyle, 'textAlign'>;
  input: Pick<TextStyle, 'textAlign' | 'writingDirection'>;
};

/** Language-aware text alignment for labels and TextInput fields. */
export function useTextStyles(): AppTextStyles {
  const { language, isRtl } = usePreferences();

  return useMemo(() => {
    const textAlign = getTextAlignForLanguage(language);
    const inputTextAlign = getInputTextAlign(isRtl);
    const writingDirection = language === 'fa' ? ('rtl' as const) : ('ltr' as const);

    return {
      text: {
        textAlign,
        ...(Platform.OS === 'ios' ? { writingDirection } : {}),
      },
      textCenter: {
        textAlign: 'center',
      },
      input: {
        textAlign: inputTextAlign,
        ...(Platform.OS === 'ios' ? { writingDirection } : {}),
      },
    } satisfies AppTextStyles;
  }, [isRtl, language]);
}

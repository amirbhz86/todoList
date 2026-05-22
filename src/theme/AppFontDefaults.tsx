import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';

import { usePreferences } from '@/preferences/PreferencesProvider';
import { defaultBodyFontFamily } from '@/theme/appFonts';
import { useFontsReady } from '@/theme/FontProvider';

/** Applies default fontFamily to Text/TextInput so unstyled strings still use app fonts. */
export function AppFontDefaults() {
  const { language } = usePreferences();
  const fontsReady = useFontsReady();

  useEffect(() => {
    if (!fontsReady) return;

    const fontFamily = defaultBodyFontFamily(language, fontsReady);
    const defaultStyle = { fontFamily };

    const textProto = Text as typeof Text & { defaultProps?: { style?: object } };
    const inputProto = TextInput as typeof TextInput & { defaultProps?: { style?: object } };

    textProto.defaultProps = { ...textProto.defaultProps, style: defaultStyle };
    inputProto.defaultProps = { ...inputProto.defaultProps, style: defaultStyle };
  }, [language, fontsReady]);

  return null;
}

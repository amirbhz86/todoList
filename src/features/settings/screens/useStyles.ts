import { useMemo } from "react";
import { type TextStyle, type ViewStyle } from "react-native";

import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useTextStyles } from "@/hooks/useTextStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

export function useSettingsSheetStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { text } = useTextStyles();
  const { rowWrap } = useLayoutStyles();

  return useMemo(
    () => ({
      section: {
        marginBottom: 8,
      } as ViewStyle,
      sectionTitle: {
        ...typography.labelMedium,
        fontSize: 10,
        ...text,
        letterSpacing: 1,
        color: semantic.textMuted,
        textTransform: "uppercase",
        marginBottom: 10,
      } as TextStyle,
      chipRow: { ...rowWrap, gap: 8 } as ViewStyle,
      currentLanguage: {
        ...text,
        ...typography.labelMedium,
        fontSize: 11,
        color: semantic.textMuted,
        marginTop: 10,
      } as TextStyle,
    }),
    [rowWrap, semantic, text, typography],
  );
}

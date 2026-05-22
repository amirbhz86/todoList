import { useMemo } from "react";
import type { ViewStyle } from "react-native";

import { usePreferences } from "@/preferences/PreferencesProvider";

export type LayoutStyles = {
  /** `row` for English (LTR), `row-reverse` for Persian (RTL). */
  flexDirection: "row" | "row-reverse";
  row: Pick<ViewStyle, "flexDirection">;
  rowWrap: Pick<ViewStyle, "flexDirection" | "flexWrap">;
};

/** Language-aware horizontal layout (en → row, fa → row-reverse). */
export function useLayoutStyles(): LayoutStyles {
  const { isRtl } = usePreferences();

  return useMemo(() => {
    const flexDirection = !isRtl ? ("row" as const) : ("row-reverse" as const);
    return {
      flexDirection,
      row: { flexDirection },
      rowWrap: { flexDirection, flexWrap: "wrap" },
    };
  }, [isRtl]);
}

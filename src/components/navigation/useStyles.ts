import { useMemo } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";
import { spacing } from "@/theme/material3";

export function useBottomNavStyles() {
  const { semantic, typography } = useMaterialTheme();

  return useMemo(
    () => ({
      bar: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: 8,
        backgroundColor: semantic.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: semantic.border,
      } as ViewStyle,
      navBtn: {
        flex: 1,
        alignItems: "center",
        gap: 3,
        paddingVertical: 6,
      } as ViewStyle,
      navLabel: {
        ...typography.labelMedium,
        fontSize: 10,
        letterSpacing: 0.4,
        color: semantic.textMuted,
        textTransform: "none",
      } as TextStyle,
      navLabelActive: {
        color: semantic.blue,
      } as TextStyle,
    }),
    [semantic, typography],
  );
}

export function useTopBarStyles() {
  const { semantic, typography, fonts } = useMaterialTheme();
  const { row } = useLayoutStyles();

  return useMemo(
    () => ({
      logoRow: {
        ...row,
        justifyContent: "flex-start",
        gap: spacing.sm,
        alignItems: "center",
        flex: 1,
      } as ViewStyle,
      bar: {
        paddingHorizontal: 18,
        paddingBottom: 10,
        paddingTop: 14,
        backgroundColor: semantic.bg,
        ...row,
        alignItems: "center",
        gap: 10,
      } as ViewStyle,
      logoIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: semantic.blue,
      } as ViewStyle,
      logoText: {
        fontFamily: fonts.displayExtraBold,
        fontSize: 13,
        color: "#fff",
        letterSpacing: -1,
      } as TextStyle,
      logoName: {
        ...typography.headlineMedium,
        color: semantic.textPrimary,
        letterSpacing: -0.4,
      } as TextStyle,
      logoAccent: {
        color: semantic.blue,
      } as TextStyle,
      actions: {
        flexDirection: "row",
        gap: 8,
      } as ViewStyle,
    }),
    [fonts.displayExtraBold, semantic, typography],
  );
}

export function useIconButtonStyles(active?: boolean) {
  const { semantic } = useMaterialTheme();

  return useMemo(
    () => ({
      btn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: active ? semantic.blueBg : semantic.surface,
        borderWidth: 1,
        borderColor: active ? semantic.blue : semantic.border,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
    }),
    [active, semantic],
  );
}

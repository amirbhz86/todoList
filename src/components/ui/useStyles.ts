import { useMemo } from "react";
import {
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useTextStyles } from "@/hooks/useTextStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const layout = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginEnd: 8,
    marginBottom: 8,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  padded: { paddingHorizontal: 32 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12 },
});

type ChipTone = "blue" | "amber" | "green" | "red" | "purple" | "default";

export function useChipStyles(
  selected?: boolean,
  tone: ChipTone = "default",
  index = 0,
) {
  const { semantic, typography, fonts } = useMaterialTheme();
  const { text } = useTextStyles();

  return useMemo(() => {
    const toneColor = {
      blue: semantic.blue,
      amber: semantic.amber,
      green: semantic.green,
      red: semantic.red,
      purple: semantic.purple,
      default: semantic.blue,
    }[tone];

    const pressable = {
      ...layout.chip,
      marginEnd: index !== 0 ? 8 : 0,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: selected ? toneColor : "transparent",
      borderRadius: 99,
      borderWidth: 1,
      borderColor: selected ? toneColor : semantic.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
    } as ViewStyle;

    return {
      pressable,
      withAnimated: (animated: StyleProp<ViewStyle>) =>
        [pressable, animated] as StyleProp<ViewStyle>,
      label: {
        ...text,
        ...typography.labelLarge,
        fontSize: 12.5,
        fontFamily: selected ? fonts.bodyMedium : fonts.body,
        color: selected ? "#fff" : semantic.textSecondary,
      } as TextStyle,
      countBadge: {
        backgroundColor: selected
          ? "rgba(255,255,255,0.15)"
          : semantic.surface3,
        borderRadius: 99,
        paddingHorizontal: 5,
        paddingVertical: 1,
      } as ViewStyle,
      countText: {
        ...typography.labelMedium,
        fontSize: 10,
        color: selected ? "#fff" : semantic.textMuted,
      } as TextStyle,
    };
  }, [
    fonts.body,
    fonts.bodyMedium,
    index,
    selected,
    semantic,
    text,
    tone,
    typography,
  ]);
}

export function useStateViewStyles() {
  const { colors, typography, spacing, shape } = useMaterialTheme();
  const { text } = useTextStyles();

  return useMemo(
    () => ({
      centered: layout.centered,
      padded: layout.padded,
      centeredPadded: [layout.centered, layout.padded] as ViewStyle[],
      loadingMessage: {
        ...text,
        ...typography.bodyMedium,
        color: colors.onSurfaceVariant,
        marginTop: spacing.md,
      } as TextStyle,
      errorTitle: {
        ...text,
        ...typography.titleMedium,
        color: colors.error,
      } as TextStyle,
      errorMessage: {
        ...text,
        ...typography.bodyMedium,
        color: colors.onSurfaceVariant,
        marginTop: spacing.sm,
      } as TextStyle,
      retryButton: {
        ...layout.retryButton,
        backgroundColor: colors.primaryContainer,
        borderRadius: shape.full,
        marginTop: spacing.lg,
      } as ViewStyle,
      retryLabel: {
        ...text,
        ...typography.labelLarge,
        color: colors.onPrimaryContainer,
      } as TextStyle,
      emptyTitle: {
        ...text,
        ...typography.headlineMedium,
        color: colors.onSurface,
      } as TextStyle,
      emptyMessage: {
        ...text,
        ...typography.bodyLarge,
        color: colors.onSurfaceVariant,
        marginTop: spacing.sm,
      } as TextStyle,
    }),
    [colors, shape, spacing, text, typography],
  );
}

export function useFabStyles() {
  const { semantic } = useMaterialTheme();

  return useMemo(() => {
    const pressable = {
      position: "absolute",
      right: 18,
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor: semantic.blue,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: semantic.blue,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
    } as ViewStyle;

    return {
      pressable,
    };
  }, [semantic]);
}

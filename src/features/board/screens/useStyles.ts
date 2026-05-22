import { useMemo } from "react";
import { Dimensions, type TextStyle, type ViewStyle } from "react-native";

import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const COLUMN_WIDTH = Math.min(280, Dimensions.get("window").width - 72);

export function useBoardScreenStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { row } = useLayoutStyles();

  return useMemo(
    () => ({
      columnWidth: COLUMN_WIDTH,
      container: {
        flex: 1,
        backgroundColor: semantic.bg,
      } as ViewStyle,
      columnsContent: {
        paddingHorizontal: 14,
        paddingBottom: 14,
        gap: 12,
      } as ViewStyle,
      column: {
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 18,
        overflow: "hidden",
        maxHeight: "100%",
      } as ViewStyle,
      columnDropTarget: {
        borderColor: semantic.blue,
        borderWidth: 2,
      } as ViewStyle,
      columnHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: semantic.surface,
        borderBottomWidth: 1,
        borderBottomColor: semantic.border,
      } as ViewStyle,
      columnDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
      } as ViewStyle,
      columnTitle: {
        ...typography.titleMedium,
        flex: 1,
        color: semantic.textPrimary,
      } as TextStyle,
      columnCount: {
        ...typography.labelMedium,
        color: semantic.textMuted,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: semantic.surface2,
        borderRadius: 99,
        overflow: "hidden",
      } as TextStyle,
      columnScroll: {
        flexGrow: 1,
      } as ViewStyle,
      columnCards: {
        padding: 10,
        gap: 8,
      } as ViewStyle,
      columnEmpty: {
        margin: 16,
        padding: 24,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: semantic.border,
        borderRadius: 12,
        textAlign: "center",
        color: semantic.textMuted,
        fontSize: 12.5,
      } as TextStyle,
      card: {
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        overflow: "hidden",
      } as ViewStyle,
      cardPressed: {
        opacity: 0.92,
      } as ViewStyle,
      cardDragging: {
        opacity: 0.35,
      } as ViewStyle,
      dragGhost: {
        position: "absolute",
        zIndex: 100,
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      } as ViewStyle,
      cardStripe: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
      } as ViewStyle,
      stripe_high: { backgroundColor: semantic.red } as ViewStyle,
      stripe_medium: { backgroundColor: semantic.amber } as ViewStyle,
      stripe_low: { backgroundColor: semantic.green } as ViewStyle,
      cardTitle: {
        ...typography.titleMedium,
        color: semantic.textPrimary,
        marginBottom: 7,
      } as TextStyle,
      cardTitleDone: {
        textDecorationLine: "line-through",
        color: semantic.textMuted,
      } as TextStyle,
      cardMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      } as ViewStyle,
      cardDate: {
        ...typography.labelMedium,
        marginLeft: "auto",
        color: semantic.textMuted,
      } as TextStyle,
    }),
    [semantic, typography],
  );
}

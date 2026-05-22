import { useMemo } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

import type { TaskPriority, TaskStatus } from "@/domain/types/task";
import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useTextStyles } from "@/hooks/useTextStyles";
import { usePreferences } from "@/preferences/PreferencesProvider";
import { priorityColors, statusColors } from "@/theme/material3";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const layout = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "stretch",
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dragging: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dragHandle: { justifyContent: "center", paddingEnd: 12, marginEnd: 4 },
  content: { flex: 1 },
  header: { alignItems: "flex-start", gap: 12 },
  footer: { justifyContent: "space-between", alignItems: "center" },
  searchField: { borderWidth: 1, overflow: "hidden" },
  search: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
  groupLabel: {
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badge: { alignSelf: "flex-start" },
  priorityRow: { alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export function useTaskCardStyles(priority: TaskPriority) {
  const { semantic, typography } = useMaterialTheme();
  const { text, input } = useTextStyles();
  const priorityColor = priorityColors[priority];

  return useMemo(
    () => ({
      priorityColor,
      getPressable: (pressed: boolean, isDragging: boolean): ViewStyle[] => [
        {
          opacity: pressed && !isDragging ? 0.92 : 1,
          marginBottom: 9,
        },
        isDragging ? layout.dragging : {},
      ],
      card: {
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 14,
        overflow: "hidden",
      } as ViewStyle,
      stripe: {
        position: "absolute",
        left: 0,
        top: 10,
        bottom: 10,
        width: 3,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        backgroundColor: priorityColor,
      } as ViewStyle,
      row: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 11,
      } as ViewStyle,
      checkbox: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: semantic.border2,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 1,
      } as ViewStyle,
      checkboxChecked: {
        backgroundColor: semantic.green,
        borderColor: semantic.green,
      } as ViewStyle,
      body: { flex: 1, minWidth: 0 } as ViewStyle,
      title: {
        ...text,
        ...typography.titleMedium,
        color: semantic.textPrimary,
        marginBottom: 3,
      } as TextStyle,
      titleDone: {
        textDecorationLine: "line-through",
        color: semantic.textMuted,
      } as TextStyle,
      description: {
        ...text,
        ...typography.bodyMedium,
        fontSize: 12.5,
        color: semantic.textSecondary,
        marginBottom: 9,
      } as TextStyle,
      meta: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
      } as ViewStyle,
      badge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
      } as ViewStyle,
      priorityBadge: {
        backgroundColor:
          priority === "high"
            ? semantic.redBg
            : priority === "medium"
              ? semantic.amberBg
              : semantic.greenBg,
      } as ViewStyle,
      badgeDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
      } as ViewStyle,
      badgeText: {
        ...typography.labelMedium,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      } as TextStyle,
      date: {
        ...typography.labelMedium,
        marginLeft: "auto",
        color: semantic.textMuted,
      } as TextStyle,
    }),
    [input, priority, priorityColor, semantic, text, typography],
  );
}

export function useFilterSheetStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { text } = useTextStyles();
  const { row } = useLayoutStyles();

  return useMemo(
    () => ({
      section: {
        marginBottom: 18,
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
      chipRow: {
        ...row,
        flexWrap: "wrap",
        gap: 8,
      } as ViewStyle,
      chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: semantic.border2,
        backgroundColor: "transparent",
      } as ViewStyle,
      chipLabel: {
        ...text,
        ...typography.labelLarge,
        fontSize: 13,
        color: semantic.textSecondary,
      } as TextStyle,
      chipLabelSelected: {
        fontFamily: typography.labelLarge.fontFamily,
      } as TextStyle,
      priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 99,
      } as ViewStyle,
      footerBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      footerCancel: {
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
      } as ViewStyle,
      footerApply: {
        backgroundColor: semantic.blue,
      } as ViewStyle,
      footerCancelLabel: {
        ...typography.labelLarge,
        color: semantic.textSecondary,
      } as TextStyle,
      footerApplyLabel: {
        ...typography.labelLarge,
        color: "#fff",
      } as TextStyle,
      footerRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
        marginBottom: 4,
      } as ViewStyle,
    }),
    [semantic, text, typography],
  );
}

export function useTasksSearchBarStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { input } = useTextStyles();

  return useMemo(
    () => ({
      searchWrap: {
        paddingHorizontal: 18,
        overflow: 'hidden',
      } as ViewStyle,
      searchInner: {
        marginBottom: 10,
      } as ViewStyle,
      searchInput: {
        ...typography.bodyMedium,
        ...input,
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 11,
        color: semantic.textPrimary,
        fontSize: 14,
      } as TextStyle,
    }),
    [input, semantic, typography],
  );
}

export function useFilterActiveTagsStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { row } = useLayoutStyles();
  const { isRtl } = usePreferences();
  return useMemo(
    () => ({
      scroll: {
        maxHeight: 50,
      } as ViewStyle,
      bar: {
        alignItems: "center",
        width: "100%",
        justifyContent: isRtl ? "flex-end" : "flex-start",
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 5,
      } as ViewStyle,
      tag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 99,
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border2,
      } as ViewStyle,
      tagLabel: {
        ...typography.labelLarge,
        fontSize: 12,
        color: semantic.textSecondary,
      } as TextStyle,
      priorityDot: {
        width: 7,
        height: 7,
        borderRadius: 99,
      } as ViewStyle,
    }),
    [row, semantic, typography, isRtl],
  );
}

export function useStatusBadgeStyles(status: TaskStatus, compact?: boolean) {
  const { semantic, typography } = useMaterialTheme();
  const { text } = useTextStyles();
  const palette = statusColors[status];

  const bg =
    status === "todo"
      ? semantic.blueBg
      : status === "in_progress"
        ? semantic.amberBg
        : semantic.greenBg;
  const fg = palette.accent ?? semantic.blue;

  return useMemo(
    () => ({
      badge: {
        ...layout.badge,
        backgroundColor: bg,
        borderRadius: 6,
        paddingHorizontal: compact ? 7 : 10,
        paddingVertical: compact ? 3 : 5,
      } as ViewStyle,
      label: {
        ...text,
        ...typography.labelMedium,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: fg,
      } as TextStyle,
    }),
    [bg, compact, fg, text, typography],
  );
}

export function usePriorityIndicatorStyles(
  priority: TaskPriority,
  compact?: boolean,
) {
  const { row } = useLayoutStyles();
  const { typography } = useMaterialTheme();
  const { text } = useTextStyles();
  const color = priorityColors[priority];

  return useMemo(
    () => ({
      row: { ...layout.priorityRow, ...row, gap: 4 },
      dot: { ...layout.dot, backgroundColor: color },
      label: {
        ...text,
        ...typography.labelMedium,
        fontSize: compact ? 10 : 12,
        textTransform: "uppercase",
        color,
      } as TextStyle,
    }),
    [color, compact, row, text, typography],
  );
}

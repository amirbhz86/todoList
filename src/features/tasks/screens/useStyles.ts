import { useMemo } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useTextStyles } from "@/hooks/useTextStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

const layout = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    marginTop: 8,
  },
  headerActions: { alignItems: "center", gap: 8 },
  syncBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: { paddingTop: 4 },
  emptyList: { paddingHorizontal: 16 },
});

export type TaskListScreenStyles = {
  container: ViewStyle;
  headerPadding: ViewStyle;
  headerRow: ViewStyle;
  headerActions: ViewStyle;
  syncBadge: ViewStyle;
  settingsButton: ViewStyle;
  settingsBtn: ViewStyle;
  listContent: ViewStyle;
  sectionHeader: ViewStyle;
  sectionDot: ViewStyle;
  sectionTitle: TextStyle;
  sectionCount: TextStyle;
  emptyList: ViewStyle;
  emptyListPadding: ViewStyle;
  dragHintSpacer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  dragHint: TextStyle;
  syncLabel: TextStyle;
  settingsIconColor: string;
  emptyTitle: TextStyle;
  emptyMessage: TextStyle;
};

export function useTaskListScreenStyles(): TaskListScreenStyles {
  const insets = useSafeAreaInsets();
  const { row } = useLayoutStyles();
  const { semantic, typography, spacing } = useMaterialTheme();
  const { text } = useTextStyles();

  return useMemo(
    () => ({
      container: { ...layout.container, backgroundColor: semantic.bg },
      headerPadding: { paddingHorizontal: spacing.lg },
      headerRow: layout.headerRow,
      headerActions: layout.headerActions,
      syncBadge: layout.syncBadge,
      settingsButton: layout.settingsButton,
      settingsBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: semantic.surface,
        borderWidth: 1,
        borderColor: semantic.border,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      listContent: {
        ...layout.listContent,
        paddingHorizontal: 14,
        paddingBottom: insets.bottom + 120,
        flexGrow: 1,
      },
      emptyList: layout.emptyList,
      emptyListPadding: {
        alignItems: "center",
        paddingVertical: 52,
        paddingHorizontal: 20,
        gap: 10,
      } as ViewStyle,
      dragHintSpacer: { marginBottom: spacing.md },
      sectionHeader: {
        ...row,
        alignItems: "center",
        gap: 8,
        paddingTop: 14,
        paddingBottom: 8,
      } as ViewStyle,
      sectionDot: { width: 7, height: 7, borderRadius: 4 } as ViewStyle,
      sectionTitle: {
        ...typography.titleMedium,
        fontSize: 12.5,
        color: semantic.textSecondary,
      } as TextStyle,
      sectionCount: {
        ...typography.labelMedium,
        color: semantic.textMuted,
        paddingHorizontal: 7,
        paddingVertical: 2,
        backgroundColor: semantic.surface2,
        borderRadius: 99,
        overflow: "hidden",
      } as TextStyle,
      title: {
        ...text,
        ...typography.headlineLarge,
        color: semantic.textPrimary,
      },
      subtitle: {
        ...text,
        ...typography.bodyMedium,
        color: semantic.textSecondary,
        marginBottom: spacing.xs,
      },
      dragHint: {
        ...text,
        ...typography.labelMedium,
        color: semantic.textMuted,
        marginBottom: spacing.md,
      },
      syncLabel: {
        ...text,
        ...typography.labelMedium,
        color: semantic.amber,
      },
      settingsIconColor: semantic.textSecondary,
      emptyTitle: {
        ...text,
        ...typography.titleMedium,
        color: semantic.textMuted,
        textAlign: "center",
      },
      emptyMessage: {
        ...text,
        ...typography.bodyMedium,
        color: semantic.textMuted,
        textAlign: "center",
      },
    }),
    [insets.bottom, semantic, spacing, text, typography],
  );
}

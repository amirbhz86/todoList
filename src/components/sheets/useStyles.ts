import { useMemo } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

import { useLayoutStyles } from "@/hooks/useLayoutStyles";
import { useTextStyles } from "@/hooks/useTextStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

export function useTaskFlowSheetStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { row } = useLayoutStyles();

  return useMemo(
    () => ({
      background: {
        backgroundColor: semantic.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: semantic.border2,
      } as ViewStyle,
      handleWrap: {
        paddingTop: 12,
        paddingBottom: 18,
        alignItems: "center",
      } as ViewStyle,
      handle: {
        width: 36,
        height: 4,
        borderRadius: 99,
        backgroundColor: semantic.surface3,
      } as ViewStyle,
      header: {
        ...row,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 4,
      } as ViewStyle,
      title: {
        ...typography.headlineLarge,
        color: semantic.textPrimary,
        letterSpacing: -0.4,
      } as TextStyle,
      closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      content: {
        paddingHorizontal: 18,
        paddingBottom: 8,
      } as ViewStyle,
      footer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
        paddingHorizontal: 18,
        paddingBottom: 4,
      } as ViewStyle,
      backdrop: {
        backgroundColor: "rgba(0,0,0,0.65)",
      },
    }),
    [semantic, typography],
  );
}

export function useTaskFormSheetStyles() {
  const { semantic, typography } = useMaterialTheme();
  const { text } = useTextStyles();

  return useMemo(
    () => ({
      fieldGroup: {
        marginBottom: 15,
      } as ViewStyle,
      fieldLabel: {
        ...typography.labelMedium,
        ...text,
        fontSize: 10,
        letterSpacing: 1,
        color: semantic.textMuted,
        textTransform: "uppercase",
        marginBottom: 7,
      } as TextStyle,
      textInput: {
        ...typography.bodyLarge,
        fontSize: 15,
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 12,
        paddingHorizontal: 13,
        paddingVertical: 12,
        color: semantic.textPrimary,
      } as TextStyle,
      textArea: {
        minHeight: 75,
        textAlignVertical: "top",
      } as TextStyle,
      statusSeg: {
        flexDirection: "row",
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 12,
        padding: 3,
        gap: 3,
      } as ViewStyle,
      statusSegBtn: {
        flex: 1,
        paddingVertical: 9,
        paddingHorizontal: 4,
        borderRadius: 9,
        alignItems: "center",
      } as ViewStyle,
      statusSegBtnActive: {
        backgroundColor: semantic.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.35,
        shadowRadius: 3,
        elevation: 2,
      } as ViewStyle,
      statusSegLabel: {
        ...typography.labelLarge,
        fontSize: 12.5,
        color: semantic.textSecondary,
        textAlign: "center",
      } as TextStyle,
      statusSegLabelActive: {
        color: semantic.textPrimary,
        fontFamily: typography.labelLarge.fontFamily,
      } as TextStyle,
      prioritySeg: {
        flexDirection: "row",
        gap: 8,
      } as ViewStyle,
      priorityBtn: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: semantic.border,
        alignItems: "center",
      } as ViewStyle,
      priorityBtnLabel: {
        ...typography.labelMedium,
        fontSize: 11,
        letterSpacing: 0.5,
        color: semantic.textSecondary,
        textTransform: "uppercase",
      } as TextStyle,
      footerCancel: {
        flex: 1,
        paddingVertical: 13,
        backgroundColor: semantic.surface2,
        borderWidth: 1,
        borderColor: semantic.border,
        borderRadius: 12,
        alignItems: "center",
      } as ViewStyle,
      footerSave: {
        flex: 2,
        paddingVertical: 13,
        backgroundColor: semantic.blue,
        borderRadius: 12,
        alignItems: "center",
      } as ViewStyle,
      footerCancelLabel: {
        ...typography.bodyLarge,
        fontSize: 15,
        color: semantic.textSecondary,
      } as TextStyle,
      footerSaveLabel: {
        ...typography.bodyLarge,
        fontSize: 15,
        color: "#fff",
        fontFamily: typography.labelLarge.fontFamily,
      } as TextStyle,
      sheetFoot: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18,
        marginBottom: 4,
      } as ViewStyle,
    }),
    [semantic, typography],
  );
}


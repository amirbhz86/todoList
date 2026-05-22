import React from "react";
import { Pressable, Text, View } from "react-native";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import { useTaskFlowSheetStyles } from "@/components/sheets/useStyles";
import { useMaterialTheme } from "@/theme/ThemeProvider";

export function TaskFlowSheetHandle() {
  const styles = useTaskFlowSheetStyles();

  return (
    <View style={styles.handleWrap}>
      <View style={styles.handle} />
    </View>
  );
}

type TaskFlowSheetHeaderProps = {
  title: string;
  onClose: () => void;
};

export function TaskFlowSheetHeader({
  title,
  onClose,
}: TaskFlowSheetHeaderProps) {
  const styles = useTaskFlowSheetStyles();
  const { semantic } = useMaterialTheme();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onPress={onClose}
        style={styles.closeBtn}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <TaskFlowIcon
          name="close"
          size={14}
          color={semantic.textSecondary}
          strokeWidth={2.2}
        />
      </Pressable>
    </View>
  );
}

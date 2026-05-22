import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import {
  TaskFlowBottomSheet,
  type TaskFlowBottomSheetRef,
} from "@/components/sheets/TaskFlowBottomSheet";
import { TaskFlowSheetHeader } from "@/components/sheets/TaskFlowSheetLayout";
import type { TaskPriority, TaskStatus } from "@/domain/types/task";
import { useFilterSheetStyles } from "@/features/tasks/components/useStyles";
import { taskPriorityLabel, taskStatusLabel } from "@/i18n/labels";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTaskFilters } from "@/store/tasks/selectors";
import { tasksActions } from "@/store/tasks/tasksSlice";
import { useMaterialTheme } from "@/theme/ThemeProvider";

type FilterSheetProps = {
  sheetRef: React.RefObject<TaskFlowBottomSheetRef | null>;
};

const STATUS_VALUES: TaskStatus[] = ["todo", "in_progress", "done"];
const PRIORITY_VALUES: TaskPriority[] = ["high", "medium", "low"];

type SheetChipTone =
  | "todo"
  | "in_progress"
  | "done"
  | "high"
  | "medium"
  | "low";

function sheetChipTone(
  kind: "status" | "priority",
  value: TaskStatus | TaskPriority,
): SheetChipTone {
  if (kind === "priority") return value as SheetChipTone;
  return value as SheetChipTone;
}

function FilterSheetChip({
  label,
  selected,
  tone,
  icon,
  dotColor,
  onPress,
}: {
  label: string;
  selected: boolean;
  tone: SheetChipTone;
  icon?: React.ReactNode;
  dotColor?: string;
  onPress: () => void;
}) {
  const styles = useFilterSheetStyles();
  const { semantic } = useMaterialTheme();

  const toneStyles: Record<
    SheetChipTone,
    { bg: string; border: string; text: string }
  > = {
    todo: { bg: semantic.blueBg, border: semantic.blue, text: semantic.blue },
    in_progress: {
      bg: semantic.amberBg,
      border: semantic.amber,
      text: semantic.amber,
    },
    done: {
      bg: semantic.greenBg,
      border: semantic.green,
      text: semantic.green,
    },
    high: { bg: semantic.redBg, border: semantic.red, text: semantic.red },
    medium: {
      bg: semantic.amberBg,
      border: semantic.amber,
      text: semantic.amber,
    },
    low: { bg: semantic.greenBg, border: semantic.green, text: semantic.green },
  };

  const active = selected ? toneStyles[tone] : null;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && {
          backgroundColor: active.bg,
          borderColor: active.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {dotColor ? (
        <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />
      ) : null}
      {icon}
      <Text
        style={[
          styles.chipLabel,
          active && { color: active.text },
          selected && styles.chipLabelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FilterSheet({ sheetRef }: FilterSheetProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectTaskFilters);
  const styles = useFilterSheetStyles();
  const { semantic } = useMaterialTheme();

  const [tmpStatuses, setTmpStatuses] = useState<TaskStatus[]>([]);
  const [tmpPriorities, setTmpPriorities] = useState<TaskPriority[]>([]);

  const syncDraftFromStore = useCallback(() => {
    setTmpStatuses([...filters.statuses]);
    setTmpPriorities([...filters.priorities]);
  }, [filters.priorities, filters.statuses]);

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
  }, [sheetRef]);

  const toggleStatus = (status: TaskStatus) => {
    setTmpStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const togglePriority = (priority: TaskPriority) => {
    setTmpPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority],
    );
  };

  const applyFilters = () => {
    dispatch(
      tasksActions.setFilters({
        statuses: tmpStatuses,
        priorities: tmpPriorities,
      }),
    );
    close();
  };

  const clearAll = () => {
    dispatch(tasksActions.setFilters({ statuses: [], priorities: [] }));
    close();
  };

  return (
    <TaskFlowBottomSheet
      ref={sheetRef}
      enableDynamicSizing
      onChange={(index) => {
        if (index >= 0) syncDraftFromStore();
      }}
    >
      <TaskFlowSheetHeader
        title={t("tasks.filterSheetTitle")}
        onClose={close}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("tasks.filterStatus")}</Text>
        <View style={styles.chipRow}>
          {STATUS_VALUES.map((status) => (
            <FilterSheetChip
              key={status}
              label={taskStatusLabel(t, status)}
              selected={tmpStatuses.includes(status)}
              tone={sheetChipTone("status", status)}
              onPress={() => toggleStatus(status)}
              icon={
                status === "todo" ? (
                  <TaskFlowIcon
                    name="clock"
                    size={12}
                    color={semantic.textSecondary}
                  />
                ) : status === "in_progress" ? (
                  <TaskFlowIcon
                    name="refresh"
                    size={12}
                    color={semantic.textSecondary}
                  />
                ) : (
                  <TaskFlowIcon
                    name="check"
                    size={12}
                    color={semantic.textSecondary}
                  />
                )
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("tasks.filterPriority")}</Text>
        <View style={styles.chipRow}>
          {PRIORITY_VALUES.map((priority) => (
            <FilterSheetChip
              key={priority}
              label={taskPriorityLabel(t, priority)}
              selected={tmpPriorities.includes(priority)}
              tone={sheetChipTone("priority", priority)}
              onPress={() => togglePriority(priority)}
              dotColor={
                priority === "high"
                  ? semantic.red
                  : priority === "medium"
                    ? semantic.amber
                    : semantic.green
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.footerRow}>
        <Pressable
          onPress={clearAll}
          style={[styles.footerBtn, styles.footerCancel]}
          accessibilityRole="button"
        >
          <Text style={styles.footerCancelLabel}>
            {t("tasks.clearAllFilters")}
          </Text>
        </Pressable>
        <Pressable
          onPress={applyFilters}
          style={[styles.footerBtn, styles.footerApply]}
          accessibilityRole="button"
        >
          <Text style={styles.footerApplyLabel}>{t("tasks.applyFilters")}</Text>
        </Pressable>
      </View>
    </TaskFlowBottomSheet>
  );
}

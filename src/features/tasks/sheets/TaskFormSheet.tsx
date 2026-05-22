import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";

import { useSheetKeyboardHeight } from "@/hooks/useSheetKeyboardHeight";

import {
  TaskFlowBottomSheet,
  type TaskFlowBottomSheetRef,
} from "@/components/sheets/TaskFlowBottomSheet";
import { TaskFlowSheetHeader } from "@/components/sheets/TaskFlowSheetLayout";
import { useTaskFormSheetStyles } from "@/components/sheets/useStyles";
import type { TaskDraft, TaskPriority, TaskStatus } from "@/domain/types/task";
import { taskPriorityShortLabel, taskStatusLabel } from "@/i18n/labels";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTaskById } from "@/store/tasks/selectors";
import { tasksActions } from "@/store/tasks/tasksSlice";
import { useMaterialTheme } from "@/theme/ThemeProvider";
import { createTaskId } from "@/utils/id";
import { validateTaskDraft } from "@/utils/taskValidation";

type TaskFormSheetProps = {
  sheetRef: React.RefObject<TaskFlowBottomSheetRef | null>;
  taskId?: string;
  onDismiss?: () => void;
};

const STATUS_VALUES: TaskStatus[] = ["todo", "in_progress", "done"];
const PRIORITY_VALUES: TaskPriority[] = ["high", "medium", "low"];

export function TaskFormSheet({
  sheetRef,
  taskId,
  onDismiss,
}: TaskFormSheetProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useTaskFormSheetStyles();
  const { semantic, typography } = useMaterialTheme();
  const isEdit = Boolean(taskId);
  const existingTask = useAppSelector(
    taskId ? selectTaskById(taskId) : () => undefined,
  );

  const titleRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetOpenRef = useRef(false);

  const formSnapPoints = useMemo(() => [540, "95%"] as const, []);

  useSheetKeyboardHeight(sheetRef, sheetOpen, {
    collapsedIndex: 0,
    expandedIndex: 1,
  });

  const resetForm = useCallback(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description ?? "");
      setStatus(existingTask.status);
      setPriority(existingTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
    }
    setErrors({});
  }, [existingTask]);

  useEffect(() => {
    if (!sheetOpenRef.current) {
      resetForm();
    }
  }, [taskId, resetForm]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        sheetOpenRef.current = false;
        setSheetOpen(false);
        return;
      }

      if (!sheetOpenRef.current) {
        sheetOpenRef.current = true;
        setSheetOpen(true);
        resetForm();
      }
    },
    [resetForm],
  );

  const sheetTitle = isEdit ? t("tasks.editTask") : t("tasks.newTask");
  const saveLabel = isEdit ? t("tasks.saveChanges") : t("tasks.createTask");

  const close = useCallback(() => {
    sheetRef.current?.dismiss();
  }, [sheetRef]);

  const handleSave = () => {
    const draft: Partial<TaskDraft> = { title, description, status, priority };
    const validation = validateTaskDraft(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});

    if (isEdit && taskId) {
      dispatch(
        tasksActions.updateTaskOptimistic({
          id: taskId,
          draft: {
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            priority,
          },
        }),
      );
      close();
      return;
    }

    dispatch(
      tasksActions.createTaskOptimistic({
        id: createTaskId(),
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        sortOrder: 0,
      }),
    );
    close();
  };

  const priorityActiveStyle = useMemo(
    () => ({
      high: { bg: semantic.redBg, border: semantic.red, text: semantic.red },
      medium: {
        bg: semantic.amberBg,
        border: semantic.amber,
        text: semantic.amber,
      },
      low: {
        bg: semantic.greenBg,
        border: semantic.green,
        text: semantic.green,
      },
    }),
    [semantic],
  );

  return (
    <TaskFlowBottomSheet
      ref={sheetRef}
      keyboardAware
      keyboardSnapManaged
      onDismiss={onDismiss}
      onChange={handleSheetChange}
      snapPoints={[...formSnapPoints]}
    >
      <TaskFlowSheetHeader title={sheetTitle} onClose={close} />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t("tasks.fieldTitle")}</Text>
        <TextInput
          ref={titleRef}
          testID="task-form-title-input"
          value={title}
          onChangeText={setTitle}
          placeholder={t("tasks.titlePlaceholder")}
          placeholderTextColor={semantic.textMuted}
          style={[
            styles.textInput,
            errors.title && { borderColor: semantic.red },
          ]}
        />
        {errors.title ? (
          <Text
            style={{
              ...typography.bodyMedium,
              color: semantic.red,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {errors.title}
          </Text>
        ) : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          {t("tasks.fieldDescriptionOptional")}
        </Text>
        <TextInput
          testID="task-form-description-input"
          value={description}
          onChangeText={setDescription}
          placeholder={t("tasks.descriptionPlaceholder")}
          placeholderTextColor={semantic.textMuted}
          multiline
          numberOfLines={3}
          style={[styles.textInput, styles.textArea]}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t("tasks.fieldStatus")}</Text>
        <View style={styles.statusSeg}>
          {STATUS_VALUES.map((value) => {
            const active = status === value;
            return (
              <Pressable
                key={value}
                testID={`task-form-status-${value}`}
                onPress={() => setStatus(value)}
                style={[
                  styles.statusSegBtn,
                  active && styles.statusSegBtnActive,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.statusSegLabel,
                    active && styles.statusSegLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {taskStatusLabel(t, value)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t("tasks.fieldPriority")}</Text>
        <View style={styles.prioritySeg}>
          {PRIORITY_VALUES.map((value) => {
            const active = priority === value;
            const tone = priorityActiveStyle[value];
            return (
              <Pressable
                key={value}
                testID={`task-form-priority-${value}`}
                onPress={() => setPriority(value)}
                style={[
                  styles.priorityBtn,
                  active && {
                    backgroundColor: tone.bg,
                    borderColor: tone.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.priorityBtnLabel,
                    active && {
                      color: tone.text,
                      fontFamily: typography.labelLarge.fontFamily,
                    },
                  ]}
                >
                  {taskPriorityShortLabel(t, value)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sheetFoot}>
        <Pressable
          onPress={close}
          style={styles.footerCancel}
          accessibilityRole="button"
        >
          <Text style={styles.footerCancelLabel}>{t("common.cancel")}</Text>
        </Pressable>
        <Pressable
          testID="task-form-save-button"
          onPress={handleSave}
          style={styles.footerSave}
          accessibilityRole="button"
        >
          <Text style={styles.footerSaveLabel}>{saveLabel}</Text>
        </Pressable>
      </View>
    </TaskFlowBottomSheet>
  );
}

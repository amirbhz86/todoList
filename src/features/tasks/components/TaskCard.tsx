import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import type { Task, TaskStatus } from "@/domain/types/task";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";
import { useTaskCardStyles } from "@/features/tasks/components/useStyles";
import { useTaskSheets } from "@/features/tasks/sheets/TaskSheetsProvider";
import { taskPriorityLabel } from "@/i18n/labels";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskStatus } from "@/store/tasks/tasksSaga";
import { useFormatRelativeDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";

const STATUS_CYCLE: TaskStatus[] = ["todo", "in_progress", "done"];

type TaskCardProps = {
  task: Task;
  index: number;
  drag?: () => void;
  isDragging?: boolean;
};

export function TaskCard({ task, index, drag, isDragging }: TaskCardProps) {
  const { t } = useTranslation();
  const formatRelativeDate = useFormatRelativeDate();
  const { openTaskForm } = useTaskSheets();
  const dispatch = useAppDispatch();
  const styles = useTaskCardStyles(task.priority);
  const done = task.status === "done";

  const cycleStatus = useCallback(() => {
    const currentIndex = STATUS_CYCLE.indexOf(task.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    dispatch(updateTaskStatus(task.id, nextStatus));
  }, [dispatch, task.id, task.status]);

  const content = (
    <Pressable
      testID={`task-card-${task.id}`}
      onPress={() => openTaskForm(task.id)}
      onLongPress={drag}
      delayLongPress={drag ? 120 : undefined}
      style={({ pressed }) => styles.getPressable(pressed, Boolean(isDragging))}
    >
      <View style={styles.card}>
        <View style={styles.stripe} />
        <View style={styles.row}>
          <Pressable
            testID={`task-checkbox-${task.id}`}
            onPress={cycleStatus}
            hitSlop={10}
            style={[styles.checkbox, done && styles.checkboxChecked]}
          >
            {done ? (
              <TaskFlowIcon
                name="check"
                size={11}
                color="#fff"
                strokeWidth={2.5}
              />
            ) : null}
          </Pressable>
          <View style={styles.body}>
            {task.description ? (
              <Text numberOfLines={2} style={styles.description}>
                {task.description}
              </Text>
            ) : null}
            <View style={styles.meta}>
              <View style={[styles.badge, styles.priorityBadge]}>
                <View
                  style={[
                    styles.badgeDot,
                    { backgroundColor: styles.priorityColor },
                  ]}
                />
                <Text
                  style={[styles.badgeText, { color: styles.priorityColor }]}
                >
                  {taskPriorityLabel(t, task.priority)}
                </Text>
              </View>
              <StatusBadge status={task.status} compact />
              <Text style={styles.date}>
                {formatRelativeDate(task.createdAt)}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={[styles.title, done && styles.titleDone]}
            >
              {task.title}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (isDragging) {
    return <View>{content}</View>;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).springify()}
      layout={Layout.springify()}
    >
      {content}
    </Animated.View>
  );
}

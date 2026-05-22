import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform, Pressable, Text, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { TaskFlowIcon } from "@/components/icons/TaskFlowIcon";
import { TaskFlowTopBar } from "@/components/navigation/TaskFlowTopBar";
import { FAB } from "@/components/ui/FAB";
import { StateView } from "@/components/ui/StateView";
import type { Task, TaskStatus } from "@/domain/types/task";
import { FilterActiveTags } from "@/features/tasks/components/FilterActiveTags";
import { TasksSearchBar } from "@/features/tasks/components/TasksSearchBar";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTaskListScreenStyles } from "@/features/tasks/screens/useStyles";
import { useTaskSheets } from "@/features/tasks/sheets/TaskSheetsProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAllTasks,
  selectCanReorderTasks,
  selectFilteredTasks,
  selectTaskFilters,
  selectTasksError,
  selectTasksGroupedByStatus,
  selectTasksLoading,
} from "@/store/tasks/selectors";
import { tasksActions } from "@/store/tasks/tasksSlice";
import { useMaterialTheme } from "@/theme/ThemeProvider";
import { hasSheetFilters } from "@/utils/taskFilters";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

function ListEmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const styles = useTaskListScreenStyles();
  const { semantic } = useMaterialTheme();

  return (
    <View style={styles.emptyListPadding}>
      <TaskFlowIcon
        name="tasks"
        size={44}
        color={semantic.textMuted}
        strokeWidth={1.3}
      />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  count,
  color,
  status,
}: {
  title: string;
  count: number;
  color: string;
  status: TaskStatus;
}) {
  const styles = useTaskListScreenStyles();

  return (
    <View style={styles.sectionHeader} testID={`task-section-${status}`}>
      <View style={[styles.sectionDot, { backgroundColor: color }]} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );
}

export function TaskListScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useTaskListScreenStyles();
  const { semantic } = useMaterialTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const { openFilterSheet, openSettingsSheet, openTaskForm } = useTaskSheets();

  const allTasks = useAppSelector(selectAllTasks);
  const tasks = useAppSelector(selectFilteredTasks);
  const grouped = useAppSelector(selectTasksGroupedByStatus);
  const filters = useAppSelector(selectTaskFilters);
  const canReorder = useAppSelector(selectCanReorderTasks);
  const dragEnabled =
    canReorder && Platform.OS !== "web" && filters.status !== "all";
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  const hasNoTasksAtAll = allTasks.length === 0;
  const showInitialLoading = loading && hasNoTasksAtAll;
  const showInitialError = Boolean(error) && hasNoTasksAtAll && !loading;

  const showGrouped =
    filters.status === "all" &&
    !hasSheetFilters(filters) &&
    filters.search.trim() === "";

  const listData = useMemo(() => {
    if (!showGrouped) {
      return tasks.map((task) => ({
        type: "task" as const,
        task,
        key: task.id,
      }));
    }
    const rows: Array<
      | {
          type: "header";
          key: string;
          status: TaskStatus;
          title: string;
          count: number;
          color: string;
        }
      | { type: "task"; task: Task; key: string }
    > = [];
    const colors: Record<TaskStatus, string> = {
      todo: semantic.blue,
      in_progress: semantic.amber,
      done: semantic.green,
    };
    STATUS_ORDER.forEach((status) => {
      const items = grouped[status];
      if (!items.length) return;
      rows.push({
        type: "header",
        key: `hdr-${status}`,
        status,
        title: t(`taskStatus.${status}`),
        count: items.length,
        color: colors[status],
      });
      items.forEach((task) => rows.push({ type: "task", task, key: task.id }));
    });
    return rows;
  }, [grouped, semantic, showGrouped, t, tasks]);

  const emptyTitle = hasNoTasksAtAll
    ? t("state.noTasksYet")
    : t("state.noMatchingTasks");
  const emptyMessage = hasNoTasksAtAll
    ? t("state.noTasksYetMessage")
    : t("state.noMatchingTasksMessage");

  const loadTasks = useCallback(() => {
    dispatch(tasksActions.fetchTasksRequest());
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDragEnd = useCallback(
    ({ data }: { data: Task[] }) => {
      dispatch(tasksActions.reorderTasks(data.map((task) => task.id)));
    },
    [dispatch],
  );

  const renderRow = useCallback(
    (task: Task, index: number, drag?: () => void, isActive?: boolean) => (
      <TaskCard task={task} index={index} drag={drag} isDragging={isActive} />
    ),
    [],
  );

  const listHeader = (
    <>
      <TaskFlowTopBar
        title={t("app.name")}
        titleAccent={t("app.nameAccent")}
        onSearchPress={() => setSearchOpen((open) => !open)}
        onFilterPress={openFilterSheet}
        searchActive={searchOpen}
        filterActive={hasSheetFilters(filters)}
        searchTestID="tasks-search-toggle"
        filterTestID="tasks-filter-toggle"
        rightSlot={
          <Pressable
            testID="tasks-settings-button"
            onPress={openSettingsSheet}
            accessibilityRole="button"
            accessibilityLabel={t("common.settings")}
            style={styles.settingsBtn}
          >
            <TaskFlowIcon
              name="settings"
              size={15}
              color={semantic.textSecondary}
            />
          </Pressable>
        }
      />
      <TasksSearchBar searchOpen={searchOpen} />
      <FilterActiveTags />
    </>
  );

  if (showInitialLoading) {
    return (
      <View style={styles.container}>
        {listHeader}
        <StateView loading />
      </View>
    );
  }

  if (showInitialError) {
    return (
      <View style={styles.container}>
        {listHeader}
        <StateView error={error} onRetry={loadTasks} />
      </View>
    );
  }

  if (dragEnabled && !showGrouped) {
    return (
      <View style={styles.container}>
        {listHeader}
        <DraggableFlatList
          testID="tasks-list"
          data={tasks}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          activationDistance={12}
          renderItem={({ item, drag, isActive, getIndex }) =>
            renderRow(item, getIndex?.() ?? 0, drag, isActive)
          }
          ListEmptyComponent={
            <ListEmptyState title={emptyTitle} message={emptyMessage} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <FAB onPress={() => openTaskForm()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {listHeader}
      <FlatList
        testID="tasks-list"
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          if (item.type === "header") {
            return (
              <SectionHeader
                title={item.title}
                count={item.count}
                color={item.color}
                status={item.status}
              />
            );
          }
          return renderRow(item.task, index);
        }}
        ListEmptyComponent={
          <ListEmptyState title={emptyTitle} message={emptyMessage} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={14}
      />
      <FAB onPress={() => openTaskForm()} />
    </View>
  );
}

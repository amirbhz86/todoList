import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { TaskFlowTopBar } from "@/components/navigation/TaskFlowTopBar";
import { StateView } from "@/components/ui/StateView";
import type { TaskStatus } from "@/domain/types/task";
import {
  BoardDragGhost,
  BoardDraggableCard,
} from "@/features/board/components/BoardDraggableCard";
import { useBoardDragAndDrop } from "@/features/board/hooks/useBoardDragAndDrop";
import { useBoardScreenStyles } from "@/features/board/screens/useStyles";
import { useTaskSheets } from "@/features/tasks/sheets/TaskSheetsProvider";
import { usePreferences } from "@/preferences/PreferencesProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectBoardTasks,
  selectTaskFilters,
  selectTasksError,
  selectTasksLoading,
} from "@/store/tasks/selectors";
import { tasksActions } from "@/store/tasks/tasksSlice";
import { useMaterialTheme } from "@/theme/ThemeProvider";
import { hasSheetFilters } from "@/utils/taskFilters";

const COLUMNS: {
  status: TaskStatus;
  labelKey: string;
  colorKey: "blue" | "amber" | "green";
}[] = [
  { status: "todo", labelKey: "taskStatus.todo", colorKey: "blue" },
  {
    status: "in_progress",
    labelKey: "taskStatus.in_progress",
    colorKey: "amber",
  },
  { status: "done", labelKey: "taskStatus.done", colorKey: "green" },
];

export function BoardScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const styles = useBoardScreenStyles();
  const { semantic } = useMaterialTheme();
  const { isRtl } = usePreferences();

  const { openFilterSheet, openTaskForm } = useTaskSheets();

  const tasks = useAppSelector(selectBoardTasks);
  const filters = useAppSelector(selectTaskFilters);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  const dragEnabled = Platform.OS !== "web";

  const handleStatusChange = useCallback(
    (taskId: string, status: TaskStatus) => {
      const task = tasks.find((item) => item.id === taskId);
      if (!task || task.status === status) return;

      const targetColumn = tasks.filter((item) => item.status === status);
      const maxSort = targetColumn.reduce(
        (max, item) => Math.max(max, item.sortOrder),
        -1,
      );

      dispatch(
        tasksActions.updateTaskOptimistic({
          id: taskId,
          draft: { status, sortOrder: maxSort + 1 },
        }),
      );
    },
    [dispatch, tasks],
  );

  const {
    draggingTask,
    dragPosition,
    dropTarget,
    horizontalScrollRef,
    setColumnRef,
    measureColumns,
    startDrag,
    moveDrag,
    endDrag,
    onHorizontalScroll,
    onHorizontalScrollViewLayout,
    onColumnsContentSizeChange,
  } = useBoardDragAndDrop(handleStatusChange);

  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      label: t(col.labelKey),
      color: semantic[col.colorKey],
      items: tasks.filter((task) => task.status === col.status),
    }));
  }, [tasks, semantic, t]);

  const loadTasks = useCallback(() => {
    dispatch(tasksActions.fetchTasksRequest());
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const topBar = (
    <TaskFlowTopBar
      accentColor={semantic.purple}
      title={t("board.title")}
      titleAccent={t("board.titleAccent")}
      onFilterPress={openFilterSheet}
      filterActive={hasSheetFilters(filters)}
      filterTestID="board-filter-toggle"
    />
  );

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        {topBar}
        <StateView loading />
      </View>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <View style={styles.container}>
        {topBar}
        <StateView error={error} onRetry={loadTasks} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {topBar}
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContent}
        decelerationRate="fast"
        snapToInterval={draggingTask ? undefined : styles.columnWidth + 12}
        scrollEventThrottle={16}
        scrollEnabled={!draggingTask}
        onScroll={onHorizontalScroll}
        onLayout={onHorizontalScrollViewLayout}
        onContentSizeChange={onColumnsContentSizeChange}
        onScrollEndDrag={measureColumns}
        onMomentumScrollEnd={measureColumns}
      >
        {columns.map((col, colIndex) => (
          <View
            key={col.status}
            ref={setColumnRef(col.status)}
            onLayout={measureColumns}
            style={[
              styles.column,
              { width: styles.columnWidth },
              dropTarget === col.status && styles.columnDropTarget,
            ]}
          >
            <View style={styles.columnHeader}>
              <View
                style={[styles.columnDot, { backgroundColor: col.color }]}
              />
              <Text style={styles.columnTitle}>{col.label}</Text>
              <Text style={styles.columnCount}>{col.items.length}</Text>
            </View>
            <ScrollView
              style={styles.columnScroll}
              contentContainerStyle={styles.columnCards}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!draggingTask}
            >
              {col.items.length === 0 ? (
                <Text style={styles.columnEmpty}>{t("board.emptyColumn")}</Text>
              ) : (
                col.items.map((task, index) => (
                  <Animated.View
                    key={task.id}
                    entering={FadeInDown.delay(
                      colIndex * 40 + index * 30,
                    ).springify()}
                  >
                    <BoardDraggableCard
                      task={task}
                      dragEnabled={dragEnabled}
                      isDragging={draggingTask?.id === task.id}
                      onPress={() => openTaskForm(task.id)}
                      onDragStart={startDrag}
                      onDragMove={moveDrag}
                      onDragEnd={endDrag}
                      styles={styles}
                    />
                  </Animated.View>
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {draggingTask ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <BoardDragGhost
            task={draggingTask}
            x={dragPosition.x}
            y={dragPosition.y}
            width={styles.columnWidth}
            styles={styles}
          />
        </View>
      ) : null}
    </View>
  );
}

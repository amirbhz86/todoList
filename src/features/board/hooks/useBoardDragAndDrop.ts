import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  I18nManager,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  type View,
} from "react-native";

import type { Task, TaskStatus } from "@/domain/types/task";

export type ColumnRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const COLUMN_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

const EDGE_THRESHOLD = 52;
const COLUMN_EDGE_INSET = 36;
const SCROLL_STEP = 12;
const AUTO_SCROLL_MS = 16;

function findColumnAt(
  rects: Partial<Record<TaskStatus, ColumnRect>>,
  x: number,
  y: number,
): TaskStatus | null {
  for (const status of COLUMN_STATUSES) {
    const rect = rects[status];
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    ) {
      return status;
    }
  }
  return null;
}

export function getAutoScrollDirection(
  rects: Partial<Record<TaskStatus, ColumnRect>>,
  x: number,
  windowWidth = Dimensions.get("window").width,
): -1 | 0 | 1 {
  let direction: -1 | 0 | 1 = 0;

  if (x < EDGE_THRESHOLD) {
    direction = -1;
  } else if (x > windowWidth - EDGE_THRESHOLD) {
    direction = 1;
  }

  const measured = COLUMN_STATUSES.map((status) => rects[status]).filter(
    (rect): rect is ColumnRect => rect != null,
  );
  if (measured.length === 0) {
    return direction;
  }

  const minX = Math.min(...measured.map((rect) => rect.x));
  const maxX = Math.max(...measured.map((rect) => rect.x + rect.width));

  if (x < minX + COLUMN_EDGE_INSET) {
    return -1;
  }
  if (x > maxX - COLUMN_EDGE_INSET) {
    return 1;
  }

  return direction;
}

export function useBoardDragAndDrop(
  onStatusChange: (taskId: string, status: TaskStatus) => void,
) {
  const columnRects = useRef<Partial<Record<TaskStatus, ColumnRect>>>({});
  const columnRefs = useRef<Partial<Record<TaskStatus, View | null>>>({});
  const horizontalScrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const contentWidthRef = useRef(0);
  const viewportWidthRef = useRef(Dimensions.get("window").width);
  const maxScrollRef = useRef(0);
  const scrollDirectionRef = useRef<-1 | 0 | 1>(0);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const draggingTaskRef = useRef<Task | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  useEffect(() => {
    draggingTaskRef.current = draggingTask;
  }, [draggingTask]);

  const measureColumns = useCallback(() => {
    COLUMN_STATUSES.forEach((status) => {
      columnRefs.current[status]?.measureInWindow((x, y, width, height) => {
        columnRects.current[status] = { x, y, width, height };
      });
    });
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
    scrollDirectionRef.current = 0;
  }, []);

  const applyScrollStep = useCallback(() => {
    const direction = scrollDirectionRef.current;
    if (direction === 0 || !horizontalScrollRef.current) {
      return;
    }

    const rtlSign = I18nManager.isRTL ? -1 : 1;
    const max = maxScrollRef.current;
    const next = Math.max(
      0,
      Math.min(
        max,
        scrollOffsetRef.current + direction * SCROLL_STEP * rtlSign,
      ),
    );

    if (next === scrollOffsetRef.current) {
      return;
    }

    scrollOffsetRef.current = next;
    horizontalScrollRef.current.scrollTo({ x: next, animated: false });
    measureColumns();

    const { x, y } = lastPointerRef.current;
    setDropTarget(findColumnAt(columnRects.current, x, y));
  }, [measureColumns]);

  const syncAutoScroll = useCallback(
    (x: number, y: number) => {
      lastPointerRef.current = { x, y };
      const direction = getAutoScrollDirection(columnRects.current, x);
      scrollDirectionRef.current = direction;

      if (direction === 0) {
        stopAutoScroll();
        return;
      }

      if (!autoScrollTimerRef.current) {
        autoScrollTimerRef.current = setInterval(
          applyScrollStep,
          AUTO_SCROLL_MS,
        );
      }
    },
    [applyScrollStep, stopAutoScroll],
  );

  const setColumnRef = useCallback(
    (status: TaskStatus) => (ref: View | null) => {
      columnRefs.current[status] = ref;
    },
    [],
  );

  const onHorizontalScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
    },
    [],
  );

  const updateMaxScroll = useCallback(() => {
    maxScrollRef.current = Math.max(
      0,
      contentWidthRef.current - viewportWidthRef.current,
    );
  }, []);

  const onHorizontalScrollViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      viewportWidthRef.current = event.nativeEvent.layout.width;
      updateMaxScroll();
    },
    [updateMaxScroll],
  );

  const onColumnsContentSizeChange = useCallback(
    (contentWidth: number) => {
      contentWidthRef.current = contentWidth;
      updateMaxScroll();
    },
    [updateMaxScroll],
  );

  const scrollToFirstColumn = useCallback(
    (animated = false) => {
      const scroll = horizontalScrollRef.current;
      if (!scroll) {
        return;
      }

      const offset = I18nManager.isRTL ? maxScrollRef.current : 0;
      scrollOffsetRef.current = offset;
      scroll.scrollTo({ x: offset, animated });
      requestAnimationFrame(measureColumns);
    },
    [measureColumns],
  );

  const startDrag = useCallback(
    (task: Task, x: number, y: number) => {
      measureColumns();
      setDraggingTask(task);
      setDragPosition({ x, y });
      setDropTarget(task.status);
      lastPointerRef.current = { x, y };
    },
    [measureColumns],
  );

  const moveDrag = useCallback(
    (x: number, y: number) => {
      setDragPosition({ x, y });
      setDropTarget(findColumnAt(columnRects.current, x, y));
      syncAutoScroll(x, y);
    },
    [syncAutoScroll],
  );

  const endDrag = useCallback(
    (x: number, y: number) => {
      stopAutoScroll();
      const task = draggingTaskRef.current;
      measureColumns();
      const target = findColumnAt(columnRects.current, x, y);
      if (task && target && target !== task.status) {
        onStatusChange(task.id, target);
      }
      setDraggingTask(null);
      setDropTarget(null);
    },
    [measureColumns, onStatusChange, stopAutoScroll],
  );

  const cancelDrag = useCallback(() => {
    stopAutoScroll();
    setDraggingTask(null);
    setDropTarget(null);
  }, [stopAutoScroll]);

  useEffect(() => () => stopAutoScroll(), [stopAutoScroll]);

  return {
    draggingTask,
    dragPosition,
    dropTarget,
    horizontalScrollRef,
    setColumnRef,
    measureColumns,
    startDrag,
    moveDrag,
    endDrag,
    cancelDrag,
    onHorizontalScroll,
    onHorizontalScrollViewLayout,
    onColumnsContentSizeChange,
  };
}

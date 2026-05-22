import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Task, TaskDraft, TaskFilters } from '@/domain/types/task';
import { DEFAULT_TASK_FILTERS } from '@/domain/types/task';
import { createTaskId, createTimestamp } from '@/utils/id';

export type TasksState = {
  items: Task[];
  filters: TaskFilters;
  loading: boolean;
  syncing: boolean;
  error: string | null;
  pendingSyncCount: number;
  optimisticRollback: Task[] | null;
};

const initialState: TasksState = {
  items: [],
  filters: DEFAULT_TASK_FILTERS,
  loading: true,
  syncing: false,
  error: null,
  pendingSyncCount: 0,
  optimisticRollback: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    createTaskOptimistic(state, action: PayloadAction<TaskDraft>) {
      const draft = action.payload;
      const optimisticTask: Task = {
        id: draft.id ?? createTaskId(),
        title: draft.title,
        description: draft.description,
        status: draft.status,
        priority: draft.priority,
        sortOrder: 0,
        createdAt: draft.createdAt ?? createTimestamp(),
      };
      state.optimisticRollback = state.items;
      state.items = [
        optimisticTask,
        ...state.items.map((task) => ({ ...task, sortOrder: task.sortOrder + 1 })),
      ];
      state.error = null;
    },
    updateTaskOptimistic(state, action: PayloadAction<{ id: string; draft: Partial<TaskDraft> }>) {
      const { id, draft } = action.payload;
      state.optimisticRollback = state.items;
      state.items = state.items.map((task) =>
        task.id === id
          ? {
              ...task,
              ...draft,
              title: draft.title?.trim() ?? task.title,
              description:
                draft.description !== undefined
                  ? draft.description.trim() || undefined
                  : task.description,
            }
          : task,
      );
      state.error = null;
    },
    deleteTaskOptimistic(state, action: PayloadAction<string>) {
      state.optimisticRollback = state.items;
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.error = null;
    },
    rollbackOptimistic(state) {
      if (state.optimisticRollback) {
        state.items = state.optimisticRollback;
        state.optimisticRollback = null;
      }
    },
    confirmOptimistic(state) {
      state.optimisticRollback = null;
    },
    persistTaskSuccess(state, action: PayloadAction<Task>) {
      const task = action.payload;
      const index = state.items.findIndex((t) => t.id === task.id);
      if (index >= 0) {
        state.items[index] = task;
      } else {
        state.items = [task, ...state.items];
      }
      state.optimisticRollback = null;
    },
    removeTaskSuccess(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.optimisticRollback = null;
    },
    setPendingSyncCount(state, action: PayloadAction<number>) {
      state.pendingSyncCount = action.payload;
    },
    syncRequest(state) {
      state.syncing = true;
    },
    syncSuccess(state, action: PayloadAction<number>) {
      state.syncing = false;
      state.pendingSyncCount = action.payload;
    },
    syncFailure(state, action: PayloadAction<string>) {
      state.syncing = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    reorderTasks(state, action: PayloadAction<string[]>) {
      const byId = new Map(state.items.map((task) => [task.id, task]));
      state.items = action.payload.map((id, index) => ({
        ...byId.get(id)!,
        sortOrder: index,
      }));
      state.error = null;
    },
    reorderTasksFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const tasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

import { createSelector } from '@reduxjs/toolkit';

import type { Task, TaskStatus } from '@/domain/types/task';
import type { RootState } from '@/store';
import { filterTasks, isDefaultTaskFilters, sortTasksBySortOrder } from '@/utils/taskFilters';

const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = createSelector(selectTasksState, (s) => s.items);

export const selectTaskFilters = createSelector(selectTasksState, (s) => s.filters);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => sortTasksBySortOrder(filterTasks(tasks, filters)),
);

export const selectCanReorderTasks = createSelector(selectTaskFilters, (filters) =>
  isDefaultTaskFilters(filters),
);

export const selectTasksLoading = createSelector(selectTasksState, (s) => s.loading);

export const selectTasksError = createSelector(selectTasksState, (s) => s.error);

export const selectTasksSyncing = createSelector(selectTasksState, (s) => s.syncing);

export const selectPendingSyncCount = createSelector(
  selectTasksState,
  (s) => s.pendingSyncCount,
);

export const selectTaskById = (id: string) =>
  createSelector(selectAllTasks, (tasks) => tasks.find((t) => t.id === id));

export const selectTaskStatusCounts = createSelector(selectAllTasks, (tasks) => {
  const counts: Record<TaskStatus | 'all', number> = {
    all: tasks.length,
    todo: 0,
    in_progress: 0,
    done: 0,
  };
  tasks.forEach((t) => {
    counts[t.status] += 1;
  });
  return counts;
});

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const in_progress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const high = tasks.filter((t) => t.priority === 'high').length;
  const medium = tasks.filter((t) => t.priority === 'medium').length;
  const low = tasks.filter((t) => t.priority === 'low').length;
  const denom = total || 1;

  return {
    total,
    todo,
    in_progress,
    done,
    high,
    medium,
    low,
    pct: {
      todo: Math.round((todo / denom) * 100),
      in_progress: Math.round((in_progress / denom) * 100),
      done: Math.round((done / denom) * 100),
      high: Math.round((high / denom) * 100),
      medium: Math.round((medium / denom) * 100),
      low: Math.round((low / denom) * 100),
    },
  };
});

export const selectBoardTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => {
    const filtered = filterTasks(tasks, {
      ...filters,
      status: 'all',
    });
    return sortTasksBySortOrder(filtered);
  },
);

export const selectTasksGroupedByStatus = createSelector(selectFilteredTasks, (tasks) => {
  const groups: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  tasks.forEach((t) => {
    groups[t.status].push(t);
  });
  return groups;
});

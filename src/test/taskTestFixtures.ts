import type { Task, TaskFilters, TaskStatus } from '@/domain/types/task';
import { DEFAULT_TASK_FILTERS } from '@/domain/types/task';
import type { TasksState } from '@/store/tasks/tasksSlice';

export function makeTask(overrides: Partial<Task> & Pick<Task, 'id' | 'title'>): Task {
  return {
    status: 'todo',
    priority: 'medium',
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const THREE_STATUS_TASKS: Task[] = [
  makeTask({
    id: 'task-todo',
    title: 'TASK_TODO',
    status: 'todo',
    priority: 'high',
    sortOrder: 0,
  }),
  makeTask({
    id: 'task-progress',
    title: 'TASK_IN_PROGRESS',
    status: 'in_progress',
    sortOrder: 1,
  }),
  makeTask({
    id: 'task-done',
    title: 'TASK_DONE',
    status: 'done',
    priority: 'low',
    sortOrder: 2,
  }),
];

export function createTasksState(
  items: Task[],
  filters: TaskFilters = DEFAULT_TASK_FILTERS,
  overrides: Partial<TasksState> = {},
): { tasks: TasksState } {
  return {
    tasks: {
      items,
      filters,
      loading: false,
      syncing: false,
      error: null,
      pendingSyncCount: 0,
      optimisticRollback: null,
      ...overrides,
    },
  };
}

export const STATUS_LABELS_EN: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

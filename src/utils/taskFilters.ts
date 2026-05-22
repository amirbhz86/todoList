import type { Task, TaskFilters } from '@/domain/types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
      return false;
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }
    if (!search) {
      return true;
    }

    const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase();
    return haystack.includes(search);
  });
}

export function sortTasksBySortOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function sortTasksByCreatedAt(tasks: Task[], order: 'asc' | 'desc' = 'desc'): Task[] {
  return [...tasks].sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return order === 'asc' ? diff : -diff;
  });
}

export function hasSheetFilters(filters: TaskFilters): boolean {
  return filters.statuses.length > 0 || filters.priorities.length > 0;
}

export function isDefaultTaskFilters(filters: TaskFilters): boolean {
  return (
    filters.search.trim() === '' &&
    filters.status === 'all' &&
    filters.statuses.length === 0 &&
    filters.priorities.length === 0
  );
}

export function getTaskCountsByStatus(tasks: Task[]): Record<Task['status'] | 'all', number> {
  return {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };
}

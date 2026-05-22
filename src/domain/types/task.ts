export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  sortOrder: number;
  createdAt: string;
};

export type TaskDraft = Omit<Task, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: string;
};

export type TaskFilterStatus = TaskStatus | 'all';

export type TaskFilters = {
  search: string;
  /** Status tab chips on the Tasks list (separate from sheet filters). */
  status: TaskFilterStatus;
  /** Multi-select status filters from the filter sheet. */
  statuses: TaskStatus[];
  /** Multi-select priority filters from the filter sheet. */
  priorities: TaskPriority[];
};

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: '',
  status: 'all',
  statuses: [],
  priorities: [],
};

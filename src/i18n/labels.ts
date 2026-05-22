import type { TFunction } from 'i18next';

import type { TaskFilterStatus, TaskPriority, TaskStatus } from '@/domain/types/task';

export function taskStatusLabel(t: TFunction, status: TaskStatus): string {
  return t(`taskStatus.${status}`);
}

export function taskPriorityLabel(t: TFunction, priority: TaskPriority): string {
  return t(`taskPriority.${priority}`);
}

/** Compact label for priority segment controls (e.g. task form sheet). */
export function taskPriorityShortLabel(t: TFunction, priority: TaskPriority): string {
  return t(`taskPriority.short.${priority}`);
}

export function taskFilterStatusLabel(t: TFunction, status: TaskFilterStatus): string {
  if (status === 'all') return t('common.all');
  if (status === 'in_progress') return t('taskStatus.active');
  return t(`taskStatus.${status}`);
}


import type { Task, TaskDraft } from '@/domain/types/task';
import { createTaskId, createTimestamp } from '@/utils/id';

import { getDatabase } from './client';

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: Task['status'];
  priority: Task['priority'];
  sort_order: number;
  created_at: string;
  updated_at: string;
  synced_at: string | null;
};

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function fetchAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tasks ORDER BY sort_order ASC, datetime(created_at) DESC',
  );
  return rows.map(rowToTask);
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<TaskRow>('SELECT * FROM tasks WHERE id = ?', [id]);
  return row ? rowToTask(row) : null;
}

export async function insertTask(draft: TaskDraft, id?: string): Promise<Task> {
  const db = await getDatabase();
  const taskId = id ?? draft.id ?? createTaskId();
  const now = createTimestamp();
  const createdAt = draft.createdAt ?? now;

  const task: Task = {
    id: taskId,
    title: draft.title.trim(),
    description: draft.description?.trim() || undefined,
    status: draft.status,
    priority: draft.priority,
    sortOrder: 0,
    createdAt,
  };

  await db.withTransactionAsync(async () => {
    await db.runAsync('UPDATE tasks SET sort_order = sort_order + 1');
    await db.runAsync(
      `INSERT INTO tasks (id, title, description, status, priority, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description ?? null,
        task.status,
        task.priority,
        task.sortOrder,
        task.createdAt,
        now,
      ],
    );
  });

  return task;
}

export async function updateTask(id: string, draft: Partial<TaskDraft>): Promise<Task> {
  const db = await getDatabase();
  const existing = await fetchTaskById(id);
  if (!existing) {
    throw new Error(`Task ${id} not found`);
  }

  const updated: Task = {
    ...existing,
    title: draft.title?.trim() ?? existing.title,
    description:
      draft.description !== undefined
        ? draft.description.trim() || undefined
        : existing.description,
    status: draft.status ?? existing.status,
    priority: draft.priority ?? existing.priority,
  };

  const now = createTimestamp();

  await db.runAsync(
    `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = ?
     WHERE id = ?`,
    [
      updated.title,
      updated.description ?? null,
      updated.status,
      updated.priority,
      now,
      id,
    ],
  );

  return updated;
}

export async function reorderTasks(orderedIds: string[]): Promise<Task[]> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (let index = 0; index < orderedIds.length; index += 1) {
      await db.runAsync('UPDATE tasks SET sort_order = ? WHERE id = ?', [index, orderedIds[index]]);
    }
  });

  return fetchAllTasks();
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
}

export async function markTaskSynced(id: string): Promise<void> {
  const db = await getDatabase();
  const now = createTimestamp();
  await db.runAsync('UPDATE tasks SET synced_at = ? WHERE id = ?', [now, id]);
}

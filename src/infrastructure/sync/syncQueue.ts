import { getDatabase } from '@/infrastructure/database/client';
import { createTaskId, createTimestamp } from '@/utils/id';

export type SyncOperation = 'create' | 'update' | 'delete';

export type SyncQueueItem = {
  id: string;
  entityId: string;
  operation: SyncOperation;
  payload: string;
  createdAt: string;
  retryCount: number;
};

type SyncQueueRow = {
  id: string;
  entity_id: string;
  operation: SyncOperation;
  payload: string;
  created_at: string;
  retry_count: number;
};

function rowToItem(row: SyncQueueRow): SyncQueueItem {
  return {
    id: row.id,
    entityId: row.entity_id,
    operation: row.operation,
    payload: row.payload,
    createdAt: row.created_at,
    retryCount: row.retry_count,
  };
}

export async function enqueueSync(
  entityId: string,
  operation: SyncOperation,
  payload: Record<string, unknown>,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sync_queue (id, entity_id, operation, payload, created_at, retry_count)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [createTaskId(), entityId, operation, JSON.stringify(payload), createTimestamp()],
  );
}

export async function fetchPendingSyncItems(): Promise<SyncQueueItem[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<SyncQueueRow>(
    'SELECT * FROM sync_queue ORDER BY datetime(created_at) ASC',
  );
  return rows.map(rowToItem);
}

export async function removeSyncItem(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
}

export async function incrementSyncRetry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?',
    [id],
  );
}

export async function getPendingSyncCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sync_queue',
  );
  return result?.count ?? 0;
}

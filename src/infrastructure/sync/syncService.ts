import { markTaskSynced } from '@/infrastructure/database/taskRepository';

import {
  fetchPendingSyncItems,
  incrementSyncRetry,
  removeSyncItem,
  type SyncQueueItem,
} from './syncQueue';

const MAX_RETRIES = 5;
const SIMULATED_LATENCY_MS = 400;

/** Simulates a remote API — replace with real HTTP client in production. */
async function pushToRemote(item: SyncQueueItem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  if (item.retryCount >= MAX_RETRIES) {
    throw new Error('Max retries exceeded');
  }

  // Simulate occasional network failure for demo resilience
  const payload = JSON.parse(item.payload) as { simulateFailure?: boolean };
  if (payload.simulateFailure) {
    throw new Error('Simulated network error');
  }
}

export async function processSyncQueue(): Promise<{ synced: number; failed: number }> {
  const items = await fetchPendingSyncItems();
  let synced = 0;
  let failed = 0;

  for (const item of items) {
    try {
      await pushToRemote(item);
      await markTaskSynced(item.entityId);
      await removeSyncItem(item.id);
      synced += 1;
    } catch {
      await incrementSyncRetry(item.id);
      failed += 1;
    }
  }

  return { synced, failed };
}

export function isOnline(): boolean {
  // In a production app, use @react-native-community/netinfo.
  // Default to online so local writes sync when the mock API is available.
  return true;
}

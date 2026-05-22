import * as taskRepo from '@/infrastructure/database/taskRepository';
import {
  fetchPendingSyncItems,
  incrementSyncRetry,
  removeSyncItem,
  type SyncQueueItem,
} from '@/infrastructure/sync/syncQueue';
import { processSyncQueue } from '@/infrastructure/sync/syncService';

jest.mock('@/infrastructure/sync/syncQueue');
jest.mock('@/infrastructure/database/taskRepository');

const mockFetch = jest.mocked(fetchPendingSyncItems);
const mockRemove = jest.mocked(removeSyncItem);
const mockIncrement = jest.mocked(incrementSyncRetry);
const mockMarkSynced = jest.mocked(taskRepo.markTaskSynced);

function queueItem(overrides: Partial<SyncQueueItem> = {}): SyncQueueItem {
  return {
    id: 'sync-1',
    entityId: 'task-1',
    operation: 'update',
    payload: JSON.stringify({ id: 'task-1' }),
    createdAt: '2024-01-01T00:00:00.000Z',
    retryCount: 0,
    ...overrides,
  };
}

describe('processSyncQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('syncs pending items and removes them from the queue', async () => {
    mockFetch.mockResolvedValue([queueItem()]);

    const promise = processSyncQueue();
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ synced: 1, failed: 0 });
    expect(mockMarkSynced).toHaveBeenCalledWith('task-1');
    expect(mockRemove).toHaveBeenCalledWith('sync-1');
    expect(mockIncrement).not.toHaveBeenCalled();
  });

  it('increments retry when remote push fails', async () => {
    mockFetch.mockResolvedValue([
      queueItem({ payload: JSON.stringify({ simulateFailure: true }) }),
    ]);

    const promise = processSyncQueue();
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ synced: 0, failed: 1 });
    expect(mockIncrement).toHaveBeenCalledWith('sync-1');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('processes multiple items independently', async () => {
    mockFetch.mockResolvedValue([
      queueItem({ id: 'sync-a', entityId: 'a' }),
      queueItem({
        id: 'sync-b',
        entityId: 'b',
        payload: JSON.stringify({ simulateFailure: true }),
      }),
    ]);

    const promise = processSyncQueue();
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ synced: 1, failed: 1 });
  });
});

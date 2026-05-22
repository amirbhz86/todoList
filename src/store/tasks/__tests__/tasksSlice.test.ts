import type { Task } from '@/domain/types/task';
import { DEFAULT_TASK_FILTERS } from '@/domain/types/task';
import { makeTask } from '@/test/taskTestFixtures';
import { tasksActions, tasksReducer, type TasksState } from '@/store/tasks/tasksSlice';

const SEED: Task[] = [
  makeTask({ id: 'a', title: 'Alpha', sortOrder: 0 }),
  makeTask({ id: 'b', title: 'Beta', sortOrder: 1, status: 'done' }),
];

function reduce(state: TasksState | undefined, action: Parameters<typeof tasksReducer>[1]) {
  return tasksReducer(state, action);
}

const initial = (): TasksState => ({
  items: [],
  filters: DEFAULT_TASK_FILTERS,
  loading: true,
  syncing: false,
  error: null,
  pendingSyncCount: 0,
  optimisticRollback: null,
});

describe('tasksSlice', () => {
  it('fetchTasksRequest sets loading and clears error', () => {
    const state = reduce(
      { ...initial(), error: 'oops', loading: false },
      tasksActions.fetchTasksRequest(),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchTasksSuccess stores items and clears loading', () => {
    const state = reduce(
      { ...initial(), loading: true },
      tasksActions.fetchTasksSuccess(SEED),
    );
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(SEED);
  });

  it('setFilters merges partial filters', () => {
    const state = reduce(initial(), tasksActions.setFilters({ status: 'done', search: 'x' }));
    expect(state.filters.status).toBe('done');
    expect(state.filters.search).toBe('x');
    expect(state.filters.statuses).toEqual([]);
  });

  it('createTaskOptimistic prepends task and bumps sortOrder on others', () => {
    const state = reduce(
      { ...initial(), items: SEED },
      tasksActions.createTaskOptimistic({
        id: 'new',
        title: 'New',
        status: 'todo',
        priority: 'high',
      }),
    );
    expect(state.items).toHaveLength(3);
    expect(state.items[0].id).toBe('new');
    expect(state.items[0].title).toBe('New');
    expect(state.items[1].sortOrder).toBe(1);
    expect(state.optimisticRollback).toEqual(SEED);
  });

  it('updateTaskOptimistic updates matching task', () => {
    const state = reduce(
      { ...initial(), items: SEED },
      tasksActions.updateTaskOptimistic({
        id: 'a',
        draft: { status: 'in_progress', title: '  Alpha  ' },
      }),
    );
    expect(state.items[0].status).toBe('in_progress');
    expect(state.items[0].title).toBe('Alpha');
  });

  it('deleteTaskOptimistic removes task', () => {
    const state = reduce(
      { ...initial(), items: SEED },
      tasksActions.deleteTaskOptimistic('a'),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('b');
  });

  it('rollbackOptimistic restores snapshot', () => {
    const mutated = reduce(
      { ...initial(), items: SEED },
      tasksActions.deleteTaskOptimistic('a'),
    );
    const restored = reduce(mutated, tasksActions.rollbackOptimistic());
    expect(restored.items).toEqual(SEED);
    expect(restored.optimisticRollback).toBeNull();
  });

  it('reorderTasks applies new sortOrder from id list', () => {
    const state = reduce(
      { ...initial(), items: SEED },
      tasksActions.reorderTasks(['b', 'a']),
    );
    expect(state.items.map((t) => t.id)).toEqual(['b', 'a']);
    expect(state.items[0].sortOrder).toBe(0);
    expect(state.items[1].sortOrder).toBe(1);
  });

  it('syncRequest and syncSuccess update syncing flags', () => {
    const syncing = reduce(initial(), tasksActions.syncRequest());
    expect(syncing.syncing).toBe(true);

    const done = reduce(syncing, tasksActions.syncSuccess(2));
    expect(done.syncing).toBe(false);
    expect(done.pendingSyncCount).toBe(2);
  });
});

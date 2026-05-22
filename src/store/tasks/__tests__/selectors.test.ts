import type { TaskFilters } from '@/domain/types/task';
import { createTasksState, makeTask, THREE_STATUS_TASKS } from '@/test/taskTestFixtures';
import {
  selectBoardTasks,
  selectCanReorderTasks,
  selectFilteredTasks,
  selectTaskById,
  selectTaskStats,
  selectTaskStatusCounts,
  selectTasksGroupedByStatus,
} from '@/store/tasks/selectors';
import type { TestRootState } from '@/test/createTestStore';

function stateWith(
  items: ReturnType<typeof makeTask>[],
  filters?: Partial<TaskFilters>,
): TestRootState {
  return createTasksState(items, {
    search: '',
    status: 'all',
    statuses: [],
    priorities: [],
    ...filters,
  }) as TestRootState;
}

describe('task selectors', () => {
  const root = stateWith(THREE_STATUS_TASKS);

  it('selectFilteredTasks applies tab and sheet filters', () => {
    const filtered = selectFilteredTasks(
      stateWith(THREE_STATUS_TASKS, { status: 'todo' }),
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('task-todo');
  });

  it('selectCanReorderTasks is false when filters are not default', () => {
    expect(selectCanReorderTasks(root)).toBe(true);
    expect(
      selectCanReorderTasks(stateWith(THREE_STATUS_TASKS, { search: 'x' })),
    ).toBe(false);
  });

  it('selectTaskStatusCounts returns counts per status', () => {
    const counts = selectTaskStatusCounts(root);
    expect(counts.all).toBe(3);
    expect(counts.todo).toBe(1);
    expect(counts.in_progress).toBe(1);
    expect(counts.done).toBe(1);
  });

  it('selectTaskStats computes totals and percentages', () => {
    const stats = selectTaskStats(root);
    expect(stats.total).toBe(3);
    expect(stats.todo).toBe(1);
    expect(stats.high).toBe(1);
    expect(stats.pct.done).toBe(33);
  });

  it('selectTaskById finds a task', () => {
    const task = selectTaskById('task-done')(root);
    expect(task?.title).toBe('TASK_DONE');
  });

  it('selectBoardTasks ignores status tab but keeps sheet filters', () => {
    const board = selectBoardTasks(
      stateWith(THREE_STATUS_TASKS, {
        status: 'todo',
        statuses: [],
        priorities: ['low'],
      }),
    );
    expect(board).toHaveLength(1);
    expect(board[0].id).toBe('task-done');
  });

  it('selectTasksGroupedByStatus groups filtered tasks', () => {
    const groups = selectTasksGroupedByStatus(root);
    expect(groups.todo.map((t) => t.id)).toEqual(['task-todo']);
    expect(groups.in_progress.map((t) => t.id)).toEqual(['task-progress']);
    expect(groups.done.map((t) => t.id)).toEqual(['task-done']);
  });
});

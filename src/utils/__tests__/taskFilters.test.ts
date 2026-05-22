import type { Task } from '@/domain/types/task';
import {
  filterTasks,
  getTaskCountsByStatus,
  hasSheetFilters,
  isDefaultTaskFilters,
  sortTasksByCreatedAt,
  sortTasksBySortOrder,
} from '../taskFilters';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Alpha task',
    description: 'First',
    status: 'todo',
    priority: 'high',
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Beta work',
    status: 'in_progress',
    priority: 'low',
    sortOrder: 0,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Gamma done',
    status: 'done',
    priority: 'medium',
    sortOrder: 1,
    createdAt: '2024-03-01T00:00:00.000Z',
  },
];

describe('filterTasks', () => {
  it('filters by status tab', () => {
    const result = filterTasks(mockTasks, {
      search: '',
      status: 'done',
      statuses: [],
      priorities: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('filters by sheet priorities', () => {
    const result = filterTasks(mockTasks, {
      search: '',
      status: 'all',
      statuses: [],
      priorities: ['high'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by sheet statuses', () => {
    const result = filterTasks(mockTasks, {
      search: '',
      status: 'all',
      statuses: ['in_progress', 'done'],
      priorities: [],
    });
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id).sort()).toEqual(['2', '3']);
  });

  it('filters by search query', () => {
    const result = filterTasks(mockTasks, {
      search: 'beta',
      status: 'all',
      statuses: [],
      priorities: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('combines status tab, sheet statuses, and priorities', () => {
    const result = filterTasks(mockTasks, {
      search: '',
      status: 'all',
      statuses: ['todo', 'done'],
      priorities: ['high', 'medium'],
    });
    expect(result.map((t) => t.id).sort()).toEqual(['1', '3']);
  });

  it('search is case-insensitive and matches description', () => {
    const result = filterTasks(mockTasks, {
      search: 'FIRST',
      status: 'all',
      statuses: [],
      priorities: [],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('sortTasksBySortOrder', () => {
  it('sorts by sortOrder ascending', () => {
    const sorted = sortTasksBySortOrder(mockTasks);
    expect(sorted.map((task) => task.id)).toEqual(['2', '3', '1']);
  });
});

describe('sortTasksByCreatedAt', () => {
  it('sorts descending by default', () => {
    const sorted = sortTasksByCreatedAt(mockTasks);
    expect(sorted[0].id).toBe('3');
    expect(sorted[2].id).toBe('1');
  });
});

describe('isDefaultTaskFilters', () => {
  it('returns true for default filters', () => {
    expect(
      isDefaultTaskFilters({ search: '', status: 'all', statuses: [], priorities: [] }),
    ).toBe(true);
  });

  it('returns false when search is active', () => {
    expect(
      isDefaultTaskFilters({ search: 'x', status: 'all', statuses: [], priorities: [] }),
    ).toBe(false);
  });

  it('returns false when sheet statuses are set', () => {
    expect(
      isDefaultTaskFilters({ search: '', status: 'all', statuses: ['todo'], priorities: [] }),
    ).toBe(false);
  });
});

describe('hasSheetFilters', () => {
  it('returns true when sheet statuses are set', () => {
    expect(
      hasSheetFilters({ search: '', status: 'all', statuses: ['todo'], priorities: [] }),
    ).toBe(true);
  });

  it('returns false when only the status tab is set', () => {
    expect(
      hasSheetFilters({ search: '', status: 'done', statuses: [], priorities: [] }),
    ).toBe(false);
  });
});

describe('getTaskCountsByStatus', () => {
  it('returns correct counts', () => {
    const counts = getTaskCountsByStatus(mockTasks);
    expect(counts.all).toBe(3);
    expect(counts.todo).toBe(1);
    expect(counts.in_progress).toBe(1);
    expect(counts.done).toBe(1);
  });
});

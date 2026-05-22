import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import type { Task, TaskStatus } from '@/domain/types/task';
import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import i18n from '@/i18n';
import { loadPreferences } from '@/preferences/storage';
import type { TasksState } from '@/store/tasks/tasksSlice';
import { renderWithProviders } from '@/test/renderWithProviders';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

const MOCK_TASKS: Task[] = [
  {
    id: 'task-todo',
    title: 'TASK_TODO',
    status: 'todo',
    priority: 'high',
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'task-progress',
    title: 'TASK_IN_PROGRESS',
    status: 'in_progress',
    priority: 'medium',
    sortOrder: 1,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'task-done',
    title: 'TASK_DONE',
    status: 'done',
    priority: 'low',
    sortOrder: 2,
    createdAt: '2024-03-01T00:00:00.000Z',
  },
];

const STATUS_LABELS_FA: Record<TaskStatus, string> = {
  todo: 'انجام نشده',
  in_progress: 'در حال انجام',
  done: 'انجام شده',
};

const ALL_TASK_TITLES = MOCK_TASKS.map((task) => task.title);

function createLoadedTasksState(filters: TasksState['filters']): { tasks: TasksState } {
  return {
    tasks: {
      items: MOCK_TASKS,
      filters,
      loading: false,
      syncing: false,
      error: null,
      pendingSyncCount: 0,
      optimisticRollback: null,
    },
  };
}

async function applySheetStatusFilter(status: TaskStatus) {
  fireEvent.press(await screen.findByTestId('tasks-filter-toggle'));
  const sheet = within(await screen.findByTestId('bottom-sheet-modal'));
  fireEvent.press(await sheet.findByText(STATUS_LABELS_FA[status]));
  fireEvent.press(await sheet.findByText('اعمال فیلتر'));
  await waitFor(() => {
    expect(screen.getByTestId(`filter-active-tag-status-${status}`)).toBeTruthy();
  });
}

describe('TaskListScreen — FilterActiveTags status filters (fa)', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('fa');
  });

  afterAll(async () => {
    await i18n.changeLanguage('en');
  });

  beforeEach(() => {
    jest.mocked(loadPreferences).mockResolvedValue({ language: 'fa' });
  });

  it.each([
    ['todo', 'TASK_TODO'],
    ['in_progress', 'TASK_IN_PROGRESS'],
    ['done', 'TASK_DONE'],
  ] as const)(
    'shows only matching tasks in the list when filter tag is %s',
    async (status, visibleTitle) => {
      renderWithProviders(<TaskListScreen />, {
        preloadedState: createLoadedTasksState({
          search: '',
          status: 'all',
          statuses: [],
          priorities: [],
        }),
      });

      await screen.findByText('TASK_TODO');
      await applySheetStatusFilter(status);

      const list = within(await screen.findByTestId('tasks-list'));
      expect(list.getByText(visibleTitle)).toBeTruthy();

      const hiddenTitles = ALL_TASK_TITLES.filter((title) => title !== visibleTitle);
      hiddenTitles.forEach((title) => {
        expect(list.queryByText(title)).toBeNull();
      });

      const otherStatuses = (Object.keys(STATUS_LABELS_FA) as TaskStatus[]).filter(
        (value) => value !== status,
      );
      otherStatuses.forEach((other) => {
        expect(list.queryByText(STATUS_LABELS_FA[other])).toBeNull();
      });
    },
  );

  it('does not show grouped status sections when a sheet status filter tag is active', async () => {
    renderWithProviders(<TaskListScreen />, {
      preloadedState: createLoadedTasksState({
        search: '',
        status: 'all',
        statuses: ['todo'],
        priorities: [],
      }),
    });

    const list = within(await screen.findByTestId('tasks-list'));
    await waitFor(() => {
      expect(list.getByText('TASK_TODO')).toBeTruthy();
    });

    expect(screen.getByTestId('filter-active-tag-status-todo')).toBeTruthy();
    expect(list.queryByText('در حال انجام')).toBeNull();
    expect(list.queryByText('انجام شده')).toBeNull();
  });
});

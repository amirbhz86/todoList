import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import type { Task, TaskStatus } from '@/domain/types/task';
import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import type { TasksState } from '@/store/tasks/tasksSlice';
import { renderWithProviders } from '@/test/renderWithProviders';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

const SEARCH_FILTER_TASKS: Task[] = [
  {
    id: 'match-alpha',
    title: 'Alpha release notes',
    description: 'Ship v1',
    status: 'todo',
    priority: 'high',
    sortOrder: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'no-match-beta',
    title: 'Beta testing plan',
    description: 'QA only',
    status: 'in_progress',
    priority: 'medium',
    sortOrder: 1,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'no-match-gamma',
    title: 'Gamma rollout',
    status: 'done',
    priority: 'low',
    sortOrder: 2,
    createdAt: '2024-03-01T00:00:00.000Z',
  },
];

const STATUS_CYCLE_TASKS: Task[] = [
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

function createLoadedTasksState(items: Task[]): { tasks: TasksState } {
  return {
    tasks: {
      items,
      filters: { search: '', status: 'all', statuses: [], priorities: [] },
      loading: false,
      syncing: false,
      error: null,
      pendingSyncCount: 0,
      optimisticRollback: null,
    },
  };
}

describe('TaskListScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('opens the new task sheet when the FAB is pressed', async () => {
    renderWithProviders(<TaskListScreen />);

    fireEvent.press(await screen.findByTestId('tasks-new-button'));

    expect(await screen.findByText('New task')).toBeTruthy();
    expect(await screen.findByText('Create task')).toBeTruthy();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('opens the filter sheet when the filter button is pressed', async () => {
    renderWithProviders(<TaskListScreen />);

    fireEvent.press(await screen.findByTestId('tasks-filter-toggle'));

    expect(await screen.findByText('Filter Tasks')).toBeTruthy();
    expect(await screen.findByText('Apply Filters')).toBeTruthy();
  });

  describe('task checkbox status cycle', () => {
    it.each([
      {
        taskId: 'task-todo',
        from: 'todo' as const,
        to: 'in_progress' as const,
        title: 'TASK_TODO',
      },
      {
        taskId: 'task-progress',
        from: 'in_progress' as const,
        to: 'done' as const,
        title: 'TASK_IN_PROGRESS',
      },
      {
        taskId: 'task-done',
        from: 'done' as const,
        to: 'todo' as const,
        title: 'TASK_DONE',
      },
    ])(
      'moves $title from $from to $to section when checkbox is pressed',
      async ({ taskId, from, to, title }) => {
        const { store } = renderWithProviders(<TaskListScreen />, {
          preloadedState: createLoadedTasksState(STATUS_CYCLE_TASKS),
        });

        await screen.findByText(title);
        const list = within(await screen.findByTestId('tasks-list'));
        expect(list.getByTestId(`task-section-${from}`)).toBeTruthy();
        expect(list.getByText(title)).toBeTruthy();

        fireEvent.press(screen.getByTestId(`task-checkbox-${taskId}`));

        await waitFor(() => {
          const task = store.getState().tasks.items.find((item) => item.id === taskId);
          expect(task?.status).toBe(to);
        });

        const updatedList = within(screen.getByTestId('tasks-list'));
        expect(updatedList.getByTestId(`task-section-${to}`)).toBeTruthy();
        expect(updatedList.getByText(title)).toBeTruthy();
        expect(updatedList.queryByTestId(`task-section-${from}`)).toBeNull();
      },
    );
  });

  describe('search input', () => {
    async function openSearchInput(
      preloadedState?: ReturnType<typeof createLoadedTasksState>,
    ) {
      renderWithProviders(<TaskListScreen />, { preloadedState });
      fireEvent.press(await screen.findByTestId('tasks-search-toggle'));
      return screen.findByTestId('tasks-search-input');
    }

    it('shows whatever the user types in the search field', async () => {
      const searchInput = await openSearchInput();

      fireEvent.changeText(searchInput, 'my search');

      await waitFor(() => {
        expect(searchInput).toHaveDisplayValue('my search');
        expect(screen.getByDisplayValue('my search')).toBe(searchInput);
      });
    });

    it('updates the visible query when the user edits the search text', async () => {
      const searchInput = await openSearchInput();

      fireEvent.changeText(searchInput, 'board');
      await waitFor(() => expect(searchInput).toHaveDisplayValue('board'));

      fireEvent.changeText(searchInput, 'board review');
      await waitFor(() => expect(searchInput).toHaveDisplayValue('board review'));
    });

    it('hides tasks that do not contain the search term', async () => {
      const searchInput = await openSearchInput(
        createLoadedTasksState(SEARCH_FILTER_TASKS),
      );

      const list = within(await screen.findByTestId('tasks-list'));
      expect(list.getByText('Alpha release notes')).toBeTruthy();
      expect(list.getByText('Beta testing plan')).toBeTruthy();
      expect(list.getByText('Gamma rollout')).toBeTruthy();

      fireEvent.changeText(searchInput, 'alpha');

      await waitFor(() => {
        const filteredList = within(screen.getByTestId('tasks-list'));
        expect(filteredList.getByText('Alpha release notes')).toBeTruthy();
        expect(filteredList.queryByText('Beta testing plan')).toBeNull();
        expect(filteredList.queryByText('Gamma rollout')).toBeNull();
        expect(filteredList.queryByTestId('task-card-no-match-beta')).toBeNull();
        expect(filteredList.queryByTestId('task-card-no-match-gamma')).toBeNull();
      });
    });
  });
});

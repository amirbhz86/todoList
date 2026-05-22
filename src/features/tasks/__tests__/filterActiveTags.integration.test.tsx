import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import { createTasksState, THREE_STATUS_TASKS } from '@/test/taskTestFixtures';
import { renderWithProviders } from '@/test/renderWithProviders';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

describe('FilterActiveTags integration', () => {
  it('removing a status tag restores tasks from that status in the list', async () => {
    renderWithProviders(<TaskListScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS, {
        search: '',
        status: 'all',
        statuses: ['todo'],
        priorities: [],
      }),
    });

    const list = within(await screen.findByTestId('tasks-list'));
    expect(list.getByText('TASK_TODO')).toBeTruthy();
    expect(list.queryByText('TASK_IN_PROGRESS')).toBeNull();

    fireEvent.press(screen.getByTestId('filter-active-tag-status-todo'));

    await waitFor(() => {
      const updated = within(screen.getByTestId('tasks-list'));
      expect(updated.getByText('TASK_TODO')).toBeTruthy();
      expect(updated.getByText('TASK_IN_PROGRESS')).toBeTruthy();
      expect(updated.getByText('TASK_DONE')).toBeTruthy();
    });
  });

  it('removing a priority tag shows tasks with that priority again', async () => {
    renderWithProviders(<TaskListScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS, {
        search: '',
        status: 'all',
        statuses: [],
        priorities: ['high'],
      }),
    });

    const list = within(await screen.findByTestId('tasks-list'));
    expect(list.getByText('TASK_TODO')).toBeTruthy();
    expect(list.queryByText('TASK_DONE')).toBeNull();

    fireEvent.press(screen.getByTestId('filter-active-tag-priority'));

    await waitFor(() => {
      expect(within(screen.getByTestId('tasks-list')).getByText('TASK_DONE')).toBeTruthy();
    });
  });
});

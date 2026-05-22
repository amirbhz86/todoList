import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import {
  createTasksState,
  STATUS_LABELS_EN,
  THREE_STATUS_TASKS,
} from '@/test/taskTestFixtures';
import { renderWithProviders } from '@/test/renderWithProviders';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

async function openFilterSheet() {
  fireEvent.press(await screen.findByTestId('tasks-filter-toggle'));
  return within(await screen.findByTestId('bottom-sheet-modal'));
}

describe('FilterSheet integration', () => {
  it('applies status and priority filters to the task list', async () => {
    renderWithProviders(<TaskListScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS),
    });

    await screen.findByText('TASK_TODO');
    const sheet = await openFilterSheet();

    fireEvent.press(sheet.getByText(STATUS_LABELS_EN.todo));
    fireEvent.press(sheet.getByText('High'));
    fireEvent.press(sheet.getByText('Apply Filters'));

    await waitFor(() => {
      expect(screen.queryByTestId('bottom-sheet-modal')).toBeNull();
    });

    const list = within(screen.getByTestId('tasks-list'));
    expect(list.getByText('TASK_TODO')).toBeTruthy();
    expect(list.queryByText('TASK_IN_PROGRESS')).toBeNull();
    expect(list.queryByText('TASK_DONE')).toBeNull();
    expect(screen.getByTestId('filter-active-tag-status-todo')).toBeTruthy();
  });

  it('clears sheet filters when Clear All is pressed', async () => {
    renderWithProviders(<TaskListScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS, {
        search: '',
        status: 'all',
        statuses: ['todo'],
        priorities: [],
      }),
    });

    await screen.findByText('TASK_TODO');
    expect(await screen.findByTestId('filter-active-tag-status-todo')).toBeTruthy();

    const sheet = await openFilterSheet();
    fireEvent.press(sheet.getByText('Clear All'));

    await waitFor(() => {
      expect(screen.queryByTestId('filter-active-tag-status-todo')).toBeNull();
    });

    const list = within(screen.getByTestId('tasks-list'));
    expect(list.getByText('TASK_TODO')).toBeTruthy();
    expect(list.getByText('TASK_IN_PROGRESS')).toBeTruthy();
    expect(list.getByText('TASK_DONE')).toBeTruthy();
  });
});

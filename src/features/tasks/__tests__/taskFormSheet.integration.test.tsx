import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';

import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import { DEFAULT_TASK_FILTERS } from '@/domain/types/task';
import type { Task } from '@/domain/types/task';
import { renderWithProviders } from '@/test/renderWithProviders';
import {
  expectTaskFormFieldValues,
  expectTaskOnList,
  fillTaskFormFields,
  getTaskFormSheet,
  submitTaskForm,
} from '@/test/taskFormTestHelpers';
import type { TasksState } from '@/store/tasks/tasksSlice';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/utils/id', () => ({
  createTaskId: () => 'integration-task-id',
  createTimestamp: () => '2026-05-21T12:00:00.000Z',
}));

const SEED_TASK: Task = {
  id: 'seed-task-1',
  title: 'Original title',
  description: 'Original description',
  status: 'todo',
  priority: 'low',
  sortOrder: 0,
  createdAt: '2026-05-20T12:00:00.000Z',
};

function tasksState(items: Task[]): Partial<{ tasks: TasksState }> {
  return {
    tasks: {
      items,
      filters: DEFAULT_TASK_FILTERS,
      loading: false,
      syncing: false,
      error: null,
      pendingSyncCount: 0,
      optimisticRollback: null,
    },
  };
}

async function openNewTaskSheet() {
  renderWithProviders(<TaskListScreen />);
  fireEvent.press(await screen.findByTestId('tasks-new-button'));
  expect(await screen.findByText('New task')).toBeTruthy();
  return within(await getTaskFormSheet());
}

async function openEditTaskSheet() {
  renderWithProviders(<TaskListScreen />, {
    preloadedState: tasksState([SEED_TASK]),
  });
  fireEvent.press(await screen.findByText(SEED_TASK.title));
  expect(await screen.findByText('Edit task')).toBeTruthy();
  return within(await getTaskFormSheet());
}

describe('Task form sheet integration', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('new task', () => {
    it('shows typed title and description in the form', async () => {
      const form = await openNewTaskSheet();

      await fillTaskFormFields({
        title: 'Ship release',
        description: 'QA and deploy',
      });

      expectTaskFormFieldValues(form, {
        title: 'Ship release',
        description: 'QA and deploy',
      });
    });

    it('shows selected status and priority in the form', async () => {
      const form = await openNewTaskSheet();

      await fillTaskFormFields({
        status: 'in_progress',
        priority: 'high',
      });

      expectTaskFormFieldValues(form, {
        status: 'in_progress',
        priority: 'high',
      });
    });

    it('shows created task on the list after saving', async () => {
      await openNewTaskSheet();

      await fillTaskFormFields({
        title: 'Ship release',
        description: 'QA and deploy',
        status: 'done',
        priority: 'high',
      });
      await submitTaskForm();

      await waitFor(() => {
        expect(screen.queryByTestId('bottom-sheet-modal')).toBeNull();
      });

      expectTaskOnList('integration-task-id', {
        title: 'Ship release',
        description: 'QA and deploy',
        statusLabel: 'Done',
        priorityLabel: 'High',
      });
    });
  });

  describe('edit task', () => {
    it('loads existing task values in the form', async () => {
      const form = await openEditTaskSheet();

      expectTaskFormFieldValues(form, {
        title: SEED_TASK.title,
        description: SEED_TASK.description!,
        status: SEED_TASK.status,
        priority: SEED_TASK.priority,
      });
    });

    it('shows updated title, description, status, and priority while editing', async () => {
      const form = await openEditTaskSheet();

      await fillTaskFormFields({
        title: 'Updated title',
        description: 'Updated description',
        status: 'in_progress',
        priority: 'high',
      });

      expectTaskFormFieldValues(form, {
        title: 'Updated title',
        description: 'Updated description',
        status: 'in_progress',
        priority: 'high',
      });
    });

    it('shows saved changes on the task list after confirming', async () => {
      await openEditTaskSheet();

      await fillTaskFormFields({
        title: 'Updated title',
        description: 'Updated description',
        status: 'in_progress',
        priority: 'high',
      });
      await submitTaskForm();

      await waitFor(() => {
        expect(screen.queryByTestId('bottom-sheet-modal')).toBeNull();
      });

      expect(screen.queryByText(SEED_TASK.title)).toBeNull();
      expectTaskOnList(SEED_TASK.id, {
        title: 'Updated title',
        description: 'Updated description',
        statusLabel: 'In progress',
        priorityLabel: 'High',
      });
    });
  });
});

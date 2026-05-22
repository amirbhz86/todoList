import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import i18n from '@/i18n';
import { fillTaskFormFields, getTaskFormSheet, submitTaskForm } from '@/test/taskFormTestHelpers';
import { renderWithProviders } from '@/test/renderWithProviders';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
}));

describe('Task form validation integration', () => {
  it('shows title error and keeps sheet open when title is empty', async () => {
    renderWithProviders(<TaskListScreen />);
    fireEvent.press(await screen.findByTestId('tasks-new-button'));
    await getTaskFormSheet();

    await fillTaskFormFields({ title: '   ' });
    await submitTaskForm();

    expect(await screen.findByText(i18n.t('validation.titleRequired'))).toBeTruthy();
    expect(screen.getByTestId('bottom-sheet-modal')).toBeTruthy();
  });

  it('shows title error when title exceeds max length', async () => {
    renderWithProviders(<TaskListScreen />);
    fireEvent.press(await screen.findByTestId('tasks-new-button'));
    await getTaskFormSheet();

    await fillTaskFormFields({ title: 'x'.repeat(121) });
    await submitTaskForm();

    expect(await screen.findByText(i18n.t('validation.titleMaxLength'))).toBeTruthy();
    expect(screen.getByTestId('bottom-sheet-modal')).toBeTruthy();
  });

  it('does not add a task to the list when validation fails', async () => {
    renderWithProviders(<TaskListScreen />);
    fireEvent.press(await screen.findByTestId('tasks-new-button'));
    await getTaskFormSheet();

    await fillTaskFormFields({ title: '' });
    await submitTaskForm();

    await waitFor(() => {
      expect(screen.getByText(i18n.t('validation.titleRequired'))).toBeTruthy();
    });
    expect(screen.queryByTestId('task-card-integration-task-id')).toBeNull();
  });
});

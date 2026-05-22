import { screen, within } from '@testing-library/react-native';

import { StatsScreen } from '@/features/stats/screens/StatsScreen';
import { createTasksState, THREE_STATUS_TASKS } from '@/test/taskTestFixtures';
import { renderWithProviders } from '@/test/renderWithProviders';

describe('StatsScreen', () => {
  it('shows aggregate counts from tasks in the store', async () => {
    renderWithProviders(<StatsScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS),
    });

    expect(await screen.findByText('Total')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getAllByText('Done').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(3);
  });

  it('shows status breakdown labels', async () => {
    renderWithProviders(<StatsScreen />, {
      preloadedState: createTasksState(THREE_STATUS_TASKS),
    });

    expect(await screen.findByText('By status')).toBeTruthy();
    expect(screen.getByText('To do')).toBeTruthy();
    expect(screen.getByText('In progress')).toBeTruthy();
  });

  it('shows zero totals when there are no tasks', async () => {
    renderWithProviders(<StatsScreen />, {
      preloadedState: createTasksState([]),
    });

    expect(await screen.findByText('Total')).toBeTruthy();
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });
});

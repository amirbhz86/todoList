import { fireEvent, screen, within } from '@testing-library/react-native';

import type { TaskPriority, TaskStatus } from '@/domain/types/task';

export async function getTaskFormSheet() {
  return screen.findByTestId('bottom-sheet-modal');
}

export async function fillTaskFormFields(options: {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}) {
  const sheet = await getTaskFormSheet();
  const scope = within(sheet);

  if (options.title !== undefined) {
    fireEvent.changeText(scope.getByTestId('task-form-title-input'), options.title);
  }
  if (options.description !== undefined) {
    fireEvent.changeText(
      scope.getByTestId('task-form-description-input'),
      options.description,
    );
  }
  if (options.status) {
    fireEvent.press(scope.getByTestId(`task-form-status-${options.status}`));
  }
  if (options.priority) {
    fireEvent.press(scope.getByTestId(`task-form-priority-${options.priority}`));
  }

  return sheet;
}

export async function submitTaskForm() {
  const sheet = await getTaskFormSheet();
  fireEvent.press(within(sheet).getByTestId('task-form-save-button'));
}

export function expectTaskFormFieldValues(
  scope: ReturnType<typeof within>,
  expected: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  },
) {
  if (expected.title !== undefined) {
    expect(scope.getByTestId('task-form-title-input')).toHaveDisplayValue(expected.title);
  }
  if (expected.description !== undefined) {
    expect(scope.getByTestId('task-form-description-input')).toHaveDisplayValue(
      expected.description,
    );
  }
  if (expected.status) {
    expect(
      scope.getByTestId(`task-form-status-${expected.status}`).props.accessibilityState,
    ).toEqual(expect.objectContaining({ selected: true }));
  }
  if (expected.priority) {
    expect(
      scope.getByTestId(`task-form-priority-${expected.priority}`).props.accessibilityState,
    ).toEqual(expect.objectContaining({ selected: true }));
  }
}

export function expectTaskOnList(
  taskId: string,
  expected: {
    title: string;
    description?: string;
    statusLabel: string;
    priorityLabel: string;
  },
) {
  const card = screen.getByTestId(`task-card-${taskId}`);
  const scope = within(card);
  expect(scope.getByText(expected.title)).toBeTruthy();
  if (expected.description) {
    expect(scope.getByText(expected.description)).toBeTruthy();
  }
  expect(scope.getByText(expected.priorityLabel)).toBeTruthy();
  expect(scope.getByText(expected.statusLabel)).toBeTruthy();
}

import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { TaskListScreen } from '@/features/tasks/screens/TaskListScreen';
import type { AppLanguage } from '@/preferences/types';
import { renderWithProviders } from '@/test/renderWithProviders';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: jest.fn(),
  }),
}));

jest.mock('expo', () => {
  const actual = jest.requireActual('expo');
  return {
    ...actual,
    reloadAppAsync: jest.fn(() => Promise.resolve()),
  };
});

const mockStorage = {
  prefs: { language: 'en' as AppLanguage },
};

jest.mock('@/preferences/storage', () => ({
  loadPreferences: jest.fn(() => Promise.resolve(mockStorage.prefs)),
  savePreferences: jest.fn((prefs: typeof mockStorage.prefs) => {
    mockStorage.prefs = prefs;
    return Promise.resolve();
  }),
}));

const EN = {
  settingsTitle: 'Settings',
  languageSection: 'Language',
  languageFaChip: 'Persian',
  languageEnChip: 'English',
  newTask: 'New task',
} as const;

const FA = {
  settingsTitle: 'تنظیمات',
  languageSection: 'زبان',
  languageFaChip: 'فارسی',
  languageEnChip: 'انگلیسی',
  newTask: 'وظیفه جدید',
} as const;

async function openSettingsSheet() {
  renderWithProviders(<TaskListScreen />);
  await screen.findByTestId('tasks-new-button');
  fireEvent.press(screen.getByTestId('tasks-settings-button'));
  await screen.findByText(EN.settingsTitle);
}

describe('application language change', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockStorage.prefs = { language: 'en' };
  });

  it('opens settings in a bottom sheet instead of navigating', async () => {
    await openSettingsSheet();
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByText(EN.languageSection)).toBeTruthy();
  });

  it('updates settings sheet text when switching from English to Persian', async () => {
    await openSettingsSheet();

    expect(screen.getByText(EN.languageSection)).toBeTruthy();
    fireEvent.press(screen.getByText(EN.languageFaChip));

    await waitFor(() => {
      expect(screen.getByText(FA.settingsTitle)).toBeTruthy();
    });
    expect(screen.getByText(FA.languageSection)).toBeTruthy();
    expect(screen.getByText(FA.languageFaChip)).toBeTruthy();
    expect(screen.queryByText(EN.settingsTitle)).toBeNull();
  });

  it('updates settings sheet text when switching from Persian back to English', async () => {
    mockStorage.prefs = { language: 'fa' };
    renderWithProviders(<TaskListScreen />);
    await screen.findByTestId('tasks-new-button');
    fireEvent.press(screen.getByTestId('tasks-settings-button'));
    expect(await screen.findByText(FA.settingsTitle)).toBeTruthy();

    fireEvent.press(screen.getByText(FA.languageEnChip));

    await waitFor(() => {
      expect(screen.getByText(EN.settingsTitle)).toBeTruthy();
    });
    expect(screen.getByText(EN.languageSection)).toBeTruthy();
    expect(screen.queryByText(FA.settingsTitle)).toBeNull();
  });

  it('updates Tasks screen text after language is changed in settings sheet', async () => {
    await openSettingsSheet();
    fireEvent.press(screen.getByText(EN.languageFaChip));

    await waitFor(() => {
      expect(screen.getByText(FA.settingsTitle)).toBeTruthy();
    });

    fireEvent.press(await screen.findByTestId('tasks-new-button'));

    expect(await screen.findByText(FA.newTask)).toBeTruthy();
    expect(screen.queryByText(EN.newTask)).toBeNull();
  });
});

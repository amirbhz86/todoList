import i18n from '@/i18n';
import {
  taskFilterStatusLabel,
  taskPriorityLabel,
  taskPriorityShortLabel,
  taskStatusLabel,
} from '@/i18n/labels';

async function withLanguage<T>(lng: 'en' | 'fa', fn: () => T): Promise<T> {
  const prev = i18n.language;
  await i18n.changeLanguage(lng);
  try {
    return fn();
  } finally {
    await i18n.changeLanguage(prev);
  }
}

describe('i18n labels', () => {
  it('taskStatusLabel uses taskStatus keys', async () => {
    await withLanguage('en', () => {
      expect(taskStatusLabel(i18n.t.bind(i18n), 'todo')).toBe('To do');
      expect(taskStatusLabel(i18n.t.bind(i18n), 'done')).toBe('Done');
    });
  });

  it('taskFilterStatusLabel uses Active for in_progress tab', async () => {
    await withLanguage('en', () => {
      expect(taskFilterStatusLabel(i18n.t.bind(i18n), 'all')).toBe('All');
      expect(taskFilterStatusLabel(i18n.t.bind(i18n), 'in_progress')).toBe('Active');
    });
  });

  it('taskPriorityShortLabel returns compact labels', async () => {
    await withLanguage('en', () => {
      expect(taskPriorityShortLabel(i18n.t.bind(i18n), 'high')).toBe('HIGH');
      expect(taskPriorityShortLabel(i18n.t.bind(i18n), 'medium')).toBe('MED');
    });
  });

  it('taskPriorityLabel returns full priority names in Persian', async () => {
    await withLanguage('fa', () => {
      expect(taskPriorityLabel(i18n.t.bind(i18n), 'low')).toBe('کم');
    });
  });
});

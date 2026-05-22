import i18n from '@/i18n';
import { formatRelativeDate, formatTaskDate } from '../formatDate';

async function withLanguage<T>(lng: 'en' | 'fa', fn: () => T): Promise<T> {
  const prev = i18n.language;
  await i18n.changeLanguage(lng);
  try {
    return fn();
  } finally {
    await i18n.changeLanguage(prev);
  }
}

describe('formatTaskDate', () => {
  it('formats a valid ISO date in English', async () => {
    await withLanguage('en', () => {
      const result = formatTaskDate('2024-06-15T10:00:00.000Z', 'en');
      expect(result).not.toBe('');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('returns empty string for invalid input', () => {
    expect(formatTaskDate('not-a-date', 'en')).toBe('');
  });
});

describe('formatRelativeDate', () => {
  it('returns Today in English', async () => {
    await withLanguage('en', () => {
      expect(formatRelativeDate(new Date().toISOString(), i18n.t.bind(i18n), 'en')).toBe(
        'Today',
      );
    });
  });

  it('returns امروز in Persian', async () => {
    await withLanguage('fa', () => {
      expect(formatRelativeDate(new Date().toISOString(), i18n.t.bind(i18n), 'fa')).toBe(
        'امروز',
      );
    });
  });

  it('returns Yesterday in English for one day ago', async () => {
    await withLanguage('en', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeDate(yesterday, i18n.t.bind(i18n), 'en')).toBe('Yesterday');
    });
  });

  it('returns Invalid date for invalid input', async () => {
    await withLanguage('en', () => {
      expect(formatRelativeDate('bad', i18n.t.bind(i18n), 'en')).toBe('Invalid date');
    });
  });
});

import { getDatabase, initializeDatabase } from '@/infrastructure/database/client';

import {
  DEFAULT_PREFERENCES,
  type AppLanguage,
  type AppPreferences,
} from './types';

const STORAGE_KEY = 'user_preferences';

function parseLanguage(value: unknown): AppLanguage | null {
  return value === 'fa' || value === 'en' ? value : null;
}

async function ensurePreferencesTable(): Promise<void> {
  await initializeDatabase();
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

export async function loadPreferences(): Promise<AppPreferences> {
  try {
    await ensurePreferencesTable();
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_preferences WHERE key = ?',
      [STORAGE_KEY],
    );

    if (!row?.value) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(row.value) as Partial<AppPreferences>;
    return {
      language: parseLanguage(parsed.language) ?? DEFAULT_PREFERENCES.language,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(preferences: AppPreferences): Promise<void> {
  await ensurePreferencesTable();
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_preferences (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [STORAGE_KEY, JSON.stringify(preferences)],
  );
}

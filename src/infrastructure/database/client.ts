import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'task_manager.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initializePromise: Promise<void> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    try {
      const db = await getDatabase();

      await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK(status IN ('todo', 'in_progress', 'done')),
        priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY NOT NULL,
        entity_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK(operation IN ('create', 'update', 'delete')),
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        retry_count INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_sync_queue_created_at ON sync_queue(created_at);
    `);

      await migrateTasksSortOrder(db);
    } catch (error) {
      initializePromise = null;
      throw error;
    }
  })();

  return initializePromise;
}

async function migrateTasksSortOrder(db: SQLite.SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(tasks)');
  const hasSortOrder = columns.some((column) => column.name === 'sort_order');

  if (!hasSortOrder) {
    await db.execAsync('ALTER TABLE tasks ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0');
  }

  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_tasks_sort_order ON tasks(sort_order)');

  const duplicateOrders = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM (
      SELECT sort_order FROM tasks GROUP BY sort_order HAVING COUNT(*) > 1
    )`,
  );

  if ((duplicateOrders?.count ?? 0) > 0) {
    const rows = await db.getAllAsync<{ id: string }>(
      'SELECT id FROM tasks ORDER BY datetime(created_at) DESC',
    );

    await db.withTransactionAsync(async () => {
      for (let index = 0; index < rows.length; index += 1) {
        await db.runAsync('UPDATE tasks SET sort_order = ? WHERE id = ?', [index, rows[index].id]);
      }
    });
  }
}

import * as SQLite from 'expo-sqlite';

// Each entry migrates from version i to i+1. NEVER edit a shipped migration: append a new one.
const MIGRATIONS: string[] = [
  `
  CREATE TABLE kv (k TEXT PRIMARY KEY NOT NULL, v TEXT NOT NULL);
  CREATE TABLE srs (
    id TEXT PRIMARY KEY NOT NULL, kind TEXT NOT NULL, state TEXT NOT NULL,
    ease REAL NOT NULL, interval REAL NOT NULL, due INTEGER NOT NULL,
    reps INTEGER NOT NULL, lapses INTEGER NOT NULL, last_seen INTEGER NOT NULL, avg_ms REAL NOT NULL DEFAULT 0
  );
  CREATE INDEX srs_due ON srs(due);
  CREATE TABLE mistakes (
    id TEXT PRIMARY KEY NOT NULL, category TEXT NOT NULL, original TEXT NOT NULL,
    correction TEXT NOT NULL, explanation TEXT NOT NULL, frequency INTEGER NOT NULL DEFAULT 1,
    last_occurrence INTEGER NOT NULL, severity INTEGER NOT NULL DEFAULT 2
  );
  CREATE TABLE activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL,
    skill TEXT NOT NULL, seconds INTEGER NOT NULL, detail TEXT
  );
  CREATE INDEX activity_day ON activity(day);
  CREATE TABLE convo (
    id INTEGER PRIMARY KEY AUTOINCREMENT, session TEXT NOT NULL, ts INTEGER NOT NULL,
    role TEXT NOT NULL, text TEXT NOT NULL
  );
  CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, screen TEXT NOT NULL,
    kind TEXT NOT NULL, note TEXT
  );
  CREATE TABLE saved (
    id TEXT PRIMARY KEY NOT NULL, kind TEXT NOT NULL, ref TEXT NOT NULL, ts INTEGER NOT NULL
  );
  CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, skill TEXT NOT NULL,
    score REAL NOT NULL, source TEXT NOT NULL
  );
  `,
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('coach.db');
      await db.execAsync('PRAGMA journal_mode = WAL;');
      const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
      let version = row?.user_version ?? 0;
      while (version < MIGRATIONS.length) {
        await db.withTransactionAsync(async () => {
          await db.execAsync(MIGRATIONS[version]);
        });
        version += 1;
        await db.execAsync(`PRAGMA user_version = ${version}`);
      }
      return db;
    })();
  }
  return dbPromise;
}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  const db = await getDb();
  const r = await db.getFirstAsync<{ v: string }>('SELECT v FROM kv WHERE k = ?', key);
  if (!r) return fallback;
  try {
    return JSON.parse(r.v) as T;
  } catch {
    return fallback;
  }
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  await db.runAsync('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)', key, JSON.stringify(value));
}

export const dayKey = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export async function wipeAll(): Promise<void> {
  const db = await getDb();
  await db.execAsync(
    'DELETE FROM kv; DELETE FROM srs; DELETE FROM mistakes; DELETE FROM activity; DELETE FROM convo; DELETE FROM feedback; DELETE FROM saved; DELETE FROM scores;',
  );
}

export async function wipeConversations(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM convo');
  await db.runAsync("DELETE FROM kv WHERE k = 'memory'");
}

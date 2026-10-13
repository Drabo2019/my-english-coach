import * as Application from 'expo-application';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { BACKUP_COLUMNS, BACKUP_TABLES, buildBackup, summarize, validateBackup, type BackupFile, type Row } from './backup-format';
import { dayKey, getDb, kvGet, kvSet } from './storage/db';

export async function lastBackupAt(): Promise<string | null> {
  return kvGet<string | null>('lastBackupAt', null);
}

/** Writes a JSON backup to the cache dir and opens the Android share sheet (Drive, Files, e-mail…). */
export async function exportBackup(): Promise<{ uri: string; cards: number }> {
  const db = await getDb();
  const tables: Record<string, Row[]> = {};
  for (const t of BACKUP_TABLES) tables[t] = await db.getAllAsync<Row>(`SELECT * FROM ${t}`);
  const file = buildBackup(tables, Application.nativeApplicationVersion ?? '0.0.0');
  const uri = `${FileSystem.cacheDirectory}my-english-coach-backup-${dayKey()}.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(file));
  await kvSet('lastBackupAt', new Date().toISOString());
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Save your English Coach backup' });
  }
  return { uri, cards: file.tables.srs.length };
}

export interface PickedBackup {
  file: BackupFile;
  summary: ReturnType<typeof summarize>;
}

/** Lets the user pick a backup file and validates it. Does NOT change any data. */
export async function pickBackup(): Promise<PickedBackup | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true });
  if (res.canceled || !res.assets?.[0]) return null;
  const text = await FileSystem.readAsStringAsync(res.assets[0].uri);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  const v = validateBackup(parsed);
  if (!v.ok) throw new Error(v.error);
  return { file: v.file, summary: summarize(v.file) };
}

/** Replaces ALL local data with the backup, atomically. Keeps the current LLM API key (never stored in backups). */
export async function restoreBackup(file: BackupFile): Promise<void> {
  const db = await getDb();
  const currentSettings = await kvGet<Record<string, unknown>>('settings', {});
  await db.withTransactionAsync(async () => {
    for (const t of BACKUP_TABLES) await db.runAsync(`DELETE FROM ${t}`);
    for (const t of BACKUP_TABLES) {
      const cols = BACKUP_COLUMNS[t] as readonly string[];
      const sql = `INSERT INTO ${t} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`;
      for (const row of file.tables[t]) {
        await db.runAsync(sql, ...cols.map((c) => row[c] ?? null));
      }
    }
  });
  if (currentSettings.llmApiKey) {
    const restored = await kvGet<Record<string, unknown>>('settings', {});
    await kvSet('settings', { ...restored, llmApiKey: currentSettings.llmApiKey });
  }
}

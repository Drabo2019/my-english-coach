// Pure (no native imports) so it is unit-tested on the dev machine.

export const BACKUP_APP = 'my-english-coach';
export const BACKUP_SCHEMA = 1;

/** Columns per table. Anything else in a backup row is ignored, so a crafted file cannot inject columns. */
export const BACKUP_COLUMNS = {
  kv: ['k', 'v'],
  srs: ['id', 'kind', 'state', 'ease', 'interval', 'due', 'reps', 'lapses', 'last_seen', 'avg_ms'],
  mistakes: ['id', 'category', 'original', 'correction', 'explanation', 'frequency', 'last_occurrence', 'severity'],
  activity: ['id', 'ts', 'day', 'skill', 'seconds', 'detail'],
  convo: ['id', 'session', 'ts', 'role', 'text'],
  feedback: ['id', 'ts', 'screen', 'kind', 'note'],
  saved: ['id', 'kind', 'ref', 'ts'],
  scores: ['id', 'ts', 'skill', 'score', 'source'],
} as const;

export type BackupTable = keyof typeof BACKUP_COLUMNS;
export const BACKUP_TABLES = Object.keys(BACKUP_COLUMNS) as BackupTable[];

export type Row = Record<string, string | number | null>;

export interface BackupFile {
  app: typeof BACKUP_APP;
  schema: number;
  appVersion: string;
  exportedAt: string;
  tables: Record<BackupTable, Row[]>;
}

/** Secrets never leave the phone inside a backup file. */
function stripSecrets(kvRows: Row[]): Row[] {
  return kvRows.map((r) => {
    if (r.k !== 'settings' || typeof r.v !== 'string') return r;
    try {
      const s = JSON.parse(r.v) as Record<string, unknown>;
      delete s.llmApiKey;
      return { ...r, v: JSON.stringify(s) };
    } catch {
      return r;
    }
  });
}

export function buildBackup(tables: Partial<Record<BackupTable, Row[]>>, appVersion: string, now = new Date()): BackupFile {
  const out = {} as Record<BackupTable, Row[]>;
  for (const t of BACKUP_TABLES) out[t] = tables[t] ?? [];
  out.kv = stripSecrets(out.kv);
  return { app: BACKUP_APP, schema: BACKUP_SCHEMA, appVersion, exportedAt: now.toISOString(), tables: out };
}

export type Validation = { ok: true; file: BackupFile } | { ok: false; error: string };

export function validateBackup(input: unknown): Validation {
  if (typeof input !== 'object' || input === null) return { ok: false, error: 'Not a backup file.' };
  const f = input as Partial<BackupFile>;
  if (f.app !== BACKUP_APP) return { ok: false, error: 'This file is not a My English Coach backup.' };
  if (typeof f.schema !== 'number' || f.schema < 1) return { ok: false, error: 'Unknown backup format.' };
  if (f.schema > BACKUP_SCHEMA) return { ok: false, error: 'This backup was made by a newer version of the app. Update the app first.' };
  if (typeof f.tables !== 'object' || f.tables === null) return { ok: false, error: 'The backup has no data.' };

  const clean = {} as Record<BackupTable, Row[]>;
  for (const t of BACKUP_TABLES) {
    const rows = (f.tables as Record<string, unknown>)[t];
    if (rows === undefined) {
      clean[t] = [];
      continue;
    }
    if (!Array.isArray(rows)) return { ok: false, error: `Table “${t}” is corrupted.` };
    const cols = BACKUP_COLUMNS[t] as readonly string[];
    clean[t] = [];
    for (const r of rows) {
      if (typeof r !== 'object' || r === null) return { ok: false, error: `Table “${t}” has an invalid row.` };
      const row: Row = {};
      for (const c of cols) {
        const v = (r as Record<string, unknown>)[c];
        if (v === undefined || v === null) row[c] = null;
        else if (typeof v === 'string' || typeof v === 'number') row[c] = v;
        else return { ok: false, error: `Table “${t}” has an invalid value.` };
      }
      clean[t].push(row);
    }
  }
  return {
    ok: true,
    file: { app: BACKUP_APP, schema: f.schema, appVersion: String(f.appVersion ?? ''), exportedAt: String(f.exportedAt ?? ''), tables: clean },
  };
}

export function summarize(f: BackupFile) {
  return {
    cards: f.tables.srs.length,
    mistakes: f.tables.mistakes.length,
    minutes: Math.round(f.tables.activity.reduce((a, r) => a + Number(r.seconds ?? 0), 0) / 60),
    exportedAt: f.exportedAt,
  };
}

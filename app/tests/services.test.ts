import { describe, expect, it } from 'vitest';

import { parseSse } from '@/services/ai/sse';
import { BACKUP_TABLES, buildBackup, summarize, validateBackup } from '@/services/backup-format';
import { shouldCheck, UPDATE_CHECK_INTERVAL_MS } from '@/services/updates/version';

describe('backup format', () => {
  const rows = {
    kv: [
      { k: 'profile', v: '{"onboarded":true}' },
      { k: 'settings', v: JSON.stringify({ llmApiKey: 'SECRET', llmModel: 'llama3.2' }) },
    ],
    srs: [{ id: 'vocab:x', kind: 'vocab', state: 'LEARNING', ease: 2.5, interval: 1, due: 1, reps: 1, lapses: 0, last_seen: 1, avg_ms: 100 }],
    activity: [{ id: 1, ts: 1, day: '2026-10-12', skill: 'speaking', seconds: 120, detail: null }],
  };

  it('round-trips and never exports the API key', () => {
    const b = buildBackup(rows, '0.3.0', new Date('2026-10-12T10:00:00Z'));
    expect(JSON.stringify(b)).not.toContain('SECRET');
    const v = validateBackup(JSON.parse(JSON.stringify(b)));
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.file.tables.srs).toHaveLength(1);
      expect(summarize(v.file)).toMatchObject({ cards: 1, minutes: 2 });
      for (const t of BACKUP_TABLES) expect(Array.isArray(v.file.tables[t])).toBe(true);
    }
  });

  it('rejects foreign, newer and corrupted files', () => {
    expect(validateBackup(null).ok).toBe(false);
    expect(validateBackup({ app: 'other', schema: 1, tables: {} }).ok).toBe(false);
    expect(validateBackup({ app: 'my-english-coach', schema: 999, tables: {} }).ok).toBe(false);
    expect(validateBackup({ app: 'my-english-coach', schema: 1, tables: { srs: 'oops' } }).ok).toBe(false);
    expect(validateBackup({ app: 'my-english-coach', schema: 1, tables: { srs: [{ id: { nested: 1 } }] } }).ok).toBe(false);
  });

  it('drops unknown columns so a crafted file cannot inject any', () => {
    const v = validateBackup({
      app: 'my-english-coach',
      schema: 1,
      tables: { saved: [{ id: 'a', kind: 'vocab', ref: 'x', ts: 1, evil: 'DROP TABLE kv' }] },
    });
    expect(v.ok).toBe(true);
    if (v.ok) expect(Object.keys(v.file.tables.saved[0])).toEqual(['id', 'kind', 'ref', 'ts']);
  });
});

describe('SSE parser', () => {
  it('extracts tokens, keeps the partial line, detects DONE', () => {
    const a = parseSse('data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: {"choi');
    expect(a.tokens).toEqual(['Hel', 'lo']);
    expect(a.done).toBe(false);
    expect(a.rest).toBe('data: {"choi');
    const b = parseSse(a.rest + 'ces":[{"delta":{"content":"!"}}]}\n\ndata: [DONE]\n');
    expect(b.tokens).toEqual(['!']);
    expect(b.done).toBe(true);
  });

  it('ignores comments, role-only deltas and bad JSON', () => {
    const r = parseSse(': ping\ndata: {"choices":[{"delta":{"role":"assistant"}}]}\ndata: not json\ndata: {"choices":[{"delta":{"content":"ok"}}]}\n');
    expect(r.tokens).toEqual(['ok']);
  });
});

describe('automatic update check schedule', () => {
  it('checks when never checked, after 24 h, or if the clock went backwards', () => {
    const now = 1_000_000_000_000;
    expect(shouldCheck(null, now)).toBe(true);
    expect(shouldCheck(now - UPDATE_CHECK_INTERVAL_MS, now)).toBe(true);
    expect(shouldCheck(now - 1000, now)).toBe(false);
    expect(shouldCheck(now + 5000, now)).toBe(true);
  });
});

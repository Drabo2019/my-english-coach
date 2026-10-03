import { newCard } from '@/features/srs';
import type { Profile, Skill, SrsCard, UserMistake } from '@/types';
import { dayKey, getDb, kvGet, kvSet } from './db';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS, type Settings } from './defaults';

export { DEFAULT_PROFILE, DEFAULT_SETTINGS, type Settings };

export const getProfile = async (): Promise<Profile> => ({ ...DEFAULT_PROFILE, ...(await kvGet('profile', {})) });
export const setProfile = (p: Profile) => kvSet('profile', p);
export const getSettings = async (): Promise<Settings> => ({ ...DEFAULT_SETTINGS, ...(await kvGet('settings', {})) });
export const setSettings = (s: Settings) => kvSet('settings', s);

// ---------- SRS ----------
type SrsRow = {
  id: string; kind: SrsCard['kind']; state: SrsCard['state']; ease: number; interval: number;
  due: number; reps: number; lapses: number; last_seen: number; avg_ms: number;
};
const toCard = (r: SrsRow): SrsCard => ({
  id: r.id, kind: r.kind, state: r.state, ease: r.ease, interval: r.interval, due: r.due,
  reps: r.reps, lapses: r.lapses, lastSeen: r.last_seen, avgMs: r.avg_ms,
});

export async function saveCard(c: SrsCard) {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO srs (id,kind,state,ease,interval,due,reps,lapses,last_seen,avg_ms) VALUES (?,?,?,?,?,?,?,?,?,?)',
    c.id, c.kind, c.state, c.ease, c.interval, c.due, c.reps, c.lapses, c.lastSeen, c.avgMs,
  );
}
export async function getCard(id: string, kind: SrsCard['kind']): Promise<SrsCard> {
  const db = await getDb();
  const r = await db.getFirstAsync<SrsRow>('SELECT * FROM srs WHERE id = ?', id);
  return r ? toCard(r) : newCard(id, kind);
}
export async function allCards(): Promise<SrsCard[]> {
  const db = await getDb();
  return (await db.getAllAsync<SrsRow>('SELECT * FROM srs')).map(toCard);
}
export async function dueCards(limit = 50): Promise<SrsCard[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SrsRow>(
    "SELECT * FROM srs WHERE state != 'NEW' AND due <= ? ORDER BY due ASC LIMIT ?",
    Date.now(), limit,
  );
  return rows.map(toCard);
}

// ---------- Mistakes ----------
type MistakeRow = {
  id: string; category: string; original: string; correction: string; explanation: string;
  frequency: number; last_occurrence: number; severity: 1 | 2 | 3;
};
export async function recordMistake(m: Omit<UserMistake, 'id' | 'frequency' | 'lastOccurrence'>) {
  const db = await getDb();
  const id = `${m.category}:${m.correction.toLowerCase()}`;
  const ex = await db.getFirstAsync<{ frequency: number }>('SELECT frequency FROM mistakes WHERE id = ?', id);
  if (ex) {
    await db.runAsync('UPDATE mistakes SET frequency = frequency + 1, last_occurrence = ?, original = ? WHERE id = ?', Date.now(), m.original, id);
  } else {
    await db.runAsync(
      'INSERT INTO mistakes (id,category,original,correction,explanation,frequency,last_occurrence,severity) VALUES (?,?,?,?,?,1,?,?)',
      id, m.category, m.original, m.correction, m.explanation, Date.now(), m.severity,
    );
  }
}
export async function topMistakes(limit = 20): Promise<UserMistake[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MistakeRow>('SELECT * FROM mistakes ORDER BY frequency DESC, last_occurrence DESC LIMIT ?', limit);
  return rows.map((r) => ({
    id: r.id, category: r.category, original: r.original, correction: r.correction,
    explanation: r.explanation, frequency: r.frequency, lastOccurrence: r.last_occurrence, severity: r.severity,
  }));
}

// ---------- Activity ----------
export async function logActivity(skill: Skill | 'review' | 'conversation', seconds: number, detail?: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO activity (ts,day,skill,seconds,detail) VALUES (?,?,?,?,?)', Date.now(), dayKey(), skill, Math.round(seconds), detail ?? null);
}
export async function minutesToday(): Promise<number> {
  const db = await getDb();
  const r = await db.getFirstAsync<{ s: number | null }>('SELECT SUM(seconds) s FROM activity WHERE day = ?', dayKey());
  return Math.round((r?.s ?? 0) / 60);
}
export async function secondsBySkill(sinceDays = 7): Promise<Record<string, number>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ skill: string; s: number }>(
    'SELECT skill, SUM(seconds) s FROM activity WHERE ts >= ? GROUP BY skill', Date.now() - sinceDays * 86_400_000,
  );
  return Object.fromEntries(rows.map((r) => [r.skill, r.s]));
}
export async function totalSeconds(): Promise<number> {
  const db = await getDb();
  const r = await db.getFirstAsync<{ s: number | null }>('SELECT SUM(seconds) s FROM activity');
  return r?.s ?? 0;
}
export async function streakDays(): Promise<number> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ day: string }>('SELECT DISTINCT day FROM activity ORDER BY day DESC LIMIT 400');
  const days = new Set(rows.map((r) => r.day));
  let n = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1); // today not done yet: don't break the streak
  while (days.has(dayKey(d.getTime()))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

// ---------- Conversation ----------
export async function addTurn(session: string, role: 'user' | 'ai', text: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO convo (session,ts,role,text) VALUES (?,?,?,?)', session, Date.now(), role, text);
}

// ---------- Feedback (REAL USER TEST) ----------
export async function addFeedback(screen: string, kind: string, note?: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO feedback (ts,screen,kind,note) VALUES (?,?,?,?)', Date.now(), screen, kind, note ?? null);
}
export async function allFeedback() {
  const db = await getDb();
  return db.getAllAsync<{ ts: number; screen: string; kind: string; note: string | null }>('SELECT * FROM feedback ORDER BY ts DESC');
}

// ---------- Saved (My English) ----------
export async function toggleSaved(kind: string, ref: string): Promise<boolean> {
  const db = await getDb();
  const id = `${kind}:${ref}`;
  const ex = await db.getFirstAsync('SELECT id FROM saved WHERE id = ?', id);
  if (ex) {
    await db.runAsync('DELETE FROM saved WHERE id = ?', id);
    return false;
  }
  await db.runAsync('INSERT INTO saved (id,kind,ref,ts) VALUES (?,?,?,?)', id, kind, ref, Date.now());
  return true;
}
export async function isSaved(kind: string, ref: string): Promise<boolean> {
  const db = await getDb();
  return !!(await db.getFirstAsync('SELECT id FROM saved WHERE id = ?', `${kind}:${ref}`));
}
export async function allSaved() {
  const db = await getDb();
  return db.getAllAsync<{ id: string; kind: string; ref: string; ts: number }>('SELECT * FROM saved ORDER BY ts DESC');
}

// ---------- Scores (weekly checks / level estimation) ----------
export async function addScore(skill: Skill, score: number, source: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO scores (ts,skill,score,source) VALUES (?,?,?,?)', Date.now(), skill, score, source);
}
export async function recentScores(skill: Skill, n = 10) {
  const db = await getDb();
  return db.getAllAsync<{ ts: number; score: number; source: string }>('SELECT ts,score,source FROM scores WHERE skill = ? ORDER BY ts DESC LIMIT ?', skill, n);
}

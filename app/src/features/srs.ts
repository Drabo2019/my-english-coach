import type { SrsCard, SrsState } from '@/types';

export type Grade = 0 | 1 | 2 | 3; // again, hard, good, easy
const DAY = 86_400_000;
const MIN = 60_000;

export function newCard(id: string, kind: SrsCard['kind']): SrsCard {
  return { id, kind, state: 'NEW', ease: 2.5, interval: 0, due: Date.now(), reps: 0, lapses: 0, lastSeen: 0, avgMs: 0 };
}

function stateFor(c: SrsCard, produced: boolean): SrsState {
  if (c.reps === 0) return 'NEW';
  if (c.interval < 3) return 'LEARNING';
  if (c.interval < 10) return 'FAMILIAR';
  // ACTIVE / MASTERED require that the item was produced (spoken/typed), not just recognised.
  if (!produced) return 'FAMILIAR';
  return c.interval < 30 ? 'ACTIVE' : 'MASTERED';
}

/** SM-2 variant. Slow answers (>8s) downgrade a "good" to "hard"; production is required for ACTIVE/MASTERED. */
export function review(card: SrsCard, grade: Grade, ms: number, produced: boolean, now = Date.now()): SrsCard {
  const c = { ...card };
  let g = grade;
  if (g === 2 && ms > 8000) g = 1;
  c.avgMs = c.reps === 0 ? ms : c.avgMs * 0.7 + ms * 0.3;
  c.lastSeen = now;
  c.reps += 1;

  if (g === 0) {
    c.lapses += 1;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.interval = 0;
    c.due = now + 10 * MIN;
    c.state = card.reps >= 3 ? 'NEEDS_REVIEW' : 'LEARNING';
    return c;
  }
  if (g === 1) c.ease = Math.max(1.3, c.ease - 0.05);
  if (g === 3) c.ease += 0.1;

  const prev = card.interval;
  if (prev < 1) c.interval = g === 3 ? 3 : 1;
  else if (prev < 3 && card.reps <= 1) c.interval = 3;
  else c.interval = Math.max(prev + 1, prev * c.ease * (g === 1 ? 0.8 : g === 3 ? 1.3 : 1));
  c.interval = Math.round(c.interval * 10) / 10;
  c.due = now + c.interval * DAY;
  c.state = stateFor(c, produced);
  return c;
}

export const isDifficult = (c: SrsCard) => c.lapses >= 2 || c.state === 'NEEDS_REVIEW';

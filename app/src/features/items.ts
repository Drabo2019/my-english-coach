import { SENTENCES } from '@/data/sentences';
import { VOCAB } from '@/data/vocabulary';
import { LEVELS, type Level, type Profile, type SrsCard } from '@/types';

export interface ReviewItem {
  cardId: string;
  kind: 'vocab' | 'sentence';
  promptFr: string; // what the learner sees
  hint?: string;
  answerEn: string; // what the learner should produce
  example?: string;
  ipa?: string;
}

export function itemFor(c: Pick<SrsCard, 'id' | 'kind'>): ReviewItem | null {
  if (c.kind === 'vocab') {
    const v = VOCAB.find((x) => `vocab:${x.id}` === c.id);
    if (!v) return null;
    return {
      cardId: c.id, kind: 'vocab', promptFr: v.fr.join(' / '), hint: v.pos, answerEn: v.word,
      example: v.examples[0]?.en, ipa: v.ipa,
    };
  }
  const s = SENTENCES.find((x) => `sent:${x.id}` === c.id);
  if (!s) return null;
  return { cardId: c.id, kind: 'sentence', promptFr: s.fr, answerEn: s.en, hint: s.grammar };
}

const idx = (l: Level) => LEVELS.indexOf(l);

/** Next unseen cards, around the learner's level (slightly below → slightly above). */
export function pickNew(profile: Profile, seen: Set<string>, n: number): { id: string; kind: 'vocab' | 'sentence' }[] {
  const target = Math.round((profile.levels.vocabulary + profile.levels.speaking) / 2);
  const score = (l: Level) => Math.abs(idx(l) - target - 0.3);
  const pool = [
    ...VOCAB.map((v) => ({ id: `vocab:${v.id}`, kind: 'vocab' as const, s: score(v.level) })),
    ...SENTENCES.map((x) => ({ id: `sent:${x.id}`, kind: 'sentence' as const, s: score(x.level) + 0.2 })),
  ]
    .filter((x) => !seen.has(x.id))
    .sort((a, b) => a.s - b.s + (Math.random() - 0.5) * 0.8);
  return pool.slice(0, n);
}

export const norm = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();

/** 0..1 word overlap between what the learner produced and the target. */
export function similarity(a: string, b: string): number {
  const A = norm(a).split(' ').filter(Boolean);
  const B = norm(b).split(' ').filter(Boolean);
  if (!A.length || !B.length) return 0;
  const set = new Set(A);
  const hit = B.filter((w) => set.has(w)).length;
  return hit / Math.max(B.length, A.length);
}

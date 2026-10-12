import { describe, expect, it } from 'vitest';

import { LISTENING, READING } from '@/data/content';
import { GRAMMAR } from '@/data/grammar';
import { findPhrase, PHRASEBOOK } from '@/data/phrasebook';
import { FIND_WORDS, SCENARIOS } from '@/data/scenarios';
import { SENTENCES } from '@/data/sentences';
import { VOCAB } from '@/data/vocabulary';
import { analyze } from '@/features/corrector';
import { norm, similarity } from '@/features/items';
import { applyPlacement, estimate, PLACEMENT } from '@/features/placement';
import { buildPlan } from '@/features/plan';
import { newCard, review } from '@/features/srs';
import { DEFAULT_PROFILE } from '@/services/storage/defaults';
import { compareVersions } from '@/services/updates/version';
import { LEVELS } from '@/types';

describe('content integrity', () => {
  it('vocab ids are unique and complete', () => {
    const ids = VOCAB.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const v of VOCAB) {
      expect(Boolean(v.word && v.ipa && v.fr.length && v.examples.length), v.id).toBe(true);
      expect(LEVELS).toContain(v.level);
    }
  });
  it('sentence ids unique, levels valid', () => {
    expect(new Set(SENTENCES.map((s) => s.id)).size).toBe(SENTENCES.length);
    for (const s of SENTENCES) expect(LEVELS).toContain(s.level);
  });
  it('quiz answers point to an option', () => {
    for (const g of GRAMMAR) for (const e of g.exercises) expect(e.answer, g.id).toBeLessThan(e.options.length);
    for (const r of READING) for (const q of r.questions) expect(q.answer, r.id).toBeLessThan(q.options.length);
    for (const l of LISTENING) for (const q of l.questions) expect(q.answer, l.id).toBeLessThan(q.options.length);
    for (const p of PLACEMENT) expect(p.answer, p.id).toBeLessThan(p.options.length);
  });
  it('scenarios have scripts and find-words have 3 hints', () => {
    for (const s of SCENARIOS) expect(s.script.length, s.id).toBeGreaterThan(1);
    for (const f of FIND_WORDS) expect(f.hints).toHaveLength(3);
  });
});

describe('content volume (regression guard)', () => {
  it('does not shrink below the 0.2 baseline', () => {
    expect(VOCAB.length).toBeGreaterThanOrEqual(300);
    expect(SENTENCES.length).toBeGreaterThanOrEqual(500);
    expect(GRAMMAR.length).toBeGreaterThanOrEqual(25);
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(20);
    expect(LISTENING.length).toBeGreaterThanOrEqual(20);
    expect(READING.length).toBeGreaterThanOrEqual(20);
  });
  it('frozen core ids are unchanged', () => {
    expect(SENTENCES[0].id).toBe('s0001');
    expect(SENTENCES.find((x) => x.en === 'I bought some apples yesterday.')?.id).toBe('s0001');
    expect(VOCAB.find((x) => x.word === 'get')?.id).toBe('modern-get');
  });
});

describe('SRS', () => {
  it('lapse resets interval and keeps card due soon', () => {
    let c = review(newCard('x', 'vocab'), 2, 2000, true, 0);
    c = review(c, 0, 2000, true, 1000);
    expect(c.interval).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.due).toBeLessThan(1000 + 3_600_000);
  });
  it('intervals grow on success and require production for ACTIVE', () => {
    let a = newCard('a', 'vocab');
    let b = newCard('b', 'vocab');
    for (let i = 0; i < 6; i++) {
      a = review(a, 2, 1500, true);
      b = review(b, 2, 1500, false);
    }
    expect(a.interval).toBeGreaterThan(5);
    expect(['ACTIVE', 'MASTERED']).toContain(a.state);
    expect(b.state).toBe('FAMILIAR');
  });
  it('slow "good" is downgraded to hard', () => {
    const fast = review(newCard('f', 'vocab'), 2, 1000, true);
    const slow = review(newCard('s', 'vocab'), 2, 20000, true);
    expect(slow.ease).toBeLessThan(fast.ease);
  });
});

describe('corrector', () => {
  const fixes = (t: string) => analyze(t).map((f) => f.correction.toLowerCase());
  it('catches classic French-speaker errors', () => {
    expect(fixes('I am agree with you')).toContain('i agree');
    expect(fixes('I have 40 years')).toContain('i am 40 years old');
    expect(fixes('Yesterday I go to work')[0]).toContain('went');
    expect(fixes('He work here')).toContain('he works');
    expect(fixes('I need some informations')).toContain('information');
    expect(fixes('I work here since 3 years')).toContain('for 3 years');
    expect(fixes('I must to go')).toContain('must go');
    expect(fixes('She is engineer')).toContain('she is an engineer');
    expect(fixes('Where you are going?')).toContain('where are you');
  });
  it('does not flag correct sentences', () => {
    for (const s of ['I agree with you', 'Yesterday I went to work', 'He works here', 'I am 40 years old', 'I have to go', 'She has a car', 'Can you show me where we are?', 'I don’t know what they want']) {
      expect(analyze(s), s).toHaveLength(0);
    }
  });
  it('does not flag any seed sentence', () => {
    for (const s of SENTENCES) expect(analyze(s.en), s.en).toHaveLength(0);
  });
});

describe('phrasebook', () => {
  it('finds the flagship example', () => {
    expect(findPhrase('Je vais vérifier et je te tiens au courant')?.entry.natural).toBe('I’ll check and get back to you.');
  });
  it('returns null on unrelated text', () => {
    expect(findPhrase('xylophone quantique saucisse')).toBeNull();
  });
  it('every entry resolves to itself', () => {
    for (const p of PHRASEBOOK) expect(findPhrase(p.fr)?.entry.fr).toBe(p.fr);
  });
});

describe('similarity, placement, plan, versions', () => {
  it('norm/similarity', () => {
    expect(norm('I’ll  check!')).toBe("i'll check");
    expect(similarity('i will check', 'I’ll check')).toBeGreaterThan(0.3);
    expect(similarity('', 'x')).toBe(0);
  });
  it('placement estimate is monotonic with correctness', () => {
    const all = Object.fromEntries(PLACEMENT.map((p) => [p.id, true]));
    const none = Object.fromEntries(PLACEMENT.map((p) => [p.id, false]));
    expect(estimate('grammar', all)!).toBeGreaterThan(estimate('grammar', none)!);
    const p = applyPlacement(DEFAULT_PROFILE, all, [80, 90], 'low');
    expect(p.levels.speaking).toBeLessThanOrEqual(p.levels.listening);
  });
  it('plan favours speaking when speaking is the weakness, and fits the time budget', () => {
    const profile = { ...DEFAULT_PROFILE, minutesPerDay: 15, levels: { ...DEFAULT_PROFILE.levels, grammar: 3, vocabulary: 3, speaking: 1 } };
    const plan = buildPlan({ profile, dueCount: 12, difficultCount: 2, minutesDoneToday: 0 });
    expect(plan.map((b) => b.key)).toContain('speak');
    expect(plan.reduce((a, b) => a + b.minutes, 0)).toBe(15);
  });
  it('compareVersions', () => {
    expect(compareVersions('0.2.0', '0.1.9')).toBeGreaterThan(0);
    expect(compareVersions('v1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('0.1.0', '0.1.1')).toBeLessThan(0);
  });
});

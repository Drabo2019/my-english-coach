import type { Profile, Skill, UserMistake } from '@/types';
import { overallIndex } from './placement';

export interface PlanBlock {
  key: string;
  title: string;
  minutes: number;
  route: string;
  why: string;
}

export interface PlanInput {
  profile: Profile;
  dueCount: number;
  difficultCount: number;
  topMistake?: UserMistake;
  minutesDoneToday: number;
}

/** Candidate activities and the skill each one trains. */
const ACTIVITIES: { key: string; title: string; skill: Skill | 'review'; route: string }[] = [
  { key: 'review', title: 'Review', skill: 'review', route: '/review' },
  { key: 'speak', title: 'Speaking', skill: 'speaking', route: '/speak/free' },
  { key: 'sentences', title: 'Sentence building', skill: 'speaking', route: '/learn/sentences' },
  { key: 'vocabulary', title: 'Vocabulary', skill: 'vocabulary', route: '/learn/vocabulary' },
  { key: 'listening', title: 'Listening', skill: 'listening', route: '/learn/listening' },
  { key: 'grammar', title: 'Grammar', skill: 'grammar', route: '/learn/grammar' },
  { key: 'pronunciation', title: 'Pronunciation', skill: 'pronunciation', route: '/speak/pronunciation' },
  { key: 'reading', title: 'Reading', skill: 'reading', route: '/learn/reading' },
  { key: 'writing', title: 'Writing', skill: 'writing', route: '/learn/writing' },
];

export function buildPlan(inp: PlanInput): PlanBlock[] {
  const { profile, dueCount } = inp;
  const avg = overallIndex(profile.levels);
  const total = Math.max(2, profile.minutesPerDay - inp.minutesDoneToday);

  const scored = ACTIVITIES.map((a) => {
    let w: number;
    let why: string;
    if (a.skill === 'review') {
      w = dueCount === 0 ? 0 : 1 + Math.min(2, dueCount / 10) + inp.difficultCount * 0.1;
      why = dueCount ? `${dueCount} items due` : '';
    } else {
      const gap = Math.max(0, avg - profile.levels[a.skill]);
      w = 1 + gap * 0.8;
      why = gap > 0.15 ? `${a.skill} is below your average` : 'keep it warm';
    }
    // Spoken fluency is the declared priority: always favour speaking activities.
    if (a.key === 'speak') {
      w += 1.2;
      why = profile.levels.speaking < profile.levels.grammar ? 'you know more than you can say yet' : 'daily speaking time';
    }
    if (a.key === 'sentences') w += 0.6;
    return { ...a, w, why };
  }).filter((a) => a.w > 0);

  scored.sort((a, b) => b.w - a.w);
  // 1 block per ~4 minutes, between 1 and 5 blocks
  const n = Math.max(1, Math.min(5, Math.round(total / 4)));
  const chosen = scored.slice(0, n);
  const wSum = chosen.reduce((a, b) => a + b.w, 0);
  let left = total;
  const blocks: PlanBlock[] = chosen.map((c, i) => {
    const m = i === chosen.length - 1 ? left : Math.max(1, Math.round((c.w / wSum) * total));
    left -= m;
    return { key: c.key, title: c.title, minutes: Math.max(1, m), route: c.route, why: c.why };
  });
  if (inp.topMistake && blocks.length) {
    const g = blocks.find((b) => b.key === 'grammar');
    if (g) g.why = `your frequent mistake: “${inp.topMistake.original}” → “${inp.topMistake.correction}”`;
  }
  return blocks;
}

/** 5-minute express session: 1 min each. */
export const FIVE_MINUTES: PlanBlock[] = [
  { key: 'vocabulary', title: '1 min vocabulary', minutes: 1, route: '/review', why: '' },
  { key: 'listening', title: '1 min listening', minutes: 1, route: '/learn/listening', why: '' },
  { key: 'sentences', title: '1 min sentence building', minutes: 1, route: '/learn/sentences', why: '' },
  { key: 'speak', title: '1 min speaking', minutes: 1, route: '/speak/find-words', why: '' },
  { key: 'review', title: '1 min review', minutes: 1, route: '/review', why: '' },
];

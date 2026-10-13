import { LEVELS, SKILLS, type Level, type Profile, type Skill } from '@/types';

export interface PlacementItem {
  id: string;
  skill: Skill;
  level: Level;
  prompt: string;
  audio?: string; // text played via TTS
  options: string[];
  answer: number;
}

const L = (l: Level) => l;

export const PLACEMENT: PlacementItem[] = [
  // vocabulary (recognition)
  { id: 'v1', skill: 'vocabulary', level: L('A1'), prompt: 'Which word means "pomme" ?', options: ['apple', 'bread', 'water'], answer: 0 },
  { id: 'v2', skill: 'vocabulary', level: L('A2'), prompt: '"borrow" means…', options: ['prêter', 'emprunter', 'oublier'], answer: 1 },
  { id: 'v3', skill: 'vocabulary', level: L('B1'), prompt: '"deadline" means…', options: ['date limite', 'ligne de départ', 'retard'], answer: 0 },
  { id: 'v4', skill: 'vocabulary', level: L('B2'), prompt: 'Choose the closest meaning of "reliable".', options: ['dependable', 'expensive', 'temporary'], answer: 0 },
  { id: 'v5', skill: 'vocabulary', level: L('C1'), prompt: '"to put off" a meeting means to…', options: ['cancel it forever', 'postpone it', 'start it early'], answer: 1 },
  { id: 'v6', skill: 'vocabulary', level: L('C1'), prompt: '"Her argument is compelling." means her argument is…', options: ['convincing', 'confusing', 'compulsory'], answer: 0 },
  { id: 'v7', skill: 'vocabulary', level: L('C2'), prompt: '"Fame can be ephemeral." means fame can be…', options: ['dangerous', 'short-lived', 'undeserved'], answer: 1 },
  // grammar
  { id: 'g1', skill: 'grammar', level: L('A1'), prompt: 'She ___ a teacher.', options: ['is', 'are', 'have'], answer: 0 },
  { id: 'g2', skill: 'grammar', level: L('A2'), prompt: 'Yesterday I ___ to the cinema.', options: ['go', 'went', 'gone'], answer: 1 },
  { id: 'g3', skill: 'grammar', level: L('A2'), prompt: 'I ___ here since 2020.', options: ['work', 'am working', 'have worked'], answer: 2 },
  { id: 'g4', skill: 'grammar', level: L('B1'), prompt: 'If it rains tomorrow, we ___ at home.', options: ['stay', 'will stay', 'would stay'], answer: 1 },
  { id: 'g5', skill: 'grammar', level: L('B2'), prompt: 'If I ___ more time, I would learn Spanish.', options: ['have', 'had', 'will have'], answer: 1 },
  { id: 'g6', skill: 'grammar', level: L('B2'), prompt: 'The report ___ by the time you arrive.', options: ['will have been finished', 'will finish', 'finishes'], answer: 0 },
  { id: 'g7', skill: 'grammar', level: L('C1'), prompt: 'Not only ___ the deadline, they also exceeded the budget.', options: ['they missed', 'did they miss', 'they did miss'], answer: 1 },
  { id: 'g8', skill: 'grammar', level: L('C1'), prompt: 'If I had accepted the job, I ___ in Berlin now.', options: ['would have lived', 'would be living', 'will live'], answer: 1 },
  { id: 'g9', skill: 'grammar', level: L('C2'), prompt: '___ it not been for your help, we would have failed.', options: ['Had', 'Were', 'Should'], answer: 0 },
  // reading
  { id: 'r1', skill: 'reading', level: L('A2'), prompt: '"Tom is late because the bus was late." Why is Tom late?', options: ['He was ill', 'The bus was late', 'He forgot'], answer: 1 },
  { id: 'r2', skill: 'reading', level: L('B1'), prompt: '"The test was postponed since a component failed." What happened?', options: ['The test was done early', 'The test was moved to later', 'The test was cancelled by the client'], answer: 1 },
  { id: 'r3', skill: 'reading', level: L('B2'), prompt: '"Despite the setbacks, the team remained optimistic." The team was…', options: ['discouraged', 'hopeful', 'angry'], answer: 1 },
  { id: 'r4', skill: 'reading', level: L('C1'), prompt: '"The minister stopped short of apologising." The minister…', options: ['apologised fully', 'came close to apologising but did not', 'refused to speak'], answer: 1 },
  { id: 'r5', skill: 'reading', level: L('C2'), prompt: '"His reticence was hardly surprising, given the circumstances." His reticence was…', options: ['unexpected', 'understandable', 'aggressive'], answer: 1 },
  // listening (audio via TTS)
  { id: 'l1', skill: 'listening', level: L('A1'), audio: 'My name is Anna and I am from Canada.', prompt: 'Where is Anna from?', options: ['Canada', 'England', 'Spain'], answer: 0 },
  { id: 'l2', skill: 'listening', level: L('A2'), audio: 'The train to London leaves at half past seven from platform four.', prompt: 'What time does the train leave?', options: ['7:00', '7:30', '4:30'], answer: 1 },
  { id: 'l3', skill: 'listening', level: L('B1'), audio: 'I’m afraid I can’t make the meeting because my flight has been cancelled.', prompt: 'Why can’t the speaker come?', options: ['A flight was cancelled', 'They are ill', 'They are busy'], answer: 0 },
  { id: 'l4', skill: 'listening', level: L('B2'), audio: 'To be honest, I’m not entirely convinced the schedule is realistic, given how much testing is left.', prompt: 'What is the speaker’s attitude?', options: ['Doubtful', 'Enthusiastic', 'Indifferent'], answer: 0 },
  { id: 'l5', skill: 'listening', level: L('C1'), audio: 'I take your point, but I’d be wary of cutting the testing phase. It came back to bite us last year.', prompt: 'What does the speaker think?', options: ['Cutting testing is risky', 'Testing is too slow', 'Last year went well'], answer: 0 },
  { id: 'l6', skill: 'listening', level: L('C2'), audio: 'It isn’t that I’m opposed to it as such; it’s rather that I can’t see how it squares with what we told the board.', prompt: 'What is the speaker’s problem with the idea?', options: ['They dislike it in principle', 'It seems inconsistent with earlier commitments', 'It costs too much'], answer: 1 },
];

export const PLACEMENT_SPEAK: { id: string; level: Level; prompt: string; target: string }[] = [
  { id: 'sp1', level: 'A1', prompt: 'Repeat: ', target: 'My name is Marc and I live in France.' },
  { id: 'sp2', level: 'A2', prompt: 'Repeat: ', target: 'Could you tell me where the station is?' },
  { id: 'sp3', level: 'B1', prompt: 'Repeat: ', target: 'I’ll check the results and get back to you tomorrow.' },
  { id: 'sp4', level: 'C1', prompt: 'Repeat: ', target: 'I take your point, but I’m not entirely convinced the timeline is realistic.' },
];

export type Answers = Record<string, boolean>;

/** Weighted accuracy on the tested range → fractional index into LEVELS (0 = Pre-A1). */
export function estimate(skill: Skill, answers: Answers): number | null {
  const items = PLACEMENT.filter((i) => i.skill === skill && i.id in answers);
  if (!items.length) return null;
  // Highest level the learner "passes": at least half right at that level AND at least 60 % right on
  // everything up to it (so a lucky guess high up does not count). The next level adds a fraction.
  const levels = [...new Set(items.map((i) => LEVELS.indexOf(i.level)))].sort((a, b) => a - b);
  const ratio = (pred: (idx: number) => boolean) => {
    const sel = items.filter((i) => pred(LEVELS.indexOf(i.level)));
    return sel.length ? sel.filter((i) => answers[i.id]).length / sel.length : 0;
  };
  let passed = -1;
  for (const lv of levels) {
    if (ratio((x) => x === lv) >= 0.5 && ratio((x) => x <= lv) >= 0.6) passed = lv;
  }
  const next = levels.find((lv) => lv > passed);
  const base = passed < 0 ? 0 : passed;
  const extra = next === undefined ? 0 : ratio((x) => x === next);
  return Math.min(6, Math.round((base + extra) * 10) / 10);
}

export function applyPlacement(base: Profile, answers: Answers, speakScores: number[], confidence: Profile['confidence']): Profile {
  const levels = { ...base.levels };
  for (const s of ['vocabulary', 'grammar', 'reading', 'listening'] as Skill[]) {
    const e = estimate(s, answers);
    if (e !== null) levels[s] = e;
  }
  if (speakScores.length) {
    const avg = speakScores.reduce((a, b) => a + b, 0) / speakScores.length; // 0..100
    levels.pronunciation = Math.round((avg / 100) * 4 * 10) / 10;
    // speaking can't be better than what the learner understands; start from pronunciation + comprehension
    levels.speaking = Math.round(Math.min(levels.pronunciation + 0.5, levels.listening) * 10) / 10;
  }
  levels.writing = Math.round(((levels.grammar + levels.vocabulary) / 2) * 10) / 10;
  return { ...base, levels, confidence };
}

export const levelLabel = (idx: number): Level => LEVELS[Math.max(0, Math.min(6, Math.round(idx)))];

export function overallIndex(levels: Profile['levels']): number {
  return SKILLS.reduce((a, s) => a + levels[s], 0) / SKILLS.length;
}

export function weaknesses(levels: Profile['levels']): Skill[] {
  const avg = overallIndex(levels);
  return [...SKILLS].filter((s) => levels[s] < avg - 0.15).sort((a, b) => levels[a] - levels[b]);
}

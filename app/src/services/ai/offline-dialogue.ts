// Offline conversation partner: no model, so it must at least *listen*. It recognises a few intents
// (a question to the partner, "what do you mean?", a one-word answer…) and answers those properly, then
// keeps the conversation moving without repeating itself. Pure functions, unit-tested.

export type Intent = 'greeting' | 'clarify' | 'why-ask' | 'about-you' | 'dont-know' | 'short' | 'statement';

interface T {
  role: 'ai' | 'user';
  text: string;
}

const clean = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();

export function intentOf(text: string): Intent {
  const t = clean(text);
  if (!t) return 'short';
  if (
    /\b(what do you mean|what does (that|this) mean|i don'?t understand|i do not understand|didn'?t understand|(can|could) you (repeat|explain|say|rephrase)|say that again|come again)\b/.test(t) ||
    /^(what|sorry|pardon|sorry what|huh)$/.test(t)
  )
    return 'clarify';
  if (/\bwhy (do|did|are) you (ask|say)|why this question|why are you asking\b/.test(t)) return 'why-ask';
  if (/\b(how are you|how about you|what about you|and you|what do you (do|like|think)|are you (a|an|real|human|ai|robot)|who are you|your name)\b/.test(t)) return 'about-you';
  if (/^(hi|hello|hey|good (morning|afternoon|evening))( there| coach)?$/.test(t)) return 'greeting';
  if (/\b(i don'?t know|no idea|not sure|i can'?t say|nothing)\b/.test(t) && t.split(' ').length <= 5) return 'dont-know';
  if (t.split(' ').length <= 2) return 'short';
  return 'statement';
}

/** Intents that answer the learner but must not advance a scripted scenario. */
export const isMeta = (i: Intent) => i === 'clarify' || i === 'why-ask' || i === 'about-you' || i === 'greeting';

const REACTIONS = ['I see.', 'Right.', 'Okay.', 'That makes sense.', 'Interesting.', 'Nice.', 'Got it.', 'Fair enough.'];

const FOLLOW_UPS = [
  'Can you tell me a bit more about that?',
  'Why do you say that?',
  'What happened next?',
  'How do you feel about it?',
  'Could you give me an example?',
  'What is the most important part for you?',
  'Is that usual for you, or was it special?',
  'What would you change, if you could?',
];

/** Plain-English rephrasing of each follow-up, used when the learner asks "what do you mean?". */
const MEANING: Record<string, string> = {
  'Can you tell me a bit more about that?': 'I mean: add a few details, for example who, where or when.',
  'Why do you say that?': 'I mean: what is the reason for what you said?',
  'What happened next?': 'I mean: what happened after that?',
  'How do you feel about it?': 'I mean: are you happy, worried, excited, tired…?',
  'Could you give me an example?': 'I mean: a real situation that shows what you said.',
  'What is the most important part for you?': 'I mean: which part matters most to you?',
  'Is that usual for you, or was it special?': 'I mean: does this happen often, or only this time?',
  'What would you change, if you could?': 'I mean: is there something you would do differently?',
};

const STOP = new Set(
  'i you he she it we they a an the and or but so to of in on at for with from by is am are was were be been do does did have has had not no yes my your his her our their me him them this that these those there here what when where who why how can could would should will just very really also too more some any about than then as if because'.split(' '),
);

/** A content word from the learner's sentence, to show that we listened. */
export function keyWord(text: string): string | null {
  const words = clean(text).split(' ').filter((w) => w.length > 3 && !STOP.has(w));
  if (!words.length) return null;
  return words.reduce((a, b) => (b.length > a.length ? b : a));
}

const lastAi = (history: T[]) => [...history].reverse().find((t) => t.role === 'ai')?.text ?? '';

/** Picks a follow-up that has not been used yet in this conversation. */
function freshFollowUp(history: T[], offset: number): string {
  const used = new Set(history.filter((t) => t.role === 'ai').map((t) => t.text));
  const ordered = FOLLOW_UPS.map((_, k) => FOLLOW_UPS[(k + offset) % FOLLOW_UPS.length]);
  return ordered.find((f) => ![...used].some((u) => u.includes(f))) ?? ordered[0];
}

export interface DialogueInput {
  history: T[];
  scriptedNext?: string; // next line of the scenario script, if any
}

/**
 * history: includes the learner's latest turn as the last item.
 * Returns the partner's reply. `scriptedNext` is used for statements; meta intents answer first, then re-ask.
 */
export function offlineReply({ history, scriptedNext }: DialogueInput): string {
  const lastUser = [...history].reverse().find((t) => t.role === 'user')?.text ?? '';
  const intent = intentOf(lastUser);
  const userTurns = history.filter((t) => t.role === 'user').length;
  const prev = lastAi(history);
  const reask = scriptedNext ?? freshFollowUp(history, userTurns);
  const asked = FOLLOW_UPS.find((f) => prev.includes(f));
  const meaning = asked ? MEANING[asked] : undefined;

  switch (intent) {
    case 'clarify':
      if (meaning) return `Sorry, let me put it differently. ${meaning}`;
      return prev ? `Of course. Let me say it again: ${prev}` : 'Of course. Tell me about your day, in one or two sentences.';
    case 'why-ask':
      return `Good question. I ask because the goal is to make you speak: there are no wrong answers here. ${meaning ?? 'Just answer in your own words.'}`;
    case 'about-you':
      return `I’m doing well, thanks. I’m an offline practice partner, so I don’t have much to say about myself, but I’d like to hear about you. ${reask}`;
    case 'greeting':
      return `Hello! Nice to talk to you. ${reask}`;
    case 'dont-know':
      return `That’s okay, it happens. Try a simple sentence, for example: “I think…” or “It was…”. ${scriptedNext ?? 'What is the first thing that comes to mind?'}`;
    case 'short':
      return `Could you say a bit more? One more sentence is enough. ${scriptedNext ?? ''}`.trim();
    default: {
      const react = REACTIONS[userTurns % REACTIONS.length];
      const word = keyWord(lastUser);
      const echo = word && userTurns % 2 === 0 ? ` You mentioned “${word}”.` : '';
      return `${react}${echo} ${reask}`;
    }
  }
}

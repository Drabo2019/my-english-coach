import { itemFor } from '@/features/items';
import { kvGet, kvSet } from '../storage/db';
import { allCards, topMistakes } from '../storage/repo';
import type { Turn } from './index';

export interface MemoryItem {
  ts: number;
  topic: string;
  turns: number;
  summary: string;
  mistakes: string[];
}

const KEY = 'memory';
const MAX = 20;

export const loadMemory = () => kvGet<MemoryItem[]>(KEY, []);
export const clearMemory = () => kvSet(KEY, []);

export async function remember(item: MemoryItem) {
  const all = await loadMemory();
  await kvSet(KEY, [item, ...all].slice(0, MAX));
}

/** Heuristic summary used when no LLM is available: topic + what the learner talked about. */
export function offlineSummary(topic: string, history: Turn[]): string {
  const user = history.filter((t) => t.role === 'user').map((t) => t.text);
  const first = (user[0] ?? '').slice(0, 90);
  return `${topic}: ${user.length} turn${user.length === 1 ? '' : 's'}${first ? `, started with “${first}”` : ''}.`;
}

/** Compact text injected in the LLM system prompt so the partner "remembers" the learner. */
export async function memoryPrompt(): Promise<string> {
  const [mem, mistakes, cards] = await Promise.all([loadMemory(), topMistakes(3), allCards()]);
  const parts: string[] = [];
  if (mem.length) parts.push('Recent conversations: ' + mem.slice(0, 3).map((m) => m.summary).join(' | '));
  if (mistakes.length) parts.push('Frequent mistakes: ' + mistakes.map((m) => `“${m.original}” → “${m.correction}”`).join('; '));
  const hard = cards
    .filter((c) => c.lapses >= 2)
    .slice(0, 5)
    .map((c) => itemFor(c)?.answerEn)
    .filter(Boolean);
  if (hard.length) parts.push('Words the learner keeps forgetting: ' + hard.join(', '));
  return parts.join('\n');
}

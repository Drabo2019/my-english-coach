// Cloud providers rename and retire models regularly (Gemini 2.5 Flash is scheduled to be shut down in
// October 2026). Rather than trusting a hard-coded name, pick one from the list the service itself returns.

const bare = (id: string) => id.replace(/^models\//, '');

/** Variants that are not general chat models (or are cut-down / experimental). */
const NOT_CHAT = /(embed|image|tts|audio|live|vision|robotics|computer|learnlm|gemma|aqa|imagen|veo|exp\b|-exp|thinking|guard|whisper|moderation|safeguard|prompt-guard|distil)/i;

const version = (id: string): number => {
  const m = bare(id).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
};

/** Chat-capable models in the order they should be tried: newest stable flash first, then small fast ones, then the rest. */
export function rankModels(listed: string[], avoid: string[] = []): string[] {
  const skip = new Set(avoid.map(bare));
  const chat = listed.map(bare).filter((id) => !skip.has(id) && !NOT_CHAT.test(id));
  const rank = (a: string, b: string) => {
    const pa = /preview/i.test(a) ? 1 : 0;
    const pb = /preview/i.test(b) ? 1 : 0;
    if (pa !== pb) return pa - pb; // stable before preview
    return version(b) - version(a); // newer first
  };
  const flash = chat.filter((id) => /flash/i.test(id) && !/lite/i.test(id)).sort(rank);
  const instant = chat.filter((id) => !flash.includes(id) && /(instant|8b|mini|small|lite)/i.test(id)).sort(rank);
  const rest = chat.filter((id) => !flash.includes(id) && !instant.includes(id)).sort(rank);
  return [...flash, ...instant, ...rest];
}

/** The model to switch to when `current` is not offered at all (null = keep it). */
export function pickModel(listed: string[], current: string): string | null {
  if (!listed.length || listed.map(bare).includes(bare(current))) return null;
  return rankModels(listed)[0] ?? null;
}

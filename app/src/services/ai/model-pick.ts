// Cloud providers rename and retire models regularly (Gemini 2.5 Flash is scheduled to be shut down in
// October 2026). Rather than trusting a hard-coded name, pick one from the list the service itself returns.

const bare = (id: string) => id.replace(/^models\//, '');

/** Variants that are not general chat models (or are cut-down / experimental). */
const NOT_CHAT = /(embed|image|tts|audio|live|vision|robotics|computer|learnlm|gemma|aqa|imagen|veo|exp\b|-exp|thinking|guard|whisper|moderation|safeguard|prompt-guard|distil)/i;

const version = (id: string): number => {
  const m = bare(id).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
};

/**
 * Returns the model to use, or null to keep the current one.
 * Keeps `current` when the service lists it; otherwise prefers the newest stable "flash" (Gemini),
 * then a small fast Llama (Groq), then any chat-looking model.
 */
export function pickModel(listed: string[], current: string): string | null {
  const ids = listed.map(bare);
  if (!ids.length || ids.includes(current)) return null;
  const chat = ids.filter((id) => !NOT_CHAT.test(id));
  const rank = (a: string, b: string) => {
    const pa = /preview/i.test(a) ? 1 : 0;
    const pb = /preview/i.test(b) ? 1 : 0;
    if (pa !== pb) return pa - pb; // stable before preview
    return version(b) - version(a); // newer first
  };
  const flash = chat.filter((id) => /flash/i.test(id) && !/lite/i.test(id)).sort(rank);
  if (flash[0]) return flash[0];
  const instant = chat.filter((id) => /(instant|8b|mini|small)/i.test(id)).sort(rank);
  if (instant[0]) return instant[0];
  return chat.sort(rank)[0] ?? ids[0];
}

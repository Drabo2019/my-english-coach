// Pure parser for OpenAI-style streaming ("data: {json}\n\n"). Unit-tested.

export interface SseResult {
  tokens: string[];
  done: boolean;
  rest: string; // incomplete trailing line, keep for the next chunk
}

export function parseSse(buffer: string): SseResult {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  const tokens: string[] = [];
  let done = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith('data:')) continue;
    const payload = line.slice(5).trim();
    if (payload === '[DONE]') {
      done = true;
      continue;
    }
    try {
      const j = JSON.parse(payload);
      const t = j.choices?.[0]?.delta?.content ?? j.choices?.[0]?.message?.content;
      if (typeof t === 'string' && t.length) tokens.push(t);
    } catch {
      /* partial JSON from a proxy: ignore this line */
    }
  }
  return { tokens, done, rest };
}

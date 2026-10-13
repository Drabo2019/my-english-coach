import { analyze, type Finding } from '@/features/corrector';
import { findPhrase, type PhraseEntry } from '@/data/phrasebook';
import type { CorrectionMode, Profile, Scenario } from '@/types';
import { LEVELS } from '@/types';
import { fetch as streamFetch } from 'expo/fetch';

import { getSettings, type Settings } from '../storage/repo';
import { parseSse } from './sse';

export interface Turn {
  role: 'ai' | 'user';
  text: string;
}

export interface ReplyContext {
  scenario: Scenario | null; // null = free talk
  history: Turn[];
  profile: Profile;
  mode: CorrectionMode;
  memory?: string; // what the app remembers about the learner (see memory.ts)
}

export interface ReviewResult {
  findings: Finding[];
  natural: string; // natural version of the user's longest turn
  vocabTips: string[];
}

export interface ConversationAIProvider {
  readonly id: string;
  readonly online: boolean;
  reply(ctx: ReplyContext): Promise<string>;
  /** Same as reply() but calls onToken as text arrives (LLM only; others emit the whole text at once). */
  replyStream(ctx: ReplyContext, onToken: (partial: string) => void): Promise<string>;
  review(ctx: ReplyContext): Promise<ReviewResult>;
  howToSay(fr: string, profile: Profile): Promise<PhraseEntry | null>;
}

const levelName = (p: Profile) => LEVELS[Math.round((p.levels.speaking + p.levels.vocabulary) / 2)] ?? 'A2';

// ---------------------------------------------------------------------------------------------
// Offline provider: scripted scenarios + rule-based corrections + phrasebook. No network, no model.
// ---------------------------------------------------------------------------------------------
const REACTIONS = ['I see.', 'Right.', 'Okay.', 'That makes sense.', 'Interesting.', 'Nice.'];
const FOLLOW_UPS = [
  'Can you tell me a bit more about that?',
  'Why do you say that?',
  'What happened next?',
  'How do you feel about it?',
  'Could you give me an example?',
];

export const scriptedProvider: ConversationAIProvider = {
  id: 'offline-scripted',
  online: false,
  async reply({ scenario, history, mode }) {
    const userTurns = history.filter((t) => t.role === 'user').length;
    const react = REACTIONS[userTurns % REACTIONS.length];
    const next = scenario?.script[userTurns]?.ai;
    if (mode === 'strict') {
      const f = analyze(history[history.length - 1]?.text ?? '')[0];
      if (f) return `Quick fix: "${f.correction}". ${f.explanation}\n${next ?? FOLLOW_UPS[userTurns % FOLLOW_UPS.length]}`;
    }
    if (next) return `${react} ${next}`;
    if (scenario && userTurns >= scenario.script.length) {
      return 'Thank you, that was a good conversation. Tap “Finish” to see your feedback.';
    }
    return `${react} ${FOLLOW_UPS[userTurns % FOLLOW_UPS.length]}`;
  },
  async replyStream(ctx, onToken) {
    const t = await scriptedProvider.reply(ctx);
    onToken(t);
    return t;
  },
  async review({ history }) {
    const users = history.filter((t) => t.role === 'user');
    const findings = users.flatMap((u) => analyze(u.text));
    const longest = users.reduce((a, b) => (b.text.length > a.length ? b.text : a), '');
    return {
      findings,
      natural: longest,
      vocabTips: [],
    };
  },
  async howToSay(fr) {
    return findPhrase(fr)?.entry ?? null;
  },
};

// ---------------------------------------------------------------------------------------------
// OpenAI-compatible provider (Ollama, LM Studio, llama.cpp server, any cloud API). User-configured.
// ---------------------------------------------------------------------------------------------
const MODE_RULES: Record<CorrectionMode, string> = {
  friendly: 'Do NOT interrupt to correct. React naturally. Keep it relaxed and encouraging.',
  teacher: 'Reply naturally; you may recast the learner’s sentence correctly once, in passing.',
  immersion: 'Speak only English, naturally, at slightly above the learner’s level.',
  beginner: 'Use very simple words and short sentences (A1–A2). Speak slowly.',
  strict: 'If the learner makes a mistake, briefly correct it first, then continue the conversation.',
};

function systemPrompt(ctx: ReplyContext): string {
  const { scenario, profile, mode } = ctx;
  return [
    'You are a warm English conversation partner for a French-speaking adult learner.',
    `Learner level: about ${levelName(profile)} (CEFR). Work domain: ${profile.domain}.`,
    scenario ? `Scenario: ${scenario.persona}. Goal for the learner: ${scenario.goal}.` : 'Free conversation: follow the learner’s topics.',
    MODE_RULES[mode],
    'Reply in 1–3 short sentences, then ask at most one question. Never lecture. Never write French unless asked.',
    ctx.memory ? `What you remember about this learner (use it naturally, do not recite it):\n${ctx.memory}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function chat(s: Settings, messages: { role: string; content: string }[], json = false): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(`${s.llmBaseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(s.llmApiKey ? { Authorization: `Bearer ${s.llmApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: s.llmModel,
        messages,
        temperature: 0.7,
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    const data = await res.json();
    return String(data.choices?.[0]?.message?.content ?? '').trim();
  } finally {
    clearTimeout(timer);
  }
}

async function chatStream(s: Settings, messages: { role: string; content: string }[], onToken: (partial: string) => void): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 60_000);
  try {
    const res = await streamFetch(`${s.llmBaseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(s.llmApiKey ? { Authorization: `Bearer ${s.llmApiKey}` } : {}),
      },
      body: JSON.stringify({ model: s.llmModel, messages, temperature: 0.7, stream: true }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    if (!res.body) throw new Error('No stream');
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let full = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const r = parseSse(buf);
      buf = r.rest;
      for (const t of r.tokens) {
        full += t;
        onToken(full);
      }
      if (r.done) break;
    }
    if (!full.trim()) throw new Error('Empty LLM reply');
    return full.trim();
  } finally {
    clearTimeout(timer);
  }
}

/** Lists the models the endpoint serves. Used by the AI setup screen to diagnose connection problems. */
export async function testLlmConnection(s: Pick<Settings, 'llmBaseUrl' | 'llmApiKey'>): Promise<{ ok: boolean; models: string[]; error?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8_000);
  try {
    const res = await fetch(`${s.llmBaseUrl.replace(/\/$/, '')}/models`, {
      headers: s.llmApiKey ? { Authorization: `Bearer ${s.llmApiKey}` } : {},
      signal: ctrl.signal,
    });
    if (!res.ok) return { ok: false, models: [], error: `HTTP ${res.status}` };
    const j = await res.json();
    const models = ((j.data ?? j.models ?? []) as { id?: string; name?: string }[]).map((m) => String(m.id ?? m.name)).filter(Boolean);
    return { ok: true, models };
  } catch (e) {
    const msg =
      e instanceof Error && e.name === 'AbortError'
        ? 'Timeout: no answer within 8 s (wrong IP, firewall, or the server is not listening on the network).'
        : String(e);
    return { ok: false, models: [], error: msg };
  } finally {
    clearTimeout(timer);
  }
}

const safeJson = <T,>(s: string): T | null => {
  try {
    const m = s.match(/\{[\s\S]*\}/);
    return m ? (JSON.parse(m[0]) as T) : null;
  } catch {
    return null;
  }
};

export function openAICompatProvider(s: Settings): ConversationAIProvider {
  return {
    id: `llm:${s.llmModel}`,
    online: true,
    async reply(ctx) {
      const msgs = [
        { role: 'system', content: systemPrompt(ctx) },
        ...ctx.history.map((t) => ({ role: t.role === 'ai' ? 'assistant' : 'user', content: t.text })),
      ];
      return chat(s, msgs);
    },
    async replyStream(ctx, onToken) {
      const msgs = [
        { role: 'system', content: systemPrompt(ctx) },
        ...ctx.history.map((t) => ({ role: t.role === 'ai' ? 'assistant' : 'user', content: t.text })),
      ];
      return chatStream(s, msgs, onToken);
    },
    async review(ctx) {
      const convo = ctx.history.map((t) => `${t.role === 'ai' ? 'Partner' : 'Learner'}: ${t.text}`).join('\n');
      const out = await chat(
        s,
        [
          {
            role: 'system',
            content:
              'You are an English teacher. Analyse ONLY the Learner lines. Return JSON: {"findings":[{"category":string,"original":string,"correction":string,"explanation":"short, in French","severity":1|2|3}],"natural":"a natural rewrite of the learner’s longest line","vocabTips":[string]}. Only report real errors; at most 6 findings.',
          },
          { role: 'user', content: convo },
        ],
        true,
      );
      const j = safeJson<ReviewResult>(out);
      if (!j) throw new Error('Bad LLM review JSON');
      return { findings: j.findings ?? [], natural: j.natural ?? '', vocabTips: j.vocabTips ?? [] };
    },
    async howToSay(fr, profile) {
      const out = await chat(
        s,
        [
          {
            role: 'system',
            content: `Translate the French into NATURAL spoken English (${profile.variant === 'us' ? 'American' : profile.variant === 'uk' ? 'British' : 'international'}). Return JSON: {"fr":string,"natural":string,"alternatives":[string,string],"formal":string,"informal":string,"explain":"1 short sentence in French"}.`,
          },
          { role: 'user', content: fr },
        ],
        true,
      );
      return safeJson<PhraseEntry>(out);
    },
  };
}

// ---------------------------------------------------------------------------------------------
// Router: LLM if enabled and reachable, otherwise offline. Callers never know which one answered.
// ---------------------------------------------------------------------------------------------
export interface AIRouter extends ConversationAIProvider {
  lastError: string | null;
}

export async function getAI(): Promise<AIRouter> {
  const settings = await getSettings();
  const online = settings.llmEnabled ? openAICompatProvider(settings) : null;
  const router: AIRouter = {
    id: online ? online.id : scriptedProvider.id,
    online: !!online,
    lastError: null,
    async reply(ctx) {
      if (online) {
        try {
          return await online.reply(ctx);
        } catch (e) {
          router.lastError = String(e);
        }
      }
      return scriptedProvider.reply(ctx);
    },
    async replyStream(ctx, onToken) {
      if (online) {
        try {
          return await online.replyStream(ctx, onToken);
        } catch (e) {
          router.lastError = String(e);
          try {
            // some servers/proxies do not stream: retry once without streaming
            const t = await online.reply(ctx);
            onToken(t);
            return t;
          } catch (e2) {
            router.lastError = String(e2);
          }
        }
      }
      return scriptedProvider.replyStream(ctx, onToken);
    },
    async review(ctx) {
      const offline = await scriptedProvider.review(ctx);
      if (online) {
        try {
          const r = await online.review(ctx);
          // keep rule-based findings the LLM did not repeat
          const seen = new Set(r.findings.map((f) => f.correction.toLowerCase()));
          return { ...r, findings: [...r.findings, ...offline.findings.filter((f) => !seen.has(f.correction.toLowerCase()))] };
        } catch (e) {
          router.lastError = String(e);
        }
      }
      return offline;
    },
    async howToSay(fr, profile) {
      if (online) {
        try {
          const r = await online.howToSay(fr, profile);
          if (r?.natural) return r;
        } catch (e) {
          router.lastError = String(e);
        }
      }
      return scriptedProvider.howToSay(fr, profile);
    },
  };
  return router;
}


import { describe, expect, it } from 'vitest';

import { intentOf, isMeta, keyWord, offlineReply } from '@/services/ai/offline-dialogue';
import { buildFeedbackMessage, validateFeedback } from '@/services/feedback-format';

const ai = (text: string) => ({ role: 'ai' as const, text });
const me = (text: string) => ({ role: 'user' as const, text });

describe('offline partner', () => {
  it('recognises questions to the partner instead of ignoring them', () => {
    expect(intentOf('what do you mean by what happened next')).toBe('clarify');
    expect(intentOf('why do you ask me this question')).toBe('why-ask');
    expect(intentOf('how are you?')).toBe('about-you');
    expect(intentOf('hello')).toBe('greeting');
    expect(intentOf("I don't know")).toBe('dont-know');
    expect(intentOf('yes')).toBe('short');
    expect(intentOf('what happened yesterday was strange')).toBe('statement');
  });

  it('explains its own question when asked what it means (the reported failure)', () => {
    const history = [ai('Okay. What happened next?'), me('what do you mean by what happened next')];
    const r = offlineReply({ history });
    expect(r).toMatch(/what happened after that/i);
    expect(r).not.toMatch(/^Okay\./);
  });

  it('answers "why do you ask" and never repeats a follow-up it already used', () => {
    const asked = offlineReply({ history: [ai('Can you tell me a bit more about that?'), me('why do you ask me this question')] });
    expect(asked).toMatch(/no wrong answers/i);
    let history = [ai('Hello'), me('I went to the market with my brother yesterday')];
    const seen = new Set<string>();
    for (let k = 0; k < 6; k += 1) {
      const reply = offlineReply({ history });
      seen.add(reply.replace(/^.*?(?=[A-Z][^.]*\?$)/, ''));
      history = [...history, ai(reply), me('We bought some vegetables and fruit there')];
    }
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });

  it('meta turns do not advance a scripted scenario', () => {
    expect(isMeta('clarify')).toBe(true);
    expect(isMeta('statement')).toBe(false);
    const r = offlineReply({ history: [ai('Where are you going?'), me('sorry what')], scriptedNext: 'Where are you going?' });
    expect(r).toMatch(/Where are you going\?/);
  });

  it('picks a content word to show it listened', () => {
    expect(keyWord('I really like my new bicycle')).toBe('bicycle');
    expect(keyWord('yes it is')).toBeNull();
  });
});

describe('feedback message', () => {
  it('contains version, device, screen, type and the description', () => {
    const m = buildFeedbackMessage({ version: '0.6.0', device: 'SM-S948B · Android 16', screen: 'conversation', kind: 'Something is broken', note: 'The partner ignores my questions.', contact: 'Awa' });
    expect(m).toContain('My English Coach 0.6.0 · SM-S948B · Android 16');
    expect(m).toContain('Screen: conversation');
    expect(m).toContain('Type: Something is broken');
    expect(m).toContain('The partner ignores my questions.');
    expect(m).toContain('Contact: Awa');
  });

  it('asks for a description when reporting a problem', () => {
    expect(validateFeedback(null, '')).toMatch(/Choose/);
    expect(validateFeedback('Something is broken', 'bad')).toMatch(/describe/i);
    expect(validateFeedback('Something is broken', 'The microphone stops after two seconds')).toBeNull();
    expect(validateFeedback('Useful', '')).toBeNull();
  });
});

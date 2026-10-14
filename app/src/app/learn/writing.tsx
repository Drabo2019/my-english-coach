import { Stack } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';

import { Btn, Card, Input, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { getAI, type ReviewResult } from '@/services/ai';
import { logActivity, recordMistake } from '@/services/storage/repo';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useTheme } from '@/hooks/use-theme';

const PROMPTS = [
  { id: 'sms', t: 'SMS: you are late', p: 'Write a short text to a friend: you will be 15 minutes late.', tone: 'informal' },
  { id: 'wa', t: 'WhatsApp: invite', p: 'Invite a colleague for a coffee after work.', tone: 'informal' },
  { id: 'email1', t: 'Email: ask for an update', p: 'Write a polite email asking a supplier when your order will arrive.', tone: 'formal' },
  { id: 'email2', t: 'Email: report a problem', p: 'Write a short email to your manager explaining that a test is delayed and why.', tone: 'formal' },
  { id: 'desc', t: 'Description', p: 'Describe your workplace in 4–5 sentences.', tone: 'neutral' },
  { id: 'opinion', t: 'Opinion', p: 'Do you prefer working from home or at the office? Give two reasons.', tone: 'neutral' },
  { id: 'summary', t: 'Summary', p: 'Summarise your last week at work in 4–5 sentences.', tone: 'neutral' },
  { id: 'report', t: 'Short report', p: 'Write a short report: what you tested, what you found, what happens next.', tone: 'formal' },
  { id: 'msg-pro', t: 'Professional message', p: 'Message a colleague to reschedule tomorrow’s meeting.', tone: 'formal' },
  { id: 'thanks', t: 'Thank-you note', p: 'Thank a colleague who helped you solve a problem.', tone: 'neutral' },
];

const CONTRACTION = /\b(gonna|wanna|gotta|kinda|lol|u r|thx)\b/i;

export default function Writing() {
  const th = useTheme();
  const { profile, settings } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ReviewResult | null>(null);
  const [warn, setWarn] = useState<string[]>([]);
  const t0 = useRef(Date.now());
  const goList = useCallback(() => setSel(null), []);
  useInnerBack(sel !== null, goList);
  const p = PROMPTS.find((x) => x.id === sel);

  if (!p) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Writing' }} />
        {PROMPTS.map((x) => (
          <Card key={x.id} onPress={() => { setSel(x.id); setText(''); setRes(null); setWarn([]); t0.current = Date.now(); }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h2" style={{ flex: 1 }}>{x.t}</T>
              <Tag label={x.tone} />
            </Row>
          </Card>
        ))}
      </Screen>
    );
  }

  const check = async () => {
    setBusy(true);
    const ai = await getAI();
    const r = await ai.review({ scenario: null, history: [{ role: 'user', text }], profile, mode: settings.correctionMode });
    for (const f of r.findings) await recordMistake(f);
    const w: string[] = [];
    if (p.tone === 'formal' && CONTRACTION.test(text)) w.push('Too casual for a formal text (gonna, lol, thx…).');
    if (p.tone === 'formal' && !/\b(regards|sincerely|thank you|thanks)\b/i.test(text)) w.push('Add a polite closing (Kind regards / Thank you).');
    if (text.trim().split(/\s+/).length < 8) w.push('Very short text: add a detail or a reason.');
    setWarn(w);
    setRes(r);
    await logActivity('writing', (Date.now() - t0.current) / 1000, p.id);
    setBusy(false);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: p.t }} />
      <Card>
        <T v="h2">{p.p}</T>
        <T v="small" dim>{`Expected tone: ${p.tone}`}</T>
      </Card>
      <Input value={text} onChangeText={setText} placeholder="Write here…" multiline style={{ minHeight: 140, textAlignVertical: 'top' }} />
      <Btn label={busy ? 'Checking…' : 'Check my writing'} disabled={busy || !text.trim()} onPress={check} />
      {res && (
        <>
          {res.findings.length === 0 && warn.length === 0 && (
            <Card tone="good">
              <T>Nothing clearly wrong detected. Well done.</T>
              <T v="small" dim>The offline checker is cautious. Turn on the AI partner in Settings to judge style and naturalness.</T>
            </Card>
          )}
          {res.findings.map((f, k) => (
            <Card key={k}>
              <T color={th.bad}>{`❌ ${f.original}`}</T>
              <T color={th.good}>{`✅ ${f.correction}`}</T>
              <T v="small" dim>{f.explanation}</T>
            </Card>
          ))}
          {warn.map((w) => (
            <Card key={w} tone="warn"><T>{w}</T></Card>
          ))}
          {!!res.natural && res.natural !== text && (
            <Card>
              <T v="label" dim>More natural</T>
              <T>{res.natural}</T>
              <Speak text={res.natural} />
            </Card>
          )}
        </>
      )}
      <Btn small kind="ghost" label="Back to list" onPress={() => setSel(null)} />
    </Screen>
  );
}

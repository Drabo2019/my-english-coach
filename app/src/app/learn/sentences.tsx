import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Btn, Card, Chip, Input, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { SENTENCES } from '@/data/sentences';
import { useApp } from '@/features/app-context';
import { norm, similarity } from '@/features/items';
import { review as srsReview, newCard } from '@/features/srs';
import { useTheme } from '@/hooks/use-theme';
import { pronunciation, stt } from '@/services/speech';
import { getCard, logActivity, saveCard, toggleSaved } from '@/services/storage/repo';
import { LEVELS, type Sentence } from '@/types';

type Mode = 'order' | 'gap' | 'translate' | 'speak';
const MODES: { id: Mode; label: string }[] = [
  { id: 'order', label: 'Order words' },
  { id: 'gap', label: 'Fill the gap' },
  { id: 'translate', label: 'French → English' },
  { id: 'speak', label: 'Speak it' },
];

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function pick(levelIdx: number): Sentence {
  const near = SENTENCES.filter((s) => Math.abs(LEVELS.indexOf(s.level) - levelIdx) <= 1);
  const pool = near.length ? near : SENTENCES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Sentences() {
  const th = useTheme();
  const { profile } = useApp();
  const [mode, setMode] = useState<Mode>('order');
  const [s, setS] = useState<Sentence>(() => pick(2));
  const [result, setResult] = useState<null | { ok: boolean; note?: string }>(null);
  const [saved, setSaved] = useState(false);
  const t0 = useRef(Date.now());

  // order mode
  const [bank, setBank] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  // gap mode
  const [gap, setGap] = useState<{ word: string; opts: string[]; shown: string }>({ word: '', opts: [], shown: '' });
  // translate/speak mode
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const level = Math.round((profile.levels.speaking + profile.levels.grammar) / 2);

  const setup = useCallback((sent: Sentence, m: Mode) => {
    setResult(null);
    setText('');
    setErr('');
    setBuilt([]);
    setSaved(false);
    t0.current = Date.now();
    const words = sent.en.split(' ');
    setBank(shuffle(words.map((w, i) => `${i}|${w}`)));
    if (m === 'gap') {
      const cands = words.map((w, i) => ({ w: w.replace(/[^\w’']/g, ''), i })).filter((x) => x.w.length >= 4);
      const target = cands.length ? cands[Math.floor(Math.random() * cands.length)] : { w: words[0], i: 0 };
      const others = shuffle(SENTENCES.flatMap((x) => x.en.split(' ').map((y) => y.replace(/[^\w’']/g, ''))).filter((y) => y.length >= 4 && y.toLowerCase() !== target.w.toLowerCase())).slice(0, 2);
      setGap({
        word: target.w,
        opts: shuffle([target.w, ...others]),
        shown: words.map((w, i) => (i === target.i ? '_____' : w)).join(' '),
      });
    }
  }, []);

  useEffect(() => {
    setup(s, mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, mode]);

  const finish = async (ok: boolean, note?: string) => {
    setResult({ ok, note });
    await logActivity('speaking', (Date.now() - t0.current) / 1000, `sent:${mode}`);
    const c = await getCard(`sent:${s.id}`, 'sentence');
    await saveCard(srsReview(c.reps === 0 ? newCard(c.id, 'sentence') : c, ok ? 2 : 0, Date.now() - t0.current, true));
  };

  const next = () => setS(pick(level));

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Sentences' }} />
      <Row>
        {MODES.map((m) => (
          <Chip key={m.id} label={m.label} active={mode === m.id} onPress={() => setMode(m.id)} />
        ))}
      </Row>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Tag label={`${s.level} · ${s.situation}`} />
          {s.register !== 'neutral' && <Tag label={s.register} tone="warn" />}
        </Row>
        {(mode === 'order' || mode === 'gap' || mode === 'translate') && <T v="h2">{s.fr}</T>}
        {mode === 'gap' && <T style={{ marginTop: 6 }}>{gap.shown}</T>}
        {mode === 'speak' && <T v="h2">{s.en}</T>}
        {!!s.grammar && <T v="small" dim>{`Grammar: ${s.grammar}`}</T>}
      </Card>

      {mode === 'order' && !result && (
        <>
          <Card style={{ minHeight: 56 }}>
            <Row>
              {built.map((b, k) => (
                <Chip key={k} label={b.split('|')[1]} active onPress={() => { setBuilt(built.filter((_, j) => j !== k)); setBank([...bank, b]); }} />
              ))}
            </Row>
          </Card>
          <Row>
            {bank.map((b) => (
              <Chip key={b} label={b.split('|')[1]} onPress={() => { setBank(bank.filter((x) => x !== b)); setBuilt([...built, b]); }} />
            ))}
          </Row>
          <Btn label="Check" disabled={bank.length > 0} onPress={() => { const ans = built.map((b) => b.split('|')[1]).join(' '); finish(norm(ans) === norm(s.en)); }} />
        </>
      )}

      {mode === 'gap' && !result && (
        <Row>
          {gap.opts.map((o) => (
            <Btn key={o} kind="ghost" label={o} onPress={() => finish(o === gap.word)} />
          ))}
        </Row>
      )}

      {mode === 'translate' && !result && (
        <>
          <Input value={text} onChangeText={setText} placeholder="Type it in English…" autoCapitalize="none" multiline />
          <Btn label="Check" disabled={!text.trim()} onPress={() => finish(similarity(text, s.en) >= 0.8)} />
        </>
      )}

      {mode === 'speak' && !result && (
        <>
          <Speak text={s.en} />
          <Btn
            label={busy ? 'Listening…' : '🎙 Say the sentence'}
            disabled={busy}
            onPress={async () => {
              setBusy(true);
              setErr('');
              try {
                const r = await stt.listen({ hints: s.en.split(' ') });
                setText(r.transcript);
                const a = pronunciation.assess(s.en, r);
                setBusy(false);
                await finish(a.score >= 75, a.note);
                return;
              } catch (e) {
                setErr(`${e instanceof Error ? e.message : e}`);
              }
              setBusy(false);
            }}
          />
          {!!text && <T dim>{`Heard: ${text}`}</T>}
          {err !== '' && <T color={th.bad}>{err}</T>}
          <Btn small kind="ghost" label="Skip" onPress={next} />
        </>
      )}

      {result && (
        <>
          <Card tone={result.ok ? 'good' : 'bad'}>
            <T v="h2">{result.ok ? '✅ Good' : '❌ Not quite'}</T>
            <T>{s.en}</T>
            {!!s.alt && <T v="small" dim>{`Also: ${s.alt}`}</T>}
            {!!result.note && <T v="small" dim>{result.note}</T>}
          </Card>
          <Speak text={s.en} />
          <Row>
            <Btn small kind="ghost" label={saved ? '⭐ Saved' : '☆ Save'} onPress={async () => setSaved(await toggleSaved('sentence', s.id))} />
            <Btn small label="Next" onPress={next} />
          </Row>
        </>
      )}
    </Screen>
  );
}

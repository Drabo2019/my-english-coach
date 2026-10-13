import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';

import { Btn, Card, Chip, Row, Screen, T } from '@/components/ui';
import { SENTENCES } from '@/data/sentences';
import { useTheme } from '@/hooks/use-theme';
import { pronunciation, stt, tts } from '@/services/speech';
import { addScore, logActivity } from '@/services/storage/repo';
import type { Level } from '@/types';

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];
const RATES = [
  { label: 'Slow', rate: 0.65 },
  { label: 'Normal', rate: 0.85 },
  { label: 'Native', rate: 1.0 },
];

export default function Shadowing() {
  const th = useTheme();
  const [level, setLevel] = useState<Level>('A2');
  const [rate, setRate] = useState(0);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'listen' | 'speak'>('idle');
  const [res, setRes] = useState<{ score: number; heard: string; words: { word: string; ok: boolean }[] } | null>(null);
  const [err, setErr] = useState('');

  const pool = useMemo(() => SENTENCES.filter((x) => x.level === level && x.en.split(' ').length <= 12), [level]);
  const sentence = pool[i % Math.max(pool.length, 1)];

  const run = async () => {
    if (!sentence) return;
    setErr('');
    setRes(null);
    tts.stop();
    const t0 = Date.now();
    try {
      setPhase('listen');
      await tts.speak(sentence.en, { rate: RATES[rate].rate });
      setPhase('speak');
      const r = await stt.listen({ hints: sentence.en.split(' ') });
      const a = pronunciation.assess(sentence.en, r);
      setRes({ score: a.score, heard: r.transcript, words: a.words });
      await logActivity('pronunciation', (Date.now() - t0) / 1000, sentence.id);
      await addScore('pronunciation', (a.score / 100) * 4, 'shadowing');
    } catch (e) {
      setErr(`${e instanceof Error ? e.message : e}`);
    }
    setPhase('idle');
  };

  const choose = (fn: () => void) => () => {
    tts.stop();
    setRes(null);
    setI(0);
    fn();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Shadowing' }} />
      <T dim>Écoute la phrase, puis répète-la immédiatement, avec le même rythme et la même mélodie. Commence lentement, puis accélère.</T>
      <Row>
        {LEVELS.map((l) => (
          <Chip key={l} label={l} active={l === level} onPress={choose(() => setLevel(l))} />
        ))}
      </Row>
      <Row>
        {RATES.map((r, k) => (
          <Chip key={r.label} label={r.label} active={k === rate} onPress={() => setRate(k)} />
        ))}
      </Row>
      {sentence ? (
        <Card>
          <T v="h2">{sentence.en}</T>
          <T dim>{sentence.fr}</T>
        </Card>
      ) : (
        <T dim>No sentence at this level.</T>
      )}
      <Btn
        label={phase === 'listen' ? '🔊 Listen…' : phase === 'speak' ? '🎙 Now repeat!' : '▶ Listen, then repeat'}
        disabled={phase !== 'idle' || !sentence}
        onPress={run}
      />
      {err !== '' && <T color={th.bad}>{err}</T>}
      {res && (
        <Card tone={res.score >= 80 ? 'good' : 'warn'}>
          <T>{`${res.score}% · heard: “${res.heard}”`}</T>
          <Row>
            {res.words.map((w, k) => (
              <T key={k} color={w.ok ? th.good : th.bad}>
                {w.word}
              </T>
            ))}
          </Row>
        </Card>
      )}
      <Row>
        <Btn small kind="ghost" label="Again" disabled={phase !== 'idle'} onPress={run} />
        <Btn small label="Next sentence" disabled={phase !== 'idle'} onPress={() => { setI(i + 1); setRes(null); }} />
      </Row>
    </Screen>
  );
}

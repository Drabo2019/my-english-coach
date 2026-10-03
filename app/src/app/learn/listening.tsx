import { Stack } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';

import { Btn, Card, Input, Row, Screen, T, Tag } from '@/components/ui';
import { LISTENING } from '@/data/content';
import { useApp } from '@/features/app-context';
import { similarity } from '@/features/items';
import { addScore, logActivity } from '@/services/storage/repo';
import { tts } from '@/services/speech';
import { useInnerBack } from '@/hooks/use-inner-back';
import { LEVELS } from '@/types';

const SPEEDS = [
  { label: '🐢 Slow', rate: 0.55 },
  { label: '▶ Normal', rate: 0.9 },
  { label: '⚡ Fast', rate: 1.25 },
];

export default function Listening() {
  const { profile } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [dictation, setDictation] = useState('');
  const [showText, setShowText] = useState(false);
  const [plays, setPlays] = useState(0);
  const t0 = useRef(Date.now());
  const done = useRef(false);

  const goList = useCallback(() => { tts.stop(); setSel(null); }, []);
  useInnerBack(sel !== null, goList);
  const item = LISTENING.find((x) => x.id === sel);
  const myLevel = Math.round(profile.levels.listening);

  if (!item) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Listening' }} />
        <T dim>Écoute d’abord sans lire. Commence lentement, puis normal, puis rapide. La transcription n’apparaît qu’à la fin.</T>
        {LISTENING.map((l) => (
          <Card
            key={l.id}
            onPress={() => {
              setSel(l.id);
              setPicked({});
              setDictation('');
              setShowText(false);
              setPlays(0);
              done.current = false;
              t0.current = Date.now();
            }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h2">{`Exercise ${l.id.slice(1)}`}</T>
              <Row>
                <Tag label={l.accent.toUpperCase()} />
                <Tag label={l.level} tone={Math.abs(LEVELS.indexOf(l.level) - myLevel) <= 1 ? 'good' : undefined} />
              </Row>
            </Row>
          </Card>
        ))}
      </Screen>
    );
  }

  const play = (rate: number) => {
    setPlays((p) => p + 1);
    tts.speak(item.text, { rate, lang: item.accent === 'uk' ? 'en-GB' : 'en-US' });
  };
  const answered = Object.keys(picked).length === item.questions.length;
  const correct = item.questions.filter((q, i) => picked[i] === q.answer).length;
  const dictScore = dictation ? Math.round(similarity(dictation, item.text) * 100) : null;

  const choose = (i: number, k: number) => {
    if (picked[i] !== undefined) return;
    const next = { ...picked, [i]: k };
    setPicked(next);
    if (Object.keys(next).length === item.questions.length && !done.current) {
      done.current = true;
      const ok = item.questions.filter((q, j) => next[j] === q.answer).length;
      logActivity('listening', (Date.now() - t0.current) / 1000, item.id);
      addScore('listening', (ok / item.questions.length) * LEVELS.indexOf(item.level), `listening:${item.id}`);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: `Listening ${item.id.slice(1)}` }} />
      <Card>
        <T v="label" dim>{`${item.level} · ${item.accent.toUpperCase()} accent · played ${plays}×`}</T>
        <Row>
          {SPEEDS.map((s) => (
            <Btn key={s.label} small kind="ghost" label={s.label} onPress={() => play(s.rate)} />
          ))}
          <Btn small kind="ghost" label="⏹" onPress={() => tts.stop()} />
        </Row>
      </Card>

      {item.questions.map((q, i) => (
        <Card key={i}>
          <T style={{ fontWeight: '600' }}>{q.q}</T>
          <Row>
            {q.options.map((o, k) => {
              const chosen = picked[i] !== undefined;
              const kind = chosen && k === q.answer ? 'primary' : chosen && picked[i] === k ? 'danger' : 'ghost';
              return <Btn key={o} small kind={kind} label={o} onPress={() => choose(i, k)} />;
            })}
          </Row>
        </Card>
      ))}

      <Card>
        <T v="label" dim>Dictation (optional)</T>
        <Input value={dictation} onChangeText={setDictation} placeholder="Type what you hear…" multiline autoCapitalize="none" />
        {dictScore !== null && showText && <T>{`Accuracy: ${dictScore}%`}</T>}
      </Card>

      {answered && <T>{`Comprehension: ${correct}/${item.questions.length}`}</T>}
      <Btn kind="ghost" label={showText ? item.text : 'Show transcript'} onPress={() => setShowText(true)} />
      <Btn small kind="ghost" label="Back to list" onPress={() => { tts.stop(); setSel(null); }} />
    </Screen>
  );
}

import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';

import { Btn, Card, Row, Screen, Speak, T } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { addScore, logActivity } from '@/services/storage/repo';

export default function GrammarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = GRAMMAR.find((x) => x.id === id);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const t0 = useRef(Date.now());
  const logged = useRef(false);

  if (!g) return <Screen><T>Topic not found.</T></Screen>;

  const answered = Object.keys(picked).length;
  const correct = g.exercises.filter((e, i) => picked[i] === e.answer).length;

  const choose = async (i: number, opt: number) => {
    if (picked[i] !== undefined) return;
    const next = { ...picked, [i]: opt };
    setPicked(next);
    if (Object.keys(next).length === g.exercises.length && !logged.current) {
      logged.current = true;
      const ok = g.exercises.filter((e, k) => next[k] === e.answer).length;
      await logActivity('grammar', (Date.now() - t0.current) / 1000, g.id);
      await addScore('grammar', (ok / g.exercises.length) * 4, `grammar:${g.id}`);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: g.title.split('(')[0].trim() }} />
      <Card>
        <T v="label" dim>Explanation</T>
        <T>{g.explain}</T>
      </Card>
      <Card>
        <T v="label" dim>Examples</T>
        {g.examples.map((e) => (
          <React.Fragment key={e.en}>
            <T>{e.en}</T>
            <T v="small" dim>{e.fr}</T>
          </React.Fragment>
        ))}
      </Card>
      <Card tone="warn">
        <T v="label" dim>Frequent mistakes</T>
        {g.mistakes.map((m) => (
          <React.Fragment key={m.wrong}>
            <T>{`❌ ${m.wrong}`}</T>
            <T>{`✅ ${m.right}`}</T>
            <T v="small" dim>{m.why}</T>
          </React.Fragment>
        ))}
      </Card>

      <T v="h2">Exercises</T>
      {g.exercises.map((e, i) => (
        <Card key={i}>
          <T>{e.q}</T>
          <Row>
            {e.options.map((o, k) => {
              const chosen = picked[i] !== undefined;
              const kind = chosen && k === e.answer ? 'primary' : chosen && picked[i] === k ? 'danger' : 'ghost';
              return <Btn key={o} small kind={kind} label={o} onPress={() => choose(i, k)} />;
            })}
          </Row>
          {picked[i] !== undefined && !!e.why && <T v="small" dim>{e.why}</T>}
        </Card>
      ))}
      {answered === g.exercises.length && <T>{`Score: ${correct}/${g.exercises.length}`}</T>}

      <Card>
        <T v="label" dim>Say it aloud</T>
        {g.say.map((s) => (
          <React.Fragment key={s}>
            <T>{s}</T>
            <Speak text={s} />
          </React.Fragment>
        ))}
        <Btn kind="ghost" label="🎙 Mini conversation: practise this" onPress={() => router.push('/speak/free')} />
      </Card>
    </Screen>
  );
}

import { Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text } from 'react-native';

import { Btn, Card, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { READING } from '@/data/content';
import { VOCAB } from '@/data/vocabulary';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/hooks/use-theme';
import { addScore, logActivity, toggleSaved } from '@/services/storage/repo';
import { LEVELS } from '@/types';

const stripWord = (w: string) => w.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, '').replace(/’s$/, '');

export default function Reading() {
  const th = useTheme();
  const { settings } = useApp();
  const [sel, setSel] = useState<string | null>(null);
  const [word, setWord] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const t0 = useRef(Date.now());
  const done = useRef(false);
  const text = READING.find((r) => r.id === sel);

  if (!text) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Reading' }} />
        {READING.map((r) => (
          <Card
            key={r.id}
            onPress={() => {
              setSel(r.id);
              setWord(null);
              setPicked({});
              done.current = false;
              t0.current = Date.now();
            }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h2" style={{ flex: 1 }}>{r.title}</T>
              <Tag label={r.level} tone="accent" />
            </Row>
          </Card>
        ))}
      </Screen>
    );
  }

  const entry = word ? VOCAB.find((v) => v.word.toLowerCase() === word || v.word.toLowerCase().split(' ')[0] === word) : null;
  const choose = (i: number, k: number) => {
    if (picked[i] !== undefined) return;
    const next = { ...picked, [i]: k };
    setPicked(next);
    if (Object.keys(next).length === text.questions.length && !done.current) {
      done.current = true;
      const ok = text.questions.filter((q, j) => next[j] === q.answer).length;
      logActivity('reading', (Date.now() - t0.current) / 1000, text.id);
      addScore('reading', (ok / text.questions.length) * LEVELS.indexOf(text.level), `reading:${text.id}`);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: text.title }} />
      <Card>
        <Text style={{ color: th.text, fontSize: 18 * settings.fontScale, lineHeight: 30 * settings.fontScale }}>
          {text.text.split(/(\s+)/).map((w, i) =>
            /\s+/.test(w) ? (
              w
            ) : (
              <Text key={i} onPress={() => { setWord(stripWord(w)); setSaved(false); }} style={word && stripWord(w) === word ? { backgroundColor: th.accentSoft } : undefined}>
                {w}
              </Text>
            ),
          )}
        </Text>
      </Card>
      <Speak text={text.text} />

      {word && (
        <Card tone="accent">
          <T v="h2">{word}</T>
          {entry ? (
            <>
              <T>{`${entry.ipa} · ${entry.fr.join(', ')}`}</T>
              <T dim>{entry.examples[0]?.en}</T>
            </>
          ) : (
            <T dim>Pas encore dans le dictionnaire intégré (il grandit avec le contenu). Écoute-le :</T>
          )}
          <Row>
            <Speak text={word} />
            <Btn small kind="ghost" label={saved ? '⭐ Saved' : '☆ Save'} onPress={async () => setSaved(await toggleSaved('word', word))} />
          </Row>
        </Card>
      )}

      <T v="h2">Comprehension</T>
      {text.questions.map((q, i) => (
        <Card key={i}>
          <T>{q.q}</T>
          <Row>
            {q.options.map((o, k) => {
              const chosen = picked[i] !== undefined;
              const kind = chosen && k === q.answer ? 'primary' : chosen && picked[i] === k ? 'danger' : 'ghost';
              return <Btn key={o} small kind={kind} label={o} onPress={() => choose(i, k)} />;
            })}
          </Row>
        </Card>
      ))}
      <Btn small kind="ghost" label="Back to list" onPress={() => setSel(null)} />
    </Screen>
  );
}

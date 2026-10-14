import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { Card, Input, Screen, T, Tag } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { PHRASEBOOK } from '@/data/phrasebook';
import { SENTENCES } from '@/data/sentences';
import { VOCAB } from '@/data/vocabulary';
import { topMistakes } from '@/services/storage/repo';
import type { UserMistake } from '@/types';

export default function Search() {
  const [q, setQ] = useState('');
  const [mistakes, setMistakes] = useState<UserMistake[]>([]);
  useEffect(() => {
    topMistakes(100).then(setMistakes);
  }, []);

  const t = q.trim().toLowerCase();
  const has = (...s: string[]) => s.some((x) => x.toLowerCase().includes(t));
  const words = t ? VOCAB.filter((v) => has(v.word, ...v.fr)).slice(0, 8) : [];
  const sents = t ? SENTENCES.filter((s) => has(s.en, s.fr)).slice(0, 8) : [];
  const gram = t ? GRAMMAR.filter((g) => has(g.title, g.explain)).slice(0, 5) : [];
  const phr = t ? PHRASEBOOK.filter((p) => has(p.fr, p.natural, ...p.alternatives)).slice(0, 5) : [];
  const mis = t ? mistakes.filter((m) => has(m.original, m.correction, m.category)).slice(0, 5) : [];

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Search English' }} />
      <Input value={q} onChangeText={setQ} placeholder="Search English… (words, phrases, grammar, mistakes)" autoFocus autoCapitalize="none" />
      {words.map((v) => (
        <Card key={v.id} onPress={() => router.push({ pathname: '/learn/vocab/[id]', params: { id: v.id } })}>
          <Tag label="word" tone="accent" />
          <T v="h2">{v.word}</T>
          <T dim>{v.fr.join(', ')}</T>
        </Card>
      ))}
      {sents.map((s) => (
        <Card key={s.id} onPress={() => router.push('/learn/sentences')}>
          <Tag label="sentence" />
          <T>{s.en}</T>
          <T dim v="small">{s.fr}</T>
        </Card>
      ))}
      {phr.map((p) => (
        <Card key={p.fr}>
          <Tag label="how to say" tone="good" />
          <T>{p.natural}</T>
          <T dim v="small">{p.fr}</T>
        </Card>
      ))}
      {gram.map((g) => (
        <Card key={g.id} onPress={() => router.push({ pathname: '/learn/grammar/[id]', params: { id: g.id } })}>
          <Tag label="grammar" tone="warn" />
          <T v="h2">{g.title}</T>
        </Card>
      ))}
      {mis.map((m) => (
        <Card key={m.id} onPress={() => router.push('/mistakes')}>
          <Tag label="my mistake" tone="bad" />
          <T>{`${m.original} → ${m.correction}`}</T>
        </Card>
      ))}
      {!!t && !words.length && !sents.length && !phr.length && !gram.length && !mis.length && <T dim>No results in the local content.</T>}
    </Screen>
  );
}

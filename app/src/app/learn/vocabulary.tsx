import { Stack, router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import { Card, Chip, Input, Row, Screen, T, Tag } from '@/components/ui';
import { CATEGORIES, VOCAB } from '@/data/vocabulary';

export default function Vocabulary() {
  const [cat, setCat] = useState<string>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return VOCAB.filter((v) => (cat === 'all' || v.cat === cat) && (!t || v.word.toLowerCase().includes(t) || v.fr.some((f) => f.toLowerCase().includes(t))));
  }, [cat, q]);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Vocabulary' }} />
      <Input value={q} onChangeText={setQ} placeholder="Search a word (EN or FR)…" autoCapitalize="none" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {['all', ...CATEGORIES].map((c) => (
          <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />
        ))}
      </ScrollView>
      <T v="small" dim>{`${list.length} words`}</T>
      {list.map((v) => (
        <Card key={v.id} onPress={() => router.push({ pathname: '/learn/vocab/[id]', params: { id: v.id } })}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2">{v.word}</T>
            <Row>
              {v.register !== 'neutral' && <Tag label={v.register} tone="warn" />}
              <Tag label={v.level} tone="accent" />
            </Row>
          </Row>
          <T dim>{`${v.ipa} · ${v.fr.join(', ')}`}</T>
        </Card>
      ))}
    </Screen>
  );
}

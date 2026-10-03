import { Stack, router } from 'expo-router';
import React from 'react';

import { Btn, Card, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { SENTENCES } from '@/data/sentences';
import { vocabById } from '@/data/vocabulary';
import { useLoad } from '@/hooks/use-load';
import { allSaved, toggleSaved } from '@/services/storage/repo';

export default function Saved() {
  const [list, reload] = useLoad(allSaved);
  return (
    <Screen>
      <Stack.Screen options={{ title: 'My English' }} />
      {list && list.length === 0 && <T dim>Rien de sauvegardé. Utilise ☆ sur un mot, une phrase ou une expression.</T>}
      {list?.map((s) => {
        const v = s.kind === 'vocab' ? vocabById(s.ref) : null;
        const sent = s.kind === 'sentence' ? SENTENCES.find((x) => x.id === s.ref) : null;
        const text = v ? v.word : sent ? sent.en : s.ref;
        return (
          <Card key={s.id} onPress={v ? () => router.push({ pathname: '/learn/vocab/[id]', params: { id: v.id } }) : undefined}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Tag label={s.kind} />
              <Btn small kind="ghost" label="Remove" onPress={async () => { await toggleSaved(s.kind, s.ref); reload(); }} />
            </Row>
            <T v="h2">{text}</T>
            {v && <T dim>{v.fr.join(', ')}</T>}
            {sent && <T dim>{sent.fr}</T>}
            <Speak text={text} />
          </Card>
        );
      })}
    </Screen>
  );
}

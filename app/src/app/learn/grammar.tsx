import { Stack, router } from 'expo-router';
import React from 'react';

import { Card, Row, Screen, T, Tag } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';

export default function GrammarList() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Grammar' }} />
      <T dim>Seulement la grammaire utilisée en vrai : règle simple, erreurs fréquentes, exercices, phrases à dire.</T>
      {GRAMMAR.map((g) => (
        <Card key={g.id} onPress={() => router.push({ pathname: '/learn/grammar/[id]', params: { id: g.id } })}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2" style={{ flex: 1 }}>{g.title}</T>
            <Tag label={g.level} tone="accent" />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}

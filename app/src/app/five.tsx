import { Stack, router } from 'expo-router';
import React from 'react';

import { Card, Screen, T } from '@/components/ui';
import { FIVE_MINUTES } from '@/features/plan';

export default function Five() {
  return (
    <Screen>
      <Stack.Screen options={{ title: '5-Minute English' }} />
      <T dim>Cinq mini-activités d’une minute. Fais-les dans l’ordre ; arrête-toi quand tu veux.</T>
      {FIVE_MINUTES.map((b, k) => (
        <Card key={b.title} onPress={() => router.push(b.route as never)}>
          <T v="h2">{`${k + 1}. ${b.title}`}</T>
        </Card>
      ))}
    </Screen>
  );
}

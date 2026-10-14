import { Stack, router } from 'expo-router';
import React from 'react';

import { Card, Screen, T } from '@/components/ui';
import { FIVE_MINUTES } from '@/features/plan';

export default function Five() {
  return (
    <Screen>
      <Stack.Screen options={{ title: '5-Minute English' }} />
      <T dim>Five one-minute activities. Do them in order, and stop whenever you like.</T>
      {FIVE_MINUTES.map((b, k) => (
        <Card key={b.title} onPress={() => router.push(b.route as never)}>
          <T v="h2">{`${k + 1}. ${b.title}`}</T>
        </Card>
      ))}
    </Screen>
  );
}

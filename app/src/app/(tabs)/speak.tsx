import { router } from 'expo-router';
import React from 'react';

import { Btn, Card, Screen, T } from '@/components/ui';

const ITEMS = [
  { route: '/speak/find-words', icon: '🔎', title: 'Find the words', sub: 'A situation, you answer aloud; progressive hints if you block' },
  { route: '/speak/scenarios', icon: '🎭', title: 'Scenarios', sub: 'Interview, airport, doctor, meeting… three levels each' },
  { route: '/speak/fearless', icon: '🦁', title: 'Speak without fear', sub: '10 steps: one sentence → free conversation' },
  { route: '/speak/pronunciation', icon: '👄', title: 'Pronunciation', sub: 'Minimal pairs, IPA, slow playback, repeat & compare' },
  { route: '/speak/smalltalk', icon: '☕', title: 'Small talk', sub: 'Never be stuck when someone starts a conversation' },
] as const;

export default function Speak() {
  return (
    <Screen>
      <Btn label="🎙 Talk to me (free talk)" onPress={() => router.push('/speak/free')} />
      {ITEMS.map((it) => (
        <Card key={it.route} onPress={() => router.push(it.route as never)}>
          <T v="h2">{`${it.icon}  ${it.title}`}</T>
          <T dim v="small">{it.sub}</T>
        </Card>
      ))}
    </Screen>
  );
}

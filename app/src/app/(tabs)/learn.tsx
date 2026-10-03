import { router } from 'expo-router';
import React from 'react';

import { Card, Screen, T } from '@/components/ui';
import { GRAMMAR } from '@/data/grammar';
import { SENTENCES } from '@/data/sentences';
import { READING, LISTENING } from '@/data/content';
import { VOCAB } from '@/data/vocabulary';

const ITEMS = [
  { route: '/learn/sentences', icon: '🧩', title: 'Sentences', sub: `${SENTENCES.length} useful sentences · build, order, fill, transform` },
  { route: '/learn/vocabulary', icon: '📖', title: 'Vocabulary', sub: `${VOCAB.length} words with meanings, collocations, IPA` },
  { route: '/learn/grammar', icon: '🧠', title: 'Grammar that matters', sub: `${GRAMMAR.length} topics with mistakes & exercises` },
  { route: '/learn/listening', icon: '🎧', title: 'Listening', sub: `${LISTENING.length} exercises · slow / normal · UK & US` },
  { route: '/learn/reading', icon: '📰', title: 'Reading', sub: `${READING.length} texts · tap a word to look it up` },
  { route: '/learn/writing', icon: '✍️', title: 'Writing', sub: 'SMS, email, opinion — corrected for naturalness' },
  { route: '/learn/modern', icon: '🗣️', title: 'Real-world English', sub: 'Textbook vs spoken: gonna, wanna, no worries…' },
  { route: '/mistakes', icon: '⚠️', title: 'My English Mistakes', sub: 'Your recurring errors and how to fix them' },
  { route: '/resources', icon: '🌐', title: 'Learn More', sub: 'Trusted free resources matched to your level' },
] as const;

export default function Learn() {
  return (
    <Screen>
      {ITEMS.map((it) => (
        <Card key={it.route} onPress={() => router.push(it.route as never)}>
          <T v="h2">{`${it.icon}  ${it.title}`}</T>
          <T dim v="small">{it.sub}</T>
        </Card>
      ))}
    </Screen>
  );
}

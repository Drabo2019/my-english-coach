import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Bar, Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { levelLabel, overallIndex } from '@/features/placement';
import { isDifficult } from '@/features/srs';
import { useLoad } from '@/hooks/use-load';
import { allCards, secondsBySkill, streakDays, topMistakes, totalSeconds } from '@/services/storage/repo';
import { SKILLS } from '@/types';

export default function Progress() {
  const { profile } = useApp();
  const [d] = useLoad(async () => {
    const [cards, week, total, streak, mistakes] = await Promise.all([allCards(), secondsBySkill(7), totalSeconds(), streakDays(), topMistakes(5)]);
    const vocab = cards.filter((c) => c.kind === 'vocab');
    const sent = cards.filter((c) => c.kind === 'sentence');
    return {
      learned: vocab.filter((c) => c.state !== 'NEW').length,
      active: vocab.filter((c) => c.state === 'ACTIVE' || c.state === 'MASTERED').length,
      mastered: vocab.filter((c) => c.state === 'MASTERED').length,
      toReview: cards.filter(isDifficult).length,
      sentMastered: sent.filter((c) => c.state === 'ACTIVE' || c.state === 'MASTERED').length,
      week, total, streak, mistakes,
    };
  });
  const speakMin = d ? Math.round(((d.week['speaking'] ?? 0) + (d.week['conversation'] ?? 0)) / 60) : 0;
  const weekMin = d ? Math.round(Object.values(d.week).reduce((a, b) => a + b, 0) / 60) : 0;

  return (
    <Screen>
      <Card tone="accent">
        <T v="h2">{`Overall level: ${levelLabel(overallIndex(profile.levels))}`}</T>
        <T v="small" dim>A self-assessment to tune your plan, not an official certification.</T>
        {SKILLS.map((s) => {
          const min = Math.round((d?.week[s] ?? 0) / 60);
          return (
            <View key={s} style={{ gap: 4, marginTop: 6 }}>
              <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <T style={{ fontWeight: '600' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</T>
                <Row style={{ gap: 8, flexWrap: 'nowrap' }}>
                  <T dim v="small" style={{ fontVariant: ['tabular-nums'] }}>{`${min} min this week`}</T>
                  <Tag label={levelLabel(profile.levels[s])} tone="accent" />
                </Row>
              </Row>
              <Bar value={profile.levels[s] / 6} />
            </View>
          );
        })}
      </Card>

      <Card>
        <T v="h2">This week</T>
        {weekMin === 0 ? (
          <T dim>Nothing yet this week. Ten minutes of speaking is a good start.</T>
        ) : (
          <T>{`You studied ${weekMin} minute${weekMin > 1 ? 's' : ''}, ${speakMin} of them speaking.`}</T>
        )}
        <T dim>{`Streak: ${d?.streak ?? 0} day${d?.streak === 1 ? '' : 's'}  ·  Total time: ${Math.round((d?.total ?? 0) / 60)} min`}</T>
      </Card>

      <Card>
        <T v="h2">Vocabulary</T>
        {d && d.learned === 0 ? (
          <T dim>No words yet. Open Learn → Vocabulary and add a few to your review.</T>
        ) : (
          <>
            <T>{`${d?.learned ?? 0} learned  ·  ${d?.active ?? 0} active  ·  ${d?.mastered ?? 0} mastered`}</T>
            <T dim>{`${d?.toReview ?? 0} to review  ·  ${d?.sentMastered ?? 0} sentences mastered`}</T>
            <Bar value={d && d.learned ? d.active / d.learned : 0} tone="good" />
          </>
        )}
        <T v="small" dim>Active means you produced it (written or spoken), not only recognised it.</T>
      </Card>

      <Card onPress={() => router.push('/mistakes')}>
        <T v="h2">Frequent mistakes ›</T>
        {d?.mistakes.length ? d.mistakes.map((m) => <T key={m.id} dim>{`${m.original} → ${m.correction}  (×${m.frequency})`}</T>) : <T dim>None recorded yet. They appear after conversations and writing.</T>}
      </Card>

      <Btn kind="ghost" label="Weekly check (5 min)" onPress={() => router.push('/weekly')} />
      <Btn kind="ghost" label="Send feedback / report an issue" onPress={() => router.push('/feedback')} />
    </Screen>
  );
}

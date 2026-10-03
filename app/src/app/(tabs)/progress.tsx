import { router } from 'expo-router';
import React from 'react';

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
        <T v="h2">{`Overall: ${levelLabel(overallIndex(profile.levels))}`}</T>
        <T v="small" dim>Auto-estimation, pas une certification officielle.</T>
        {SKILLS.map((s) => (
          <Row key={s} style={{ justifyContent: 'space-between' }}>
            <T style={{ width: 110 }}>{s}</T>
            <T dim v="small">{`${Math.round((d?.week[s] ?? 0) / 60)} min/wk`}</T>
            <Tag label={levelLabel(profile.levels[s])} tone="accent" />
          </Row>
        ))}
      </Card>

      <Card>
        <T v="h2">This week</T>
        <T>{`You studied ${weekMin} minutes, ${speakMin} of them speaking.`}</T>
        <T>{`Streak: ${d?.streak ?? 0} day(s) · Total time: ${Math.round((d?.total ?? 0) / 60)} min`}</T>
      </Card>

      <Card>
        <T v="h2">Vocabulary</T>
        <T>{`${d?.learned ?? 0} words learned · ${d?.active ?? 0} active · ${d?.mastered ?? 0} mastered`}</T>
        <T>{`${d?.toReview ?? 0} to review · ${d?.sentMastered ?? 0} sentences mastered`}</T>
        <Bar value={d && d.learned ? d.active / d.learned : 0} tone="good" />
        <T v="small" dim>Active = tu l’as produit (écrit ou dit), pas seulement reconnu.</T>
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

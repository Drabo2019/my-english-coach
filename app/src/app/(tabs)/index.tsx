import { router } from 'expo-router';
import React from 'react';

import { Bar, Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { UpdateCard } from '@/features/UpdateCard';
import { levelLabel, overallIndex, weaknesses } from '@/features/placement';
import { buildPlan } from '@/features/plan';
import { isDifficult } from '@/features/srs';
import { useLoad } from '@/hooks/use-load';
import { allCards, dueCards, minutesToday, secondsBySkill, streakDays, topMistakes } from '@/services/storage/repo';
import { currentVersion, hasNativeVersion } from '@/services/updates';

export default function Home() {
  const { profile } = useApp();
  const [d] = useLoad(async () => {
    const [due, cards, mins, mistakes, streak, week] = await Promise.all([
      dueCards(200), allCards(), minutesToday(), topMistakes(1), streakDays(), secondsBySkill(7),
    ]);
    return { due: due.length, difficult: cards.filter(isDifficult).length, mins, top: mistakes[0], streak, week };
  }, [profile]);

  const overall = levelLabel(overallIndex(profile.levels));
  const plan = d
    ? buildPlan({ profile, dueCount: d.due, difficultCount: d.difficult, topMistake: d.top, minutesDoneToday: d.mins })
    : [];
  const goal = profile.minutesPerDay;
  const speakMin = d ? Math.round(((d.week['speaking'] ?? 0) + (d.week['conversation'] ?? 0)) / 60) : 0;
  const weak = weaknesses(profile.levels);

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T v="title">Today’s English</T>
        <Tag label={`Level ${overall}`} tone="accent" />
      </Row>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T>{`${d?.mins ?? 0} / ${goal} min today`}</T>
          {!!d?.streak && <T dim>{`🔥 ${d.streak} day${d.streak > 1 ? 's' : ''}`}</T>}
        </Row>
        <Bar value={(d?.mins ?? 0) / goal} tone="good" />
      </Card>

      <UpdateCard />

      <Btn label="🎙 Talk to me" onPress={() => router.push('/speak/free')} />

      <Card>
        <T v="h2">{`${plan.reduce((a, b) => a + b.minutes, 0)} minutes`}</T>
        {plan.length === 0 && <T dim>Today’s goal is done. Anything more is a bonus.</T>}
        {plan.map((b) => (
          <Card key={b.key} onPress={() => router.push(b.route as never)} style={{ padding: 10 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T style={{ fontWeight: '600' }}>{`${b.minutes} min — ${b.title}`}</T>
              <T dim>›</T>
            </Row>
            {!!b.why && <T v="small" dim>{b.why}</T>}
          </Card>
        ))}
      </Card>

      <Card>
        <T v="h2">Recommended for you</T>
        {!!d?.due && <T>{`1. Review ${d.due} due item${d.due > 1 ? 's' : ''}`}</T>}
        {!!d?.top && <T>{`2. Practise: “${d.top.original}” → “${d.top.correction}”`}</T>}
        <T>{`${(d?.due ? 1 : 0) + (d?.top ? 1 : 0) + 1}. Have a 5–7 minute conversation`}</T>
        {weak[0] && <T>{`${(d?.due ? 1 : 0) + (d?.top ? 1 : 0) + 2}. Work on ${weak[0]}`}</T>}
      </Card>

      {speakMin > 0 && (
        <Card tone="good">
          <T>{`You are improving… You spoke ${speakMin} minute${speakMin > 1 ? 's' : ''} this week.`}</T>
        </Card>
      )}

      <Row>
        <Btn small kind="ghost" label="⚡ 5-Minute English" onPress={() => router.push('/five')} />
        <Btn small kind="ghost" label="🔍 Search" onPress={() => router.push('/search')} />
        <Btn small kind="ghost" label="⭐ My English" onPress={() => router.push('/saved')} />
        <Btn small kind="ghost" label="⚙️ Settings" onPress={() => router.push('/settings')} />
      </Row>
      {hasNativeVersion() && <T v="small" dim>{`Version ${currentVersion()}`}</T>}
    </Screen>
  );
}

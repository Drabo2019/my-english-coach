import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Bar, Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { UpdateCard } from '@/features/UpdateCard';
import { levelLabel, overallIndex } from '@/features/placement';
import { buildPlan } from '@/features/plan';
import { isDifficult } from '@/features/srs';
import { useLoad } from '@/hooks/use-load';
import { useTheme } from '@/hooks/use-theme';
import { allCards, dueCards, minutesToday, secondsBySkill, streakDays, topMistakes } from '@/services/storage/repo';

export default function Today() {
  const th = useTheme();
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
  const planMinutes = plan.reduce((a, b) => a + b.minutes, 0);

  return (
    <Screen>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ fontWeight: '600' }}>{`${d?.mins ?? 0} of ${goal} min today`}</T>
          <Row style={{ gap: 10 }}>
            {!!d?.streak && <T v="small" dim>{`${d.streak}-day streak`}</T>}
            <Tag label={`Level ${overall}`} tone="accent" />
          </Row>
        </Row>
        <Bar value={(d?.mins ?? 0) / goal} tone="good" />
      </Card>

      <Btn label="Talk to me" onPress={() => router.push('/speak/free')} />

      {plan.length === 0 ? (
        <Card>
          <T>{d ? 'Today’s goal is done. Anything more is a bonus.' : 'Preparing your plan…'}</T>
        </Card>
      ) : (
        <>
          <T v="label" dim style={{ marginTop: 4 }}>{`Today’s plan · ${planMinutes} min`}</T>
          <View style={{ backgroundColor: th.card, borderColor: th.border, borderWidth: 1, borderRadius: 14, overflow: 'hidden' }}>
            {plan.map((b, i) => (
              <Pressable
                key={b.key}
                accessibilityRole="button"
                onPress={() => router.push(b.route as never)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  minHeight: 56,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: th.border,
                  backgroundColor: pressed ? th.border : 'transparent',
                })}>
                <View style={{ flex: 1 }}>
                  <T style={{ fontWeight: '600' }}>{b.title}</T>
                  {!!b.why && <T v="small" dim>{b.why[0].toUpperCase() + b.why.slice(1)}</T>}
                </View>
                <T v="small" dim>{`${b.minutes} min`}</T>
                <Ionicons name="chevron-forward" size={16} color={th.textSecondary} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {speakMin > 0 && (
        <Card tone="good">
          <T>{`You spoke ${speakMin} minute${speakMin > 1 ? 's' : ''} this week. Keep going.`}</T>
        </Card>
      )}

      <UpdateCard />
    </Screen>
  );
}

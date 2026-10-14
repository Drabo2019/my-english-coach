import { Stack } from 'expo-router';
import React from 'react';
import { Linking } from 'react-native';

import { Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { RESOURCES } from '@/data/content';
import { useApp } from '@/features/app-context';
import { levelLabel, overallIndex, weaknesses } from '@/features/placement';
import { LEVELS, SKILLS, type Skill } from '@/types';

export default function Resources() {
  const { profile } = useApp();
  const weak = weaknesses(profile.levels)[0] ?? 'listening';
  const lvl = levelLabel(profile.levels[weak]);
  const lvlIdx = LEVELS.indexOf(lvl);
  const forWeak = RESOURCES.filter((r) => r.skills.includes(weak as Skill) && r.levels.includes(lvl)).slice(0, 3);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Learn More' }} />
      <Card tone="accent">
        <T v="h2">{`Your ${weak} is your weakest skill (${lvl}).`}</T>
        <T>{`Here ${forWeak.length === 1 ? 'is 1 free resource' : `are ${forWeak.length} free resources`} for ${lvl}:`}</T>
        {forWeak.map((r) => (
          <Btn key={r.id} small kind="ghost" label={r.name} onPress={() => Linking.openURL(r.url)} />
        ))}
      </Card>
      {SKILLS.map((s) => {
        const list = RESOURCES.filter((r) => r.skills.includes(s));
        if (!list.length) return null;
        return (
          <Card key={s}>
            <T v="h2">{s[0].toUpperCase() + s.slice(1)}</T>
            {list.map((r) => {
              const fit = r.levels.includes(levelLabel(overallIndex(profile.levels))) || r.levels.some((l) => Math.abs(LEVELS.indexOf(l) - lvlIdx) <= 1);
              return (
                <Card key={r.id} onPress={() => Linking.openURL(r.url)} style={{ padding: 10 }}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <T style={{ fontWeight: '600', flex: 1 }}>{r.name}</T>
                    {fit && <Tag label="fits your level" tone="good" />}
                  </Row>
                  <T v="small" dim>{r.note}</T>
                </Card>
              );
            })}
          </Card>
        );
      })}
      <T v="small" dim>External resources: their content belongs to their publishers; the app does not copy it.</T>
    </Screen>
  );
}

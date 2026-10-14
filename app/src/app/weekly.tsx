import { router, Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';

import { Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { levelLabel, PLACEMENT, type PlacementItem } from '@/features/placement';
import { addScore } from '@/services/storage/repo';
import { tts } from '@/services/speech';
import { LEVELS, type Skill } from '@/types';

const SKILLS_TESTED: Skill[] = ['vocabulary', 'grammar', 'listening', 'reading'];

export default function Weekly() {
  const { profile, updateProfile } = useApp();
  const items = useMemo<PlacementItem[]>(() => {
    // 2 items per skill, centred on the learner's current level
    return SKILLS_TESTED.flatMap((s) => {
      const lvl = Math.round(profile.levels[s]);
      return PLACEMENT.filter((p) => p.skill === s)
        .sort((a, b) => Math.abs(LEVELS.indexOf(a.level) - lvl) - Math.abs(LEVELS.indexOf(b.level) - lvl) + (Math.random() - 0.5))
        .slice(0, 2);
    });
  }, [profile.levels]);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState<Record<string, { before: number; after: number }> | null>(null);

  const finish = async (a: Record<string, boolean>) => {
    const out: Record<string, { before: number; after: number }> = {};
    const levels = { ...profile.levels };
    for (const s of SKILLS_TESTED) {
      const its = items.filter((x) => x.skill === s);
      const ok = its.filter((x) => a[x.id]).length;
      const lvlIdx = Math.round(profile.levels[s]);
      // wrong answers pull the estimate slightly down, right ones nudge it up (small steps: this is only 2 items)
      const delta = (ok / its.length - 0.5) * 0.4;
      const next = Math.max(0, Math.min(6, Math.round((profile.levels[s] + delta) * 10) / 10));
      levels[s] = next;
      out[s] = { before: lvlIdx, after: next };
      await addScore(s, next, 'weekly');
    }
    await updateProfile({ levels });
    setDone(out);
  };

  if (done) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Weekly check' }} />
        <T v="title">Weekly check</T>
        <T dim>An estimate from a few questions: read it as a trend, not a verdict.</T>
        {Object.entries(done).map(([s, v]) => (
          <Card key={s}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T v="h2">{s}</T>
              <Tag label={`${levelLabel(v.before)} → ${levelLabel(v.after)}`} tone={v.after > v.before ? 'good' : 'accent'} />
            </Row>
          </Card>
        ))}
        <Btn label="Done" onPress={() => router.back()} />
      </Screen>
    );
  }

  const it = items[i];
  const next = (ok: boolean) => {
    const a = { ...ans, [it.id]: ok };
    setAns(a);
    if (i + 1 < items.length) setI(i + 1);
    else finish(a);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Weekly check' }} />
      <T v="label" dim>{`${i + 1} / ${items.length} · ${it.skill}`}</T>
      {it.audio && <Btn kind="ghost" label="🔊 Play audio" onPress={() => tts.speak(it.audio!)} />}
      <T v="h2">{it.prompt}</T>
      {it.options.map((o, k) => (
        <Btn key={o} kind="ghost" label={o} onPress={() => next(k === it.answer)} />
      ))}
    </Screen>
  );
}

import { Stack, router } from 'expo-router';
import React, { useState } from 'react';

import { Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { SCENARIOS } from '@/data/scenarios';
import type { CorrectionMode } from '@/types';

const LEVELS: { label: string; mode: CorrectionMode }[] = [
  { label: 'Beginner', mode: 'beginner' },
  { label: 'Intermediate', mode: 'friendly' },
  { label: 'Advanced', mode: 'immersion' },
  { label: 'Free (Teacher)', mode: 'teacher' },
];

export default function Scenarios() {
  const { updateSettings } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Scenarios' }} />
      {SCENARIOS.map((s) => (
        <Card key={s.id} onPress={() => setOpen(open === s.id ? null : s.id)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2">{`${s.icon}  ${s.title}`}</T>
            <Tag label={s.level} tone="accent" />
          </Row>
          <T dim v="small">{s.goal}</T>
          {open === s.id && (
            <Row style={{ marginTop: 6 }}>
              {LEVELS.map((l) => (
                <Btn
                  key={l.label}
                  small
                  kind="ghost"
                  label={l.label}
                  onPress={async () => {
                    await updateSettings({ correctionMode: l.mode });
                    router.push({ pathname: '/speak/conversation', params: { scenario: s.id } });
                  }}
                />
              ))}
            </Row>
          )}
        </Card>
      ))}
    </Screen>
  );
}

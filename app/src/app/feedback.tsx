import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Share } from 'react-native';

import { Btn, Card, Chip, Input, Row, Screen, T } from '@/components/ui';
import { useLoad } from '@/hooks/use-load';
import { addFeedback, allFeedback } from '@/services/storage/repo';

const KINDS = ['Too easy', 'Too hard', 'Useful', 'Useless', 'I didn’t understand', 'I want more sentences', 'I want more conversation', 'I get stuck here', 'This correction is wrong'];

export default function Feedback() {
  const { screen } = useLocalSearchParams<{ screen?: string }>();
  const [kind, setKind] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [list, reload] = useLoad(allFeedback);

  const counts = (list ?? []).reduce<Record<string, number>>((a, f) => ({ ...a, [f.kind]: (a[f.kind] ?? 0) + 1 }), {});

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Feedback' }} />
      <T dim>Tes retours alimentent la roadmap (phase « real user test »). Un tap suffit.</T>
      <Row>
        {KINDS.map((k) => (
          <Chip key={k} label={k} active={kind === k} onPress={() => setKind(k)} />
        ))}
      </Row>
      <Input value={note} onChangeText={setNote} placeholder="Details (optional)" multiline />
      <Btn
        label="Save feedback"
        disabled={!kind}
        onPress={async () => {
          await addFeedback(screen ?? 'general', kind!, note.trim() || undefined);
          setKind(null);
          setNote('');
          reload();
        }}
      />
      {Object.keys(counts).length > 0 && (
        <Card>
          <T v="h2">Your feedback so far</T>
          {Object.entries(counts).map(([k, n]) => (
            <T key={k}>{`${k}: ${n}`}</T>
          ))}
          <Btn
            small
            kind="ghost"
            label="Export (share as text)"
            onPress={() =>
              Share.share({
                message: (list ?? []).map((f) => `${new Date(f.ts).toISOString().slice(0, 10)} [${f.screen}] ${f.kind}${f.note ? ` — ${f.note}` : ''}`).join('\n'),
              })
            }
          />
        </Card>
      )}
    </Screen>
  );
}

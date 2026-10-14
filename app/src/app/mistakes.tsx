import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { Btn, Card, Input, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { similarity } from '@/features/items';
import { useLoad } from '@/hooks/use-load';
import { topMistakes } from '@/services/storage/repo';
import { useTheme } from '@/hooks/use-theme';

export default function Mistakes() {
  const th = useTheme();
  const [list] = useLoad(() => topMistakes(50));
  const [drill, setDrill] = useState<string | null>(null);
  const [ans, setAns] = useState('');
  const [ok, setOk] = useState<boolean | null>(null);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'My English Mistakes' }} />
      <T dim>Your recurring mistakes (found in conversation and writing). They drive your plan: 30 seconds per mistake, regularly, beat a whole lesson.</T>
      {list && list.length === 0 && <Card><T>No mistakes recorded yet. Have a conversation or write a text, then come back here.</T></Card>}
      {list?.map((m) => (
        <Card key={m.id}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Tag label={m.category} />
            <T v="small" dim>{`×${m.frequency}`}</T>
          </Row>
          <T color={th.bad}>{`❌ ${m.original}`}</T>
          <T color={th.good}>{`✅ ${m.correction}`}</T>
          <T v="small" dim>{m.explanation}</T>
          <Speak text={m.correction} />
          {drill === m.id ? (
            <>
              <T>{`Correct it: “${m.original}”`}</T>
              <Input value={ans} onChangeText={setAns} autoCapitalize="none" placeholder="Your correction…" />
              <Btn small label="Check" onPress={() => setOk(similarity(ans, m.correction) >= 0.8)} />
              {ok !== null && <T color={ok ? th.good : th.bad}>{ok ? '✅ Correct!' : `Not yet — ${m.correction}`}</T>}
            </>
          ) : (
            <Btn small kind="ghost" label="Practise this" onPress={() => { setDrill(m.id); setAns(''); setOk(null); }} />
          )}
        </Card>
      ))}
    </Screen>
  );
}

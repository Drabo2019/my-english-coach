import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { Btn, Card, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { PRONUNCIATION } from '@/data/content';
import { useTheme } from '@/hooks/use-theme';
import { pronunciation, stt, tts } from '@/services/speech';
import { addScore, logActivity } from '@/services/storage/repo';

type Res = ReturnType<typeof pronunciation.assess> & { heard: string };

export default function Pronunciation() {
  const th = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Record<string, Res>>({});
  const [err, setErr] = useState('');

  const test = async (id: string, sentence: string) => {
    setBusy(true);
    setErr('');
    tts.stop();
    const t0 = Date.now();
    try {
      const r = await stt.listen({ hints: sentence.split(' ') });
      const a = pronunciation.assess(sentence, r);
      setRes((x) => ({ ...x, [id]: { ...a, heard: r.transcript } }));
      await logActivity('pronunciation', (Date.now() - t0) / 1000, id);
      await addScore('pronunciation', (a.score / 100) * 4, 'drill');
    } catch (e) {
      setErr(`${e instanceof Error ? e.message : e}`);
    }
    setBusy(false);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Pronunciation' }} />
      <T dim>Écoute chaque mot (normal puis lent), repère la différence, puis répète la phrase. La reconnaissance vérifie que chaque mot est compris comme voulu — ce n’est pas un score de phonèmes.</T>
      {PRONUNCIATION.map((p) => (
        <Card key={p.id} onPress={() => setOpen(open === p.id ? null : p.id)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2">{`${p.a}  ≠  ${p.b}`}</T>
            <Tag label={p.sounds} />
          </Row>
          {open === p.id && (
            <>
              <T dim>{p.tip}</T>
              <Row>
                <Btn small kind="ghost" label={`🔊 ${p.a}`} onPress={() => tts.speak(p.a, { rate: 0.6 })} />
                <Btn small kind="ghost" label={`🔊 ${p.b}`} onPress={() => tts.speak(p.b, { rate: 0.6 })} />
              </Row>
              <T>{p.sentence}</T>
              <Speak text={p.sentence} />
              <Btn label={busy ? 'Listening…' : '🎙 Repeat the sentence'} disabled={busy} onPress={() => test(p.id, p.sentence)} />
              {res[p.id] && (
                <Card tone={res[p.id].score >= 80 ? 'good' : 'warn'}>
                  <T>{`${res[p.id].score}% · heard: “${res[p.id].heard}”`}</T>
                  <Row>
                    {res[p.id].words.map((w, k) => (
                      <T key={k} color={w.ok ? th.good : th.bad}>
                        {w.word}
                      </T>
                    ))}
                  </Row>
                  <T v="small" dim>{res[p.id].note}</T>
                </Card>
              )}
            </>
          )}
        </Card>
      ))}
      {err !== '' && <T color={th.bad}>{err}</T>}
    </Screen>
  );
}

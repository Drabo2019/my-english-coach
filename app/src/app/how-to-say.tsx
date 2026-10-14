import { Stack, router } from 'expo-router';
import React, { useState } from 'react';

import { Btn, Card, Input, Row, Screen, Speak, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { similarity } from '@/features/items';
import { getAI } from '@/services/ai';
import type { PhraseEntry } from '@/data/phrasebook';
import { stt } from '@/services/speech';
import { logActivity, toggleSaved } from '@/services/storage/repo';
import { useTheme } from '@/hooks/use-theme';

export default function HowToSay() {
  const th = useTheme();
  const { profile } = useApp();
  const [fr, setFr] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<PhraseEntry | null | undefined>(undefined);
  const [online, setOnline] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempt, setAttempt] = useState('');
  const [listening, setListening] = useState(false);

  const go = async () => {
    setBusy(true);
    setRes(undefined);
    setAttempt('');
    setSaved(false);
    const ai = await getAI();
    setOnline(ai.online);
    setRes(await ai.howToSay(fr.trim(), profile));
    setBusy(false);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'How do I say…?', presentation: 'modal', headerRight: () => <Btn small kind="ghost" label="Close" onPress={() => router.back()} /> }} />
      <T dim>Type or dictate in French. You get natural English to say right away.</T>
      <Input value={fr} onChangeText={setFr} placeholder="Comment dire : « Je vais vérifier et je te tiens au courant. »" multiline autoFocus />
      <Btn label={busy ? 'Searching…' : 'Say it in English'} disabled={busy || !fr.trim()} onPress={go} />

      {res === null && (
        <Card tone="warn">
          <T>Je n’ai pas cette phrase dans la phrasebook hors-ligne.</T>
          <T v="small" dim>Turn on the AI partner in Settings (a local model such as Ollama, or an OpenAI-compatible API) to translate any sentence.</T>
        </Card>
      )}

      {res && (
        <>
          <Card tone="good">
            <T v="label" dim>Natural English</T>
            <T v="title">{res.natural}</T>
            <Speak text={res.natural} />
            {!online && <T v="small" dim>Source : phrasebook hors-ligne</T>}
          </Card>
          {res.alternatives?.length > 0 && (
            <Card>
              <T v="label" dim>Alternatives</T>
              {res.alternatives.map((a) => (
                <T key={a}>{`• ${a}`}</T>
              ))}
            </Card>
          )}
          <Card>
            <T>{`Formal: ${res.formal}`}</T>
            <T>{`Informal: ${res.informal}`}</T>
            {!!res.explain && <T v="small" dim>{res.explain}</T>}
          </Card>

          <Card>
            <T v="label" dim>Mini exercise — now you say it</T>
            <Btn
              kind="ghost"
              label={listening ? 'Listening…' : '🎙 Say it'}
              disabled={listening}
              onPress={async () => {
                setListening(true);
                try {
                  const r = await stt.listen({ hints: res.natural.split(' ') });
                  setAttempt(r.transcript);
                  await logActivity('speaking', 8, 'how-to-say');
                } catch {
                  /* mic unavailable */
                }
                setListening(false);
              }}
            />
            {!!attempt && (
              <T color={similarity(attempt, res.natural) >= 0.8 ? th.good : th.warn}>
                {`${similarity(attempt, res.natural) >= 0.8 ? '✅' : '↻'} Heard: ${attempt}`}
              </T>
            )}
          </Card>
          <Row>
            <Btn small kind="ghost" label={saved ? '⭐ Saved' : '☆ Save to My English'} onPress={async () => setSaved(await toggleSaved('phrase', res.natural))} />
          </Row>
        </>
      )}
    </Screen>
  );
}

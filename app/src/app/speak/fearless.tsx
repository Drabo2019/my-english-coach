import { Stack, router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';

import { Btn, Card, Row, Screen, T, Tag } from '@/components/ui';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useTheme } from '@/hooks/use-theme';
import { useLoad } from '@/hooks/use-load';
import { stt } from '@/services/speech';
import { kvGet, kvSet } from '@/services/storage/db';
import { logActivity } from '@/services/storage/repo';

const STEPS = [
  { t: 'Say one sentence', d: 'Une seule phrase, n’importe laquelle.', prompts: ['Say one sentence about your day.', 'Say one sentence about your job.'], target: 3 },
  { t: 'Answer a simple question', d: 'Réponse courte à une question.', prompts: ['What is your name and where are you from?', 'What do you do for work?'], target: 6 },
  { t: 'Speak for 30 seconds', d: 'Parle 30 secondes, même avec des erreurs.', prompts: ['Describe your morning routine.', 'Describe your workplace.'], target: 30 },
  { t: 'Speak for 1 minute', d: 'Une minute sans t’arrêter.', prompts: ['Talk about your favourite place.', 'Talk about a typical weekend.'], target: 60 },
  { t: 'Explain something', d: 'Explique comment ça marche.', prompts: ['Explain how you make a coffee.', 'Explain your job to a child.'], target: 45 },
  { t: 'Tell a story', d: 'Utilise le passé : first, then, finally.', prompts: ['Tell a story about a trip.', 'Tell the story of a problem you solved.'], target: 60 },
  { t: 'Defend an opinion', d: 'I think… because…', prompts: ['Is remote work better than office work?', 'Should everyone learn English?'], target: 60 },
];

const CONVO = [
  { t: 'Improvised conversation', route: '/speak/free' },
  { t: 'Professional discussion', route: '/speak/conversation?scenario=meeting' },
  { t: 'Free conversation', route: '/speak/free' },
];

export default function Fearless() {
  const th = useTheme();
  const [done, reload] = useLoad(() => kvGet<number>('fearless', 0));
  const [step, setStep] = useState<number | null>(null);
  const [p, setP] = useState(0);
  const [text, setText] = useState('');
  const [secs, setSecs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const t0 = useRef(0);
  const leave = useCallback(() => { stt.stop(); setStep(null); setText(''); setSecs(null); }, []);
  useInnerBack(step !== null, leave);

  if (step !== null && step < STEPS.length) {
    const s = STEPS[step];
    return (
      <Screen>
        <Stack.Screen options={{ title: `Step ${step + 1} / 10` }} />
        <T v="title">{s.t}</T>
        <T dim>{s.d}</T>
        <Card>
          <T v="h2">{s.prompts[p % s.prompts.length]}</T>
          <T v="small" dim>{`Goal: about ${s.target} seconds. Les erreurs ne comptent pas : communication first, perfection later.`}</T>
        </Card>
        <Btn
          label={busy ? 'Listening…' : '🎙 Start speaking'}
          disabled={busy}
          onPress={async () => {
            setBusy(true);
            setErr('');
            setText('');
            t0.current = Date.now();
            try {
              const r = await stt.listen({ onPartial: setText });
              setText(r.transcript);
              const sec = (Date.now() - t0.current) / 1000;
              setSecs(sec);
              await logActivity('speaking', sec, `fearless-${step + 1}`);
            } catch (e) {
              setErr(`${e instanceof Error ? e.message : e}`);
            }
            setBusy(false);
          }}
        />
        {!!text && (
          <Card tone="good">
            <T>{text}</T>
            <T v="small" dim>{`${text.split(/\s+/).filter(Boolean).length} words${secs ? ` in ${Math.round(secs)} s` : ''}. You did it.`}</T>
          </Card>
        )}
        {err !== '' && <T color={th.bad}>{err}</T>}
        <Row>
          <Btn small kind="ghost" label="← Back" onPress={leave} />
          <Btn small kind="ghost" label="Another prompt" onPress={() => { setP(p + 1); setText(''); setSecs(null); }} />
          <Btn
            small
            label="Step done ✓"
            onPress={async () => {
              await kvSet('fearless', Math.max(done ?? 0, step + 1));
              reload();
              setStep(null);
              setText('');
              setSecs(null);
            }}
          />
        </Row>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Speak without fear' }} />
      <T dim>Dix étapes progressives. Aucune n’est un échec : tu parles, c’est tout ce qu’on mesure.</T>
      {STEPS.map((s, k) => (
        <Card key={k} onPress={() => { setStep(k); setP(0); }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2">{`Level ${k + 1} · ${s.t}`}</T>
            {(done ?? 0) > k && <Tag label="done" tone="good" />}
          </Row>
        </Card>
      ))}
      {CONVO.map((c, k) => (
        <Card key={c.t} onPress={() => router.push(c.route as never)}>
          <T v="h2">{`Level ${8 + k} · ${c.t}`}</T>
        </Card>
      ))}
    </Screen>
  );
}

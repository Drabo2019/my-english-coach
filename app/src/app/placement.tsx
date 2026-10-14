import { Stack, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { Btn, Card, HeaderBtn, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useTheme } from '@/hooks/use-theme';
import { applyPlacement, levelLabel, overallIndex, PLACEMENT, PLACEMENT_SPEAK, weaknesses, type Answers } from '@/features/placement';
import { addScore } from '@/services/storage/repo';
import { pronunciation, stt, tts } from '@/services/speech';
import { SKILLS, type Profile } from '@/types';

type Phase = 'mcq' | 'speak' | 'confidence' | 'result';

export default function Placement() {
  const th = useTheme();
  const { profile, updateProfile } = useApp();
  const [phase, setPhase] = useState<Phase>('mcq');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [si, setSi] = useState(0);
  const [speakScores, setSpeakScores] = useState<number[]>([]);
  const [heard, setHeard] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<Profile | null>(null);

  const quit = useCallback(() => {
    if (phase === 'result') {
      router.replace('/(tabs)');
      return;
    }
    Alert.alert('Quitter le test ?', 'Tu pourras le refaire plus tard (Progress → Weekly check). Le niveau par défaut sera utilisé.', [
      { text: 'Continuer le test', style: 'cancel' },
      {
        text: 'Quitter',
        style: 'destructive',
        onPress: async () => {
          await updateProfile({ onboarded: true });
          router.replace('/(tabs)');
        },
      },
    ]);
  }, [phase, updateProfile]);
  useInnerBack(true, quit);

  const items = [...PLACEMENT].sort((a, b) => a.skill.localeCompare(b.skill));
  const total = items.length + PLACEMENT_SPEAK.length;

  const finish = async (confidence: Profile['confidence']) => {
    const next = applyPlacement(profile, answers, speakScores, confidence);
    await updateProfile({ levels: next.levels, confidence, onboarded: true });
    for (const s of SKILLS) await addScore(s, next.levels[s], 'placement');
    setResult(next);
    setPhase('result');
  };

  if (phase === 'mcq') {
    const it = items[i];
    return (
      <Screen>
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quitter" onPress={quit} /> }} />
        <T v="label" dim>{`Question ${i + 1} / ${total}  ·  ${it.skill}`}</T>
        {it.audio && <Btn kind="ghost" label="🔊 Play audio" onPress={() => tts.speak(it.audio!, { rate: 0.9 })} />}
        <T v="h2">{it.prompt}</T>
        {it.options.map((o, idx) => (
          <Btn
            key={o}
            kind="ghost"
            label={o}
            onPress={() => {
              setAnswers((a) => ({ ...a, [it.id]: idx === it.answer }));
              if (i + 1 < items.length) setI(i + 1);
              else setPhase('speak');
            }}
          />
        ))}
        <Btn
          kind="ghost"
          label="I don’t know"
          onPress={() => {
            setAnswers((a) => ({ ...a, [it.id]: false }));
            if (i + 1 < items.length) setI(i + 1);
            else setPhase('speak');
          }}
        />
      </Screen>
    );
  }

  if (phase === 'speak') {
    const sp = PLACEMENT_SPEAK[si];
    const next = (score: number | null) => {
      if (score !== null) setSpeakScores((s) => [...s, score]);
      setHeard('');
      setErr('');
      if (si + 1 < PLACEMENT_SPEAK.length) setSi(si + 1);
      else setPhase('confidence');
    };
    return (
      <Screen>
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quitter" onPress={quit} /> }} />
        <T v="label" dim>{`Say it aloud ${si + 1} / ${PLACEMENT_SPEAK.length}`}</T>
        <Card>
          <T v="h2">{sp.target}</T>
        </Card>
        <Btn kind="ghost" label="🔊 Listen first" onPress={() => tts.speak(sp.target, { rate: 0.8 })} />
        <Btn
          label={busy ? 'Listening…' : '🎙 Tap and speak'}
          disabled={busy}
          onPress={async () => {
            setBusy(true);
            setErr('');
            try {
              const r = await stt.listen({ hints: sp.target.split(' '), onPartial: setHeard });
              setHeard(r.transcript);
              const a = pronunciation.assess(sp.target, r);
              setBusy(false);
              next(a.score);
            } catch (e) {
              setBusy(false);
              setErr(String(e instanceof Error ? e.message : e));
            }
          }}
        />
        {heard !== '' && <T dim>{`Heard: ${heard}`}</T>}
        {err !== '' && <T color={th.bad}>{err}</T>}
        <Btn small kind="ghost" label="Passer cette étape" onPress={() => next(null)} />
      </Screen>
    );
  }

  if (phase === 'confidence') {
    return (
      <Screen>
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quitter" onPress={quit} /> }} />
        <T v="h2">Quand tu parles anglais, tu te sens…</T>
        <Btn kind="ghost" label="Plutôt bloqué / peur de faire des erreurs" onPress={() => finish('low')} />
        <Btn kind="ghost" label="Moyen : ça dépend des situations" onPress={() => finish('medium')} />
        <Btn kind="ghost" label="À l’aise" onPress={() => finish('high')} />
      </Screen>
    );
  }

  const r = result!;
  const weak = weaknesses(r.levels);
  return (
    <Screen>
      <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Fermer" onPress={quit} /> }} />
      <T v="title">Your starting profile</T>
      <T dim>Estimation pour régler ton programme — pas une certification officielle. Elle sera affinée à chaque semaine.</T>
      <Card tone="accent">
        <T v="h2">{`Overall: ${levelLabel(overallIndex(r.levels))}`}</T>
        {SKILLS.map((s) => (
          <Row key={s} style={{ justifyContent: 'space-between' }}>
            <T>{s[0].toUpperCase() + s.slice(1)}</T>
            <Tag label={levelLabel(r.levels[s])} tone="accent" />
          </Row>
        ))}
      </Card>
      <Card>
        <T v="h2">Priority</T>
        <T>{weak.length ? weak.slice(0, 3).join(' + ') : 'Balanced: keep every skill moving'}</T>
        <T dim>Speaking et spontanéité sont toujours favorisés dans ton plan quotidien.</T>
      </Card>
      <Btn label="Go to my plan" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}

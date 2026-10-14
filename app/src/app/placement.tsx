import { Stack, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { Bar, Btn, Card, HeaderBtn, Row, Screen, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useTheme } from '@/hooks/use-theme';
import { applyPlacement, levelLabel, overallIndex, PLACEMENT, PLACEMENT_SPEAK, weaknesses, type Answers } from '@/features/placement';
import { addScore } from '@/services/storage/repo';
import { pronunciation, stt, tts } from '@/services/speech';
import { LEVELS, SKILLS, type Profile } from '@/types';

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
    Alert.alert('Quit the test?', 'You can retake it later in Settings. The default level (A2) will be used.', [
      { text: 'Continue the test', style: 'cancel' },
      {
        text: 'Quit',
        style: 'destructive',
        onPress: async () => {
          await updateProfile({ onboarded: true });
          router.replace('/(tabs)');
        },
      },
    ]);
  }, [phase, updateProfile]);
  useInnerBack(true, quit);

  // Difficulty rises steadily (A1 to C2) with the skills interleaved, instead of restarting at A1 for each skill.
  const items = [...PLACEMENT].sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.skill.localeCompare(b.skill));
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
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quit" onPress={quit} /> }} />
        <T v="label" dim>{`Question ${i + 1} of ${total}  ·  ${it.skill}`}</T>
        <Bar value={(i + 1) / total} />
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
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quit" onPress={quit} /> }} />
        <T v="label" dim>{`Say it aloud ${si + 1} of ${PLACEMENT_SPEAK.length}`}</T>
        <Bar value={(items.length + si + 1) / total} />
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
        <Btn small kind="ghost" label="Skip this step" onPress={() => next(null)} />
      </Screen>
    );
  }

  if (phase === 'confidence') {
    return (
      <Screen>
        <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Quit" onPress={quit} /> }} />
        <T v="h2">When you speak English, you feel…</T>
        <Btn kind="ghost" label="Often stuck, afraid of making mistakes" onPress={() => finish('low')} />
        <Btn kind="ghost" label="In between: it depends on the situation" onPress={() => finish('medium')} />
        <Btn kind="ghost" label="Comfortable" onPress={() => finish('high')} />
      </Screen>
    );
  }

  const r = result!;
  const weak = weaknesses(r.levels);
  return (
    <Screen>
      <Stack.Screen options={{ headerRight: () => <HeaderBtn label="Close" onPress={quit} /> }} />
      <T v="title">Your starting profile</T>
      <T dim>An estimate to tune your plan, not an official certification. It is refined every week.</T>
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
        <T dim>Speaking and spontaneity are always favoured in your daily plan.</T>
      </Card>
      <Btn label="Go to my plan" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}

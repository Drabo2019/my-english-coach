import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Btn, Card, Chip, Input, Row, Screen, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useTheme } from '@/hooks/use-theme';

const GOALS = ['Work', 'Conversation', 'Travel', 'Living abroad', 'Studies', 'Exams', 'Technology', 'Films and series', 'Confidence', 'General level'];
const TIMES = [5, 10, 15, 20, 30, 45, 60];
const STEPS = 3;

export default function Onboarding() {
  const th = useTheme();
  const { updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>(['Work', 'Confidence']);
  const [minutes, setMinutes] = useState(15);
  const [domain, setDomain] = useState('engineering / electronics');
  const [variant, setVariant] = useState<'intl' | 'us' | 'uk'>('intl');

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  useInnerBack(step > 0, back);

  const toggle = (g: string) => setGoals((x) => (x.includes(g) ? x.filter((y) => y !== g) : [...x, g]));
  const save = () => updateProfile({ goals, minutesPerDay: minutes, domain, variant });
  const skip = async () => {
    await updateProfile({ goals, minutesPerDay: minutes, domain, variant, onboarded: true });
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', marginTop: 36 }}>
        <T v="label" dim>{`Step ${step + 1} of ${STEPS}`}</T>
        <Row style={{ gap: 4 }}>
          {Array.from({ length: STEPS }, (_, k) => (
            <View key={k} style={{ width: 22, height: 4, borderRadius: 2, backgroundColor: k <= step ? th.accent : th.border }} />
          ))}
        </Row>
      </Row>

      {step === 0 && (
        <>
          <T v="title">What do you need English for?</T>
          <T dim>My English Coach finds what you know, what you forget and where you get stuck, then gets you speaking. Pick as many as you like; you can change this later.</T>
          <Row>
            {GOALS.map((g) => (
              <Chip key={g} label={g} active={goals.includes(g)} onPress={() => toggle(g)} />
            ))}
          </Row>
          <Btn label="Continue" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <T v="title">Set up your practice</T>
          <T v="h2">Time per day</T>
          <Row>
            {TIMES.map((m) => (
              <Chip key={m} label={m === 60 ? '60+ min' : `${m} min`} active={minutes === m} onPress={() => setMinutes(m)} />
            ))}
          </Row>
          <T v="h2">Your field of work</T>
          <Input value={domain} onChangeText={setDomain} placeholder="e.g. engineering / electronics" />
          <T v="h2">English variant</T>
          <Row>
            <Chip label="International (recommended)" active={variant === 'intl'} onPress={() => setVariant('intl')} />
            <Chip label="American" active={variant === 'us'} onPress={() => setVariant('us')} />
            <Chip label="British" active={variant === 'uk'} onPress={() => setVariant('uk')} />
          </Row>
          <Btn label="Continue" onPress={() => setStep(2)} />
          <Pressable accessibilityRole="button" hitSlop={8} onPress={back} style={{ alignSelf: 'center', padding: 8 }}>
            <T color={th.accent} style={{ fontWeight: '600' }}>Back</T>
          </Pressable>
        </>
      )}

      {step === 2 && (
        <>
          <T v="title">Check your level</T>
          <Card>
            <T v="h2">About 10 minutes</T>
            <T dim>Vocabulary, grammar, reading and listening from A1 to C2, then a few sentences to say aloud. It is an estimate to tune your plan, not a certification. Skip a question if you don’t know: guessing hides your real level.</T>
          </Card>
          <Btn
            label="Start the test"
            onPress={async () => {
              await save();
              router.replace('/placement');
            }}
          />
          <Pressable accessibilityRole="button" hitSlop={8} onPress={skip} style={{ alignSelf: 'center', padding: 8 }}>
            <T color={th.accent} style={{ fontWeight: '600' }}>Skip for now (A2 by default)</T>
          </Pressable>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={back} style={{ alignSelf: 'center', padding: 8 }}>
            <T dim style={{ fontWeight: '600' }}>Back</T>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

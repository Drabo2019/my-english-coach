import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { Btn, Card, Chip, Input, Row, Screen, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { useInnerBack } from '@/hooks/use-inner-back';

const GOALS = ['Conversation', 'Work', 'Travel', 'Living abroad', 'Studies', 'Exams', 'Technology', 'Understanding films', 'Confidence', 'General level'];
const TIMES = [5, 10, 15, 20, 30, 45, 60];

export default function Onboarding() {
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

  return (
    <Screen>
      <T v="title" style={{ marginTop: 40 }}>
        My English Coach
      </T>
      {step === 0 && (
        <>
          <T>Un coach personnel : il repère ce que tu sais, ce que tu oublies et où tu bloques, puis te fait parler. Pas de promesse de « fluent en 30 jours », seulement des progrès mesurés.</T>
          <T v="h2">Pourquoi apprends-tu l’anglais ?</T>
          <Row>
            {GOALS.map((g) => (
              <Chip key={g} label={g} active={goals.includes(g)} onPress={() => toggle(g)} />
            ))}
          </Row>
          <Btn label="Continuer" onPress={() => setStep(1)} />
        </>
      )}
      {step === 1 && (
        <>
          <T v="h2">Temps disponible par jour</T>
          <Row>
            {TIMES.map((m) => (
              <Chip key={m} label={m === 60 ? '60+ min' : `${m} min`} active={minutes === m} onPress={() => setMinutes(m)} />
            ))}
          </Row>
          <T v="h2">Ton domaine professionnel</T>
          <Input value={domain} onChangeText={setDomain} placeholder="ex. engineering / electronics" />
          <T v="h2">Variante d’anglais</T>
          <Row>
            <Chip label="International (recommandé)" active={variant === 'intl'} onPress={() => setVariant('intl')} />
            <Chip label="American" active={variant === 'us'} onPress={() => setVariant('us')} />
            <Chip label="British" active={variant === 'uk'} onPress={() => setVariant('uk')} />
          </Row>
          <Row>
            <Btn kind="ghost" label="← Retour" onPress={back} />
            <Btn label="Continuer" onPress={() => setStep(2)} />
          </Row>
        </>
      )}
      {step === 2 && (
        <>
          <Card>
            <T v="h2">Test de niveau (≈ 8 min)</T>
            <T dim>Vocabulaire, grammaire, lecture, écoute, puis quelques phrases à répéter à voix haute. Ce n’est pas une certification officielle : une estimation pour régler ton programme. Tu peux te tromper : c’est le but.</T>
          </Card>
          <Btn
            label="Commencer le test"
            onPress={async () => {
              await save();
              router.replace('/placement');
            }}
          />
          <Btn kind="ghost" label="← Retour" onPress={back} />
          <Btn
            kind="ghost"
            label="Passer (niveau A2 par défaut)"
            onPress={async () => {
              await updateProfile({ goals, minutesPerDay: minutes, domain, variant, onboarded: true });
              router.replace('/(tabs)');
            }}
          />
        </>
      )}
    </Screen>
  );
}

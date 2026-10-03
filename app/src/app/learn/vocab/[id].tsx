import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { Btn, Card, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { vocabById } from '@/data/vocabulary';
import { getCard, isSaved, saveCard, toggleSaved } from '@/services/storage/repo';
import { newCard } from '@/features/srs';

export default function VocabDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const v = vocabById(id);
  const [saved, setSaved] = useState(false);
  const [inSrs, setInSrs] = useState(false);

  useEffect(() => {
    if (!v) return;
    isSaved('vocab', v.id).then(setSaved);
    getCard(`vocab:${v.id}`, 'vocab').then((c) => setInSrs(c.reps > 0 || c.state !== 'NEW'));
  }, [v]);

  if (!v) return <Screen><T>Word not found.</T></Screen>;

  const section = (label: string, items?: string[]) =>
    items && items.length ? (
      <Card>
        <T v="label" dim>{label}</T>
        <T>{items.join(' · ')}</T>
      </Card>
    ) : null;

  return (
    <Screen>
      <Stack.Screen options={{ title: v.word }} />
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T v="title">{v.word}</T>
          <Row>
            <Tag label={v.level} tone="accent" />
            <Tag label={v.register} tone={v.register === 'neutral' ? undefined : 'warn'} />
          </Row>
        </Row>
        <T dim>{`${v.ipa} · ${v.pos}`}</T>
        <T v="h2">{v.fr.join(', ')}</T>
        <Speak text={v.word} />
      </Card>

      {v.meanings && (
        <Card>
          <T v="label" dim>Several meanings</T>
          {v.meanings.map((m) => (
            <T key={m}>{`• ${m}`}</T>
          ))}
        </Card>
      )}

      <Card>
        <T v="label" dim>Examples</T>
        {v.examples.map((e) => (
          <React.Fragment key={e.en}>
            <T>{e.en}</T>
            <T v="small" dim>{e.fr}</T>
            <Speak text={e.en} />
          </React.Fragment>
        ))}
      </Card>

      {section('Common collocations', v.collocations)}
      {section('Synonyms', v.synonyms)}
      {section('Antonyms', v.antonyms)}
      {section('Related', v.related)}
      {v.usUk && (
        <Card>
          <T v="label" dim>US / UK</T>
          <T>{v.usUk}</T>
        </Card>
      )}
      {v.mistakes && (
        <Card tone="warn">
          <T v="label" dim>Common mistake</T>
          <T>{v.mistakes}</T>
        </Card>
      )}

      <Row>
        <Btn small kind="ghost" label={saved ? '⭐ Saved' : '☆ Save'} onPress={async () => setSaved(await toggleSaved('vocab', v.id))} />
        <Btn
          small
          kind={inSrs ? 'ghost' : 'primary'}
          label={inSrs ? '✓ In your review' : '+ Add to review'}
          disabled={inSrs}
          onPress={async () => {
            const c = await getCard(`vocab:${v.id}`, 'vocab');
            await saveCard({ ...newCard(c.id, 'vocab'), state: 'LEARNING', due: Date.now() });
            setInSrs(true);
          }}
        />
      </Row>
    </Screen>
  );
}

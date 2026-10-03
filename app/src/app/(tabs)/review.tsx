import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Bar, Btn, Card, Input, Row, Screen, Speak, T, Tag } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { itemFor, pickNew, similarity, type ReviewItem } from '@/features/items';
import { isDifficult, newCard, review, type Grade } from '@/features/srs';
import { useInnerBack } from '@/hooks/use-inner-back';
import { useLoad } from '@/hooks/use-load';
import { pronunciation, stt } from '@/services/speech';
import { allCards, dueCards, getCard, logActivity, saveCard } from '@/services/storage/repo';
import type { SrsCard } from '@/types';

const NEW_PER_SESSION = 5;

export default function Review() {
  const { profile } = useApp();
  const [queue, setQueue] = useState<ReviewItem[] | null>(null);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [typed, setTyped] = useState('');
  const [produced, setProduced] = useState(false);
  const [heard, setHeard] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const t0 = useRef(Date.now());
  const sessionStart = useRef(Date.now());

  const [stats] = useLoad(async () => {
    const cards = await allCards();
    const due = await dueCards(500);
    return { total: cards.length, due: due.length, difficult: cards.filter(isDifficult).length };
  });

  const start = useCallback(
    async (onlyDifficult = false) => {
      const cards = await allCards();
      const seen = new Set(cards.map((c) => c.id));
      let list: SrsCard[];
      if (onlyDifficult) list = cards.filter(isDifficult);
      else {
        const due = await dueCards(15);
        const fresh = pickNew(profile, seen, due.length >= 15 ? 0 : NEW_PER_SESSION).map((x) => newCard(x.id, x.kind));
        list = [...due, ...fresh];
      }
      const items = list.map(itemFor).filter(Boolean) as ReviewItem[];
      setQueue(items);
      setI(0);
      setDone(0);
      setShown(false);
      setTyped('');
      setProduced(false);
      setHeard('');
      t0.current = Date.now();
      sessionStart.current = Date.now();
    },
    [profile],
  );

  const quit = useCallback(() => {
    stt.stop();
    if (done > 0) logActivity('review', (Date.now() - sessionStart.current) / 1000, `${done} cards (stopped)`);
    setQueue(null);
  }, [done]);
  useInnerBack(queue !== null, quit);

  useEffect(() => {
    if (queue && queue.length > 0 && i >= queue.length) {
      logActivity('review', (Date.now() - sessionStart.current) / 1000, `${done} cards`);
    }
  }, [i, queue, done]);

  if (!queue) {
    return (
      <Screen>
        <T v="title">Review</T>
        <Card>
          <T>{`${stats?.due ?? 0} due · ${stats?.total ?? 0} in memory · ${stats?.difficult ?? 0} difficult`}</T>
          <T dim>Les cartes reviennent selon ta difficulté, ta vitesse de réponse et si tu as réellement produit le mot (écrit ou dit).</T>
        </Card>
        <Btn label="Start review (2–10 min)" onPress={() => start(false)} />
        {!!stats?.difficult && <Btn kind="ghost" label={`Words I keep forgetting (${stats.difficult})`} onPress={() => start(true)} />}
      </Screen>
    );
  }

  if (i >= queue.length) {
    return (
      <Screen>
        <T v="title">{queue.length ? 'Session complete' : 'Nothing to review'}</T>
        <T>{queue.length ? `${done} items reviewed. Come back later: the next ones are scheduled for you.` : 'Aucune carte due. Reviens plus tard.'}</T>
        <Btn label="Close" onPress={() => setQueue(null)} />
      </Screen>
    );
  }

  const item = queue[i];
  const target = item.answerEn;
  const sim = shown ? Math.max(similarity(typed, target), heard ? similarity(heard, target) : 0) : 0;
  const suggested: Grade = sim >= 0.95 ? 2 : sim >= 0.6 ? 1 : typed || heard ? 0 : 1;

  const grade = async (g: Grade) => {
    const ms = Date.now() - t0.current;
    const card = await getCard(item.cardId, item.kind);
    await saveCard(review(card, g, ms, produced || !!typed.trim()));
    setDone((d) => d + 1);
    setI(i + 1);
    setShown(false);
    setTyped('');
    setHeard('');
    setProduced(false);
    t0.current = Date.now();
  };

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <T v="label" dim>{`${i + 1} / ${queue.length}`}</T>
        <Tag label={item.kind === 'vocab' ? 'word' : 'sentence'} />
      </Row>
      <Bar value={i / queue.length} />
      <Btn small kind="ghost" label="✕ Stop session" onPress={quit} />
      <Card>
        <T v="small" dim>Say it in English</T>
        <T v="h2">{item.promptFr}</T>
        {!!item.hint && <T v="small" dim>{item.hint}</T>}
      </Card>

      {!shown ? (
        <>
          <Input value={typed} onChangeText={setTyped} placeholder="Type it (optional)…" autoCapitalize="none" />
          <Btn
            kind="ghost"
            label={busy ? 'Listening…' : '🎙 Say it aloud'}
            disabled={busy}
            onPress={async () => {
              setBusy(true);
              try {
                const r = await stt.listen({ hints: target.split(' ') });
                setHeard(r.transcript);
                setProduced(true);
              } catch {
                /* mic unavailable: fall back to typing / self-grade */
              }
              setBusy(false);
            }}
          />
          {!!heard && <T dim>{`Heard: ${heard}`}</T>}
          <Btn label="Show answer" onPress={() => setShown(true)} />
        </>
      ) : (
        <>
          <Card tone={sim >= 0.95 ? 'good' : sim >= 0.6 ? 'warn' : undefined}>
            <T v="h2">{target}</T>
            {!!item.ipa && <T dim>{item.ipa}</T>}
            {!!item.example && <T dim>{item.example}</T>}
            {!!(typed || heard) && (
              <T v="small">{sim >= 0.95 ? '✅ Matches' : `Your answer: ${typed || heard} (${Math.round(sim * 100)}% match)`}</T>
            )}
          </Card>
          <Speak text={item.example ?? target} />
          {item.kind === 'sentence' && heard !== '' && <T v="small" dim>{pronunciation.assess(target, { transcript: heard, confidence: -1 }).note}</T>}
          <T v="small" dim>How well did you recall it?</T>
          <Row>
            <Btn small kind={suggested === 0 ? 'primary' : 'ghost'} label="Again" onPress={() => grade(0)} />
            <Btn small kind={suggested === 1 ? 'primary' : 'ghost'} label="Hard" onPress={() => grade(1)} />
            <Btn small kind={suggested === 2 ? 'primary' : 'ghost'} label="Good" onPress={() => grade(2)} />
            <Btn small kind="ghost" label="Easy" onPress={() => grade(3)} />
          </Row>
        </>
      )}
    </Screen>
  );
}

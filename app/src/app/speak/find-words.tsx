import { Stack } from 'expo-router';
import React, { useRef, useState } from 'react';

import { Btn, Card, Input, Row, Screen, Speak, T } from '@/components/ui';
import { FIND_WORDS } from '@/data/scenarios';
import { analyze } from '@/features/corrector';
import { similarity } from '@/features/items';
import { useTheme } from '@/hooks/use-theme';
import { stt, tts } from '@/services/speech';
import { logActivity, recordMistake } from '@/services/storage/repo';

export default function FindWords() {
  const th = useTheme();
  const [i, setI] = useState(0);
  const [hints, setHints] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const t0 = useRef(Date.now());
  const firstWord = useRef<number | null>(null);
  const onText = (v: string) => {
    if (firstWord.current === null && v.trim()) firstWord.current = Date.now();
    setAnswer(v);
  };
  const task = FIND_WORDS[i % FIND_WORDS.length];

  const finish = async () => {
    setRevealed(true);
    await logActivity('speaking', (Date.now() - t0.current) / 1000, task.id);
    for (const f of analyze(answer)) await recordMistake(f);
  };
  const next = () => {
    setI(i + 1);
    setHints(0);
    setAnswer('');
    setRevealed(false);
    setErr('');
    t0.current = Date.now();
    firstWord.current = null;
  };
  const hit = task.keywords.filter((k) => answer.toLowerCase().includes(k.toLowerCase())).length;
  const found = analyze(answer);
  const hesitation = firstWord.current === null ? null : Math.round((firstWord.current - t0.current) / 100) / 10;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Find the words' }} />
      <Card>
        <T v="label" dim>{`Situation · ${task.level}`}</T>
        <T v="h2">{task.situation}</T>
        <T dim>Answer aloud (or type). If you get stuck, ask for a hint, one at a time.</T>
      </Card>

      {!revealed && (
        <>
          <Btn
            label={busy ? 'Listening…' : '🎙 Answer aloud'}
            disabled={busy}
            onPress={async () => {
              setBusy(true);
              setErr('');
              tts.stop();
              try {
                const r = await stt.listen({ onPartial: onText });
                onText(r.transcript);
              } catch (e) {
                setErr(`${e instanceof Error ? e.message : e}`);
              }
              setBusy(false);
            }}
          />
          <Input value={answer} onChangeText={onText} placeholder="…or type your answer" multiline />
          {err !== '' && <T v="small" color={th.bad}>{err}</T>}
          {hints > 0 && (
            <Card tone="warn">
              {task.hints.slice(0, hints).map((h, k) => (
                <T key={k}>{`Hint ${k + 1}: ${h}`}</T>
              ))}
            </Card>
          )}
          <Row>
            <Btn small kind="ghost" label={hints >= 3 ? 'No more hints' : `💡 Hint ${hints + 1}`} disabled={hints >= 3} onPress={() => setHints(hints + 1)} />
            <Btn small label="Check my answer" disabled={!answer.trim()} onPress={finish} />
            <Btn small kind="ghost" label="I give up — show" onPress={() => setRevealed(true)} />
          </Row>
        </>
      )}

      {revealed && (
        <>
          {!!answer && (
            <Card tone={similarity(answer, task.model) > 0.6 || hit === task.keywords.length ? 'good' : 'warn'}>
              <T>{`You: ${answer}`}</T>
              <T v="small" dim>{`Key words used: ${hit}/${task.keywords.length}${hints ? ` · ${hints} hint(s)` : ' · no hint 👏'}`}</T>
              {hesitation !== null && (
                <T v="small" dim>{`Time before your first words: ${hesitation}s${hesitation <= 3 ? ' — fluent start 👏' : hesitation <= 8 ? ' — OK, try to start faster' : ' — long pause: say anything, even a simple sentence, to start'}`}</T>
              )}
              {found.map((f, k) => (
                <T key={k} v="small">{`❌ ${f.original} → ✅ ${f.correction} — ${f.explanation}`}</T>
              ))}
            </Card>
          )}
          <Card>
            <T v="label" dim>A natural answer</T>
            <T v="h2">{task.model}</T>
            <Speak text={task.model} />
          </Card>
          <Btn label="Next situation" onPress={next} />
        </>
      )}
    </Screen>
  );
}

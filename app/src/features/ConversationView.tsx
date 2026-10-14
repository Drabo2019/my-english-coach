import { router, Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Btn, Card, Chip, Input, Row, Speak, T, Tag } from '@/components/ui';
import { SCENARIOS } from '@/data/scenarios';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/hooks/use-theme';
import { getAI, type ReviewResult, type Turn } from '@/services/ai';
import { memoryPrompt, offlineSummary, remember } from '@/services/ai/memory';
import { stt, tts } from '@/services/speech';
import { addTurn, logActivity, recordMistake } from '@/services/storage/repo';
import type { CorrectionMode } from '@/types';

const MODES: { id: CorrectionMode; label: string }[] = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'immersion', label: 'Immersion' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'strict', label: 'Strict' },
];

const FREE_OPENERS = [
  'Hi! What would you like to talk about today?',
  'Hello! How are you feeling today?',
  'Hey! Tell me something interesting about your week.',
];

export function ConversationView({ scenarioId }: { scenarioId: string | null }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, settings, updateSettings } = useApp();
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? null;
  const [history, setHistory] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [helpLevel, setHelpLevel] = useState(0);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [err, setErr] = useState('');
  const [aiLabel, setAiLabel] = useState('offline');
  const session = useRef(`s${Date.now()}`);
  const started = useRef(Date.now());
  const scroll = useRef<ScrollView>(null);
  const memory = useRef('');

  const say = (text: string) => tts.speak(text, { rate: settings.correctionMode === 'beginner' ? 0.7 : settings.ttsRate });

  useEffect(() => {
    const opening = scenario ? scenario.opening : FREE_OPENERS[Math.floor(Math.random() * FREE_OPENERS.length)];
    setHistory([{ role: 'ai', text: opening }]);
    addTurn(session.current, 'ai', opening);
    say(opening);
    memoryPrompt().then((m) => {
      memory.current = m;
    });
    return () => tts.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true });
  }, [history, thinking]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || thinking) return;
    setInput('');
    setHelpLevel(0);
    setErr('');
    const next: Turn[] = [...history, { role: 'user', text: t }];
    setHistory(next);
    addTurn(session.current, 'user', t);
    setThinking(true);
    try {
      const ai = await getAI();
      setAiLabel(ai.online ? ai.id : 'offline');
      // streamed: the partner's text appears as it is generated; the voice speaks the final text
      let placeholderAdded = false;
      const reply = await ai.replyStream({ scenario, history: next, profile, mode: settings.correctionMode, memory: memory.current }, (partial) => {
        setThinking(false);
        setHistory((h) => {
          if (!placeholderAdded) {
            placeholderAdded = true;
            return [...h, { role: 'ai', text: partial }];
          }
          return [...h.slice(0, -1), { role: 'ai', text: partial }];
        });
      });
      if (ai.lastError) setErr(`AI unreachable, using offline mode (${ai.lastError.slice(0, 80)})`);
      addTurn(session.current, 'ai', reply);
      say(reply);
    } finally {
      setThinking(false);
    }
  };

  const speakNow = async () => {
    setErr('');
    setListening(true);
    tts.stop();
    try {
      const r = await stt.listen({ onPartial: setInput });
      setInput('');
      if (r.transcript) await send(r.transcript);
      else setErr('I didn’t hear anything. Try again or type your answer.');
    } catch (e) {
      setErr(`${e instanceof Error ? e.message : e}. You can type your answer instead.`);
    } finally {
      setListening(false);
    }
  };

  const finish = async () => {
    tts.stop();
    const seconds = (Date.now() - started.current) / 1000;
    const userTurns = history.filter((t) => t.role === 'user').length;
    if (userTurns === 0) return router.back();
    await logActivity('conversation', seconds, scenario?.id ?? 'free');
    const ai = await getAI();
    const r = await ai.review({ scenario, history, profile, mode: settings.correctionMode });
    for (const f of r.findings) await recordMistake({ category: f.category, original: f.original, correction: f.correction, explanation: f.explanation, severity: f.severity });
    await remember({
      ts: Date.now(),
      topic: scenario?.title ?? 'Free talk',
      turns: userTurns,
      summary: offlineSummary(scenario?.title ?? 'Free talk', history),
      mistakes: r.findings.map((f) => f.correction),
    });
    setReview(r);
  };

  // "What can I say next?" — three levels, never the full answer straight away.
  const turnIdx = history.filter((t) => t.role === 'user').length;
  const step = scenario?.script[Math.min(turnIdx, scenario.script.length - 1)];
  const help = [
    step?.hints[0] ?? 'Start with: "I think…" or "Well, …" and add one detail.',
    step ? `Useful words: ${(step.keywords ?? []).slice(0, 4).join(', ') || step.hints[1] || ''}` : 'Useful words: because, actually, usually, yesterday',
    step ? `Build a sentence with: ${(step.keywords ?? []).slice(0, 3).join(' + ')}${step.hints[1] ? ` (${step.hints[1]})` : ''}` : 'Try: "In my case, … because …"',
  ];

  if (review) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: th.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Stack.Screen options={{ title: 'Your feedback' }} />
        <T v="title">Your correction</T>
        {review.findings.length === 0 && (
          <Card tone="good">
            <T>No clear mistake detected. Good work — you communicated. 👍</T>
            <T v="small" dim>The offline checker is cautious: turn on the AI partner (Settings) for a finer analysis.</T>
          </Card>
        )}
        {review.findings.map((f, k) => (
          <Card key={k}>
            <T color={th.bad}>{`❌ ${f.original}`}</T>
            <T color={th.good}>{`✅ ${f.correction}`}</T>
            <T v="small" dim>{`Why? ${f.explanation}`}</T>
            <Row>
              <Tag label={f.category} />
              <Speak text={f.correction} label="🔊 Say it" />
            </Row>
          </Card>
        ))}
        {!!review.natural && (
          <Card>
            <T v="label" dim>Natural version</T>
            <T>{review.natural}</T>
            <Speak text={review.natural} />
          </Card>
        )}
        {review.vocabTips.map((v, k) => (
          <T key={k} dim>{`• ${v}`}</T>
        ))}
        <T v="small" dim>Mistakes are added to “My English Mistakes” and used to build your next exercises. Communication first, perfection later.</T>
        <Btn label="Done" onPress={() => router.back()} />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: th.background }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <Stack.Screen options={{ title: scenario ? scenario.title : 'Talk to me' }} />
      <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {MODES.map((m) => (
            <Chip key={m.id} label={m.label} active={settings.correctionMode === m.id} onPress={() => updateSettings({ correctionMode: m.id })} />
          ))}
        </ScrollView>
        <T v="small" dim style={{ marginTop: 4 }}>{`Partner: ${aiLabel}${scenario ? ` · Goal: ${scenario.goal}` : ''}`}</T>
      </View>

      <ScrollView ref={scroll} contentContainerStyle={{ padding: 12, gap: 8 }}>
        {history.map((t, k) => (
          <View key={k} style={{ alignSelf: t.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
            <View style={{ backgroundColor: t.role === 'user' ? th.accent : th.card, borderColor: th.border, borderWidth: t.role === 'user' ? 0 : 1, borderRadius: 14, padding: 10 }}>
              <T color={t.role === 'user' ? th.accentText : th.text}>{t.text}</T>
            </View>
            {t.role === 'ai' && (
              <View style={{ alignSelf: 'flex-start' }}>
                <Btn small kind="ghost" label="🔊" onPress={() => say(t.text)} />
              </View>
            )}
          </View>
        ))}
        {thinking && <T dim>…</T>}
      </ScrollView>

      {err !== '' && <T v="small" color={th.warn} style={{ paddingHorizontal: 12 }}>{err}</T>}

      {helpLevel > 0 && (
        <Card tone="warn" style={{ marginHorizontal: 12 }}>
          {help.slice(0, helpLevel).map((h, k) => (
            <T key={k}>{`${['Hint', 'Words', 'Suggestion'][k]}: ${h}`}</T>
          ))}
        </Card>
      )}

      <View style={{ padding: 12, paddingBottom: 12 + insets.bottom, gap: 8 }}>
        <Row>
          <View style={{ flex: 1 }}>
            <Input value={input} onChangeText={setInput} placeholder={listening ? 'Listening…' : 'Type or tap 🎙'} onSubmitEditing={() => send(input)} returnKeyType="send" />
          </View>
          <Btn small label={input.trim() ? 'Send' : listening ? '…' : '🎙'} disabled={listening} onPress={() => (input.trim() ? send(input) : speakNow())} />
        </Row>
        <Row>
          <Btn small kind="ghost" label={helpLevel >= 3 ? 'No more help' : `💡 What can I say? (${helpLevel}/3)`} disabled={helpLevel >= 3} onPress={() => setHelpLevel((h) => h + 1)} />
          <Btn small kind="ghost" label="🆘 How do I say…" onPress={() => router.push('/how-to-say')} />
          <Btn small kind="ghost" label="Finish" onPress={finish} />
        </Row>
      </View>
    </KeyboardAvoidingView>
  );
}

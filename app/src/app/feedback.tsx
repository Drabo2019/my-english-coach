import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';

import { Btn, Card, Chip, Input, Row, Screen, T } from '@/components/ui';
import { FEEDBACK_WHATSAPP } from '@/config';
import { useApp } from '@/features/app-context';
import { levelLabel, overallIndex } from '@/features/placement';
import { useLoad } from '@/hooks/use-load';
import { useTheme } from '@/hooks/use-theme';
import { buildFeedbackMessage, validateFeedback } from '@/services/feedback-format';
import { kvGet, kvSet } from '@/services/storage/db';
import { addFeedback, allFeedback } from '@/services/storage/repo';
import { currentVersion } from '@/services/updates';

const KINDS = [
  'Something is broken',
  'This correction is wrong',
  'Too easy',
  'Too hard',
  'Too academic',
  'I didn’t understand',
  'I get stuck here',
  'I want more conversation',
  'Suggestion',
  'Useful',
  'Useless',
];

function deviceInfo(): string {
  const c = Platform.constants as { Model?: string; Release?: string };
  return Platform.OS === 'android' ? `${c.Model ?? 'Android'} · Android ${c.Release ?? Platform.Version}` : `${Platform.OS} ${Platform.Version}`;
}

export default function Feedback() {
  const th = useTheme();
  const { profile } = useApp();
  const { screen } = useLocalSearchParams<{ screen?: string }>();
  const [kind, setKind] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [list, reload] = useLoad(allFeedback);

  useEffect(() => {
    kvGet<string>('feedbackContact', '').then(setContact);
  }, []);

  const counts = (list ?? []).reduce<Record<string, number>>((a, f) => ({ ...a, [f.kind]: (a[f.kind] ?? 0) + 1 }), {});

  const send = async () => {
    const problem = validateFeedback(kind, note);
    if (problem) {
      setError(problem);
      setSent(false);
      return;
    }
    setError('');
    await addFeedback(screen ?? 'general', kind!, note.trim() || undefined);
    await kvSet('feedbackContact', contact.trim());
    const message = buildFeedbackMessage({
      version: currentVersion(),
      device: deviceInfo(),
      screen: screen ?? 'general',
      kind: kind!,
      note,
      contact,
      level: levelLabel(overallIndex(profile.levels)),
    });
    try {
      if (FEEDBACK_WHATSAPP) await Linking.openURL(`https://wa.me/${FEEDBACK_WHATSAPP}?text=${encodeURIComponent(message)}`);
      else await Share.share({ message });
    } catch {
      /* sheet closed: the feedback is still saved on the phone */
    }
    setSent(true);
    setKind(null);
    setNote('');
    reload();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Send feedback' }} />
      <T dim>
        Tell us what went wrong or what to improve. Your message opens in WhatsApp (or any app you choose) with your phone model and the app version
        already included.
      </T>

      <T v="h2">What is it about?</T>
      <Row>
        {KINDS.map((k) => (
          <Chip key={k} label={k} active={kind === k} onPress={() => { setKind(k); setError(''); }} />
        ))}
      </Row>

      <T v="h2">Describe it</T>
      <Input
        value={note}
        onChangeText={(v) => { setNote(v); setError(''); }}
        placeholder="What were you doing? What happened? What did you expect?"
        multiline
        style={{ minHeight: 110, textAlignVertical: 'top' }}
        maxLength={1500}
      />
      <Input value={contact} onChangeText={setContact} placeholder="Your name or number (optional)" maxLength={80} />
      {!!error && <T color={th.bad}>{error}</T>}
      {sent && <T color={th.good}>Thank you. If the message did not go out, open Send feedback again: your feedback is saved on this phone.</T>}
      <Btn label="Send feedback" onPress={send} />
      <T v="small" dim>A screenshot helps a lot: send it in the same chat afterwards. No audio and no personal data are attached.</T>

      {Object.keys(counts).length > 0 && (
        <Card>
          <T v="h2">Your feedback so far</T>
          {Object.entries(counts).map(([k, n]) => (
            <T key={k}>{`${k}: ${n}`}</T>
          ))}
          <Btn
            small
            kind="ghost"
            label="Share the whole list"
            onPress={() =>
              Share.share({
                message:
                  `My English Coach ${currentVersion()} · ${deviceInfo()}\n` +
                  (list ?? []).map((f) => `${new Date(f.ts).toISOString().slice(0, 10)} [${f.screen}] ${f.kind}${f.note ? ` — ${f.note}` : ''}`).join('\n'),
              })
            }
          />
        </Card>
      )}
    </Screen>
  );
}

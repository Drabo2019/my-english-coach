import { Stack } from 'expo-router';
import React from 'react';

import { Card, Screen, Speak, T, Tag } from '@/components/ui';

// Textbook English vs real-world English. Always with register and where NOT to use it.
const ROWS = [
  { book: 'I am going to call you later.', real: 'I’m gonna call you later.', ctx: 'Oral, informel. Pas dans un email formel.', tag: 'informal' },
  { book: 'Do you want to have a coffee?', real: 'Wanna grab a coffee?', ctx: 'Entre collègues/amis. Évite avec un client.', tag: 'informal' },
  { book: 'I do not understand.', real: 'I don’t get it. / I’m not following.', ctx: '« I’m not following » marche aussi en réunion.', tag: 'spoken' },
  { book: 'It is not a problem.', real: 'No worries. / No problem.', ctx: 'Très courant, poli, à l’oral.', tag: 'spoken' },
  { book: 'I will contact you again.', real: 'I’ll get back to you.', ctx: 'Standard en contexte pro.', tag: 'professional' },
  { book: 'What is happening?', real: 'What’s going on? / What’s up?', ctx: '« What’s up? » = salut ET quoi de neuf ; informel.', tag: 'informal' },
  { book: 'Please wait one moment.', real: 'Hold on a sec.', ctx: 'Informel ; au téléphone pro : « Please hold ».', tag: 'informal' },
  { book: 'I am very tired.', real: 'I’m exhausted. / I’m wiped out.', ctx: 'Plus naturel que « very tired ».', tag: 'spoken' },
  { book: 'That is very good.', real: 'That’s awesome. / That’s great.', ctx: '« awesome » : informel, surtout US.', tag: 'informal' },
  { book: 'I think so too.', real: 'Same here. / Me too.', ctx: 'Spontané, oral.', tag: 'spoken' },
  { book: 'Could you repeat that?', real: 'Sorry, what was that?', ctx: 'Avec un collègue ; avec un client : « Could you repeat that? »', tag: 'spoken' },
  { book: 'Let us finish this.', real: 'Let’s wrap this up.', ctx: 'Réunions, très courant.', tag: 'professional' },
];

export default function Modern() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Real-world English' }} />
      <T dim>Textbook English is correct; real-world English is what you actually hear. Never learn an expression just because it is popular: look at the context.</T>
      {ROWS.map((r) => (
        <Card key={r.book}>
          <Tag label={r.tag} tone={r.tag === 'professional' ? 'good' : 'warn'} />
          <T dim>{`📘 ${r.book}`}</T>
          <T style={{ fontWeight: '600' }}>{`🗣️ ${r.real}`}</T>
          <T v="small" dim>{r.ctx}</T>
          <Speak text={r.real.split(' / ')[0]} />
        </Card>
      ))}
      <Card>
        <T v="label" dim>US / UK / International</T>
        <T>lift (UK) / elevator (US) · flat (UK) / apartment (US) · holiday (UK) / vacation (US) · mobile (UK) / cell (US) · bill (UK) / check (US)</T>
        <T v="small" dim>By default the app favours natural international English (you can change this in Settings).</T>
      </Card>
    </Screen>
  );
}

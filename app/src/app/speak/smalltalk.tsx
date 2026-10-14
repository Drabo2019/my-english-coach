import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { Card, Row, Screen, Speak, T, Tag } from '@/components/ui';

const TOPICS: { t: string; qa: [string, string][] }[] = [
  { t: 'Weather', qa: [['Nice weather today, isn’t it?', 'Yes, it’s lovely. I hope it stays like this.'], ['Is it always this cold here?', 'Not always, but winters can be long.']] },
  { t: 'Weekend', qa: [['Did you do anything nice at the weekend?', 'Yes, I went for a walk and saw some friends.'], ['Any plans for the weekend?', 'Nothing special, just relaxing. What about you?']] },
  { t: 'Work', qa: [['So, what do you do?', 'I’m an engineer. I work on testing electronic boards.'], ['How’s work going?', 'Busy, but good. We’re finishing a big project.']] },
  { t: 'Hobbies', qa: [['What do you like to do in your free time?', 'I like cooking and going to the gym. How about you?'], ['Do you play any sports?', 'Not really, but I enjoy cycling.']] },
  { t: 'Travel', qa: [['Have you travelled anywhere recently?', 'Yes, I went to Spain last summer. It was great.'], ['Where would you like to go next?', 'I’d love to visit Canada one day.']] },
  { t: 'Food', qa: [['What’s your favourite food?', 'I really like Italian food, especially pasta.'], ['Have you tried the food here?', 'Yes, it’s delicious. I’d recommend the soup.']] },
  { t: 'Technology', qa: [['Do you use AI tools much?', 'Quite a lot, mostly to save time on routine tasks.'], ['Which phone do you use?', 'An Android. It does everything I need.']] },
  { t: 'Family', qa: [['Do you have any brothers or sisters?', 'Yes, I have a sister. We get along really well.'], ['Do you live near your family?', 'Not far, about two hours away.']] },
  { t: 'Current events', qa: [['Did you see the news today?', 'Only the headlines. Anything interesting?'], ['What do you think about remote work?', 'I like the flexibility, but I miss my colleagues.']] },
];

export default function SmallTalk() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Small talk' }} />
      <T dim>Learn these exchanges as blocks. Then start “Talk to me” and improvise.</T>
      {TOPICS.map((tp) => (
        <Card key={tp.t} onPress={() => setOpen(open === tp.t ? null : tp.t)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T v="h2">{tp.t}</T>
            <Tag label={`${tp.qa.length} exchanges`} />
          </Row>
          {open === tp.t &&
            tp.qa.map(([q, a]) => (
              <Card key={q}>
                <T style={{ fontWeight: '600' }}>{q}</T>
                <Speak text={q} />
                <T>{a}</T>
                <Speak text={a} />
              </Card>
            ))}
        </Card>
      ))}
    </Screen>
  );
}

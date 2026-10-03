import type { ListeningItem, PronunciationPair, ReadingText } from '@/types';

// Batch 2 (0.2). ids continue the core sequence (r7…, l7…, p13…).

export const READING_EXTRA: ReadingText[] = [
  {
    id: 'r7', title: 'At the supermarket', level: 'A1',
    text: 'Anna goes to the supermarket on Saturday. She buys milk, eggs and some apples. The apples are cheap today. At the checkout, she pays by card and puts everything in her bag.',
    questions: [
      { q: 'When does Anna go shopping?', options: ['On Saturday', 'On Sunday', 'On Monday'], answer: 0 },
      { q: 'How does she pay?', options: ['By card', 'In cash', 'By phone'], answer: 0 },
    ],
  },
  {
    id: 'r8', title: 'My flat', level: 'A1',
    text: 'I live in a small flat in the city centre. It has two rooms, a kitchen and a bathroom. My favourite room is the living room because it has a big window. The rent is not cheap, but the neighbours are nice.',
    questions: [
      { q: 'How many rooms does the flat have?', options: ['One', 'Two', 'Four'], answer: 1 },
      { q: 'Why is the living room the favourite?', options: ['It has a big window', 'It is very large', 'It has a TV'], answer: 0 },
    ],
  },
  {
    id: 'r9', title: 'A weekend trip', level: 'A2',
    text: 'Last weekend, Marc and his friends went to the coast. They left early on Saturday morning and arrived at ten. The weather was warm, so they swam in the sea and had a picnic on the beach. On Sunday it rained, so they visited a small museum before driving home.',
    questions: [
      { q: 'What did they do on Saturday?', options: ['They swam and had a picnic', 'They visited a museum', 'They stayed at the hotel'], answer: 0 },
      { q: 'Why did they go to a museum?', options: ['It was raining', 'It was free', 'They were tired'], answer: 0 },
    ],
  },
  {
    id: 'r10', title: 'A message from a colleague', level: 'A2',
    text: 'Hi Tom, I can’t come to the meeting at two because my train is late. Can we move it to three? I can also call you from the train if it is urgent. Thanks, Julie',
    questions: [
      { q: 'Why can’t Julie come at two?', options: ['Her train is late', 'She is ill', 'She forgot'], answer: 0 },
      { q: 'What does she suggest?', options: ['Meet at three', 'Cancel the meeting', 'Meet tomorrow'], answer: 0 },
    ],
  },
  {
    id: 'r11', title: 'Learning with podcasts', level: 'A2',
    text: 'Many people learn English with podcasts. You can listen on the bus, at the gym or while you cook. At first, it can be hard to understand everything, but that is normal. Try to catch the main idea, then listen again and pick up new words.',
    questions: [
      { q: 'Where can you listen to podcasts?', options: ['Only at home', 'On the bus, at the gym, while cooking', 'Only in class'], answer: 1 },
      { q: 'What should you try to do first?', options: ['Understand every word', 'Catch the main idea', 'Write everything down'], answer: 1 },
    ],
  },
  {
    id: 'r12', title: 'A new office', level: 'B1',
    text: 'Our company moved to a new office last month. The building is closer to the station, which makes the commute much shorter. However, the open-plan layout is noisy, and several people have started wearing headphones. Management has promised to create a quiet room, but nothing has been done yet.',
    questions: [
      { q: 'What is the advantage of the new office?', options: ['A shorter commute', 'A bigger kitchen', 'A quiet room'], answer: 0 },
      { q: 'What is the main complaint?', options: ['The noise', 'The distance', 'The price'], answer: 0 },
      { q: 'Has the quiet room been built?', options: ['Yes', 'No, only promised', 'It was cancelled'], answer: 1 },
    ],
  },
  {
    id: 'r13', title: 'Customer complaint', level: 'B1',
    text: 'Dear Sir or Madam, I ordered a laptop from your website on 5 May. It arrived three days late, and the screen was damaged. I contacted customer service twice but received no reply. I would like a refund or a replacement as soon as possible. Yours faithfully, Paul Martin',
    questions: [
      { q: 'What was wrong with the laptop?', options: ['The screen was damaged', 'It was the wrong colour', 'It was too expensive'], answer: 0 },
      { q: 'What does Paul want?', options: ['A refund or a replacement', 'A discount', 'An apology only'], answer: 0 },
    ],
  },
  {
    id: 'r14', title: 'Why we forget words', level: 'B1',
    text: 'Forgetting new words is completely normal. The brain keeps what it uses often and lets go of the rest. That is why repeating a word once is not enough. Seeing it again after a day, then after a week, helps it stay. Using it in a real sentence works even better than just reading it.',
    questions: [
      { q: 'Why do we forget words?', options: ['The brain drops what it does not use', 'We are lazy', 'Words are too long'], answer: 0 },
      { q: 'What helps most?', options: ['Using the word in a real sentence', 'Reading it once', 'Copying it ten times'], answer: 0 },
    ],
  },
  {
    id: 'r15', title: 'Remote work: pros and cons', level: 'B1',
    text: 'Remote work saves time and money, and many employees say they are more productive at home. On the other hand, it can be hard to separate work from private life. Some people also feel they miss out on informal conversations that often lead to good ideas.',
    questions: [
      { q: 'What is one benefit of remote work?', options: ['It saves time and money', 'It is always quieter', 'It pays more'], answer: 0 },
      { q: 'What is one downside?', options: ['Separating work from private life', 'Longer hours in the office', 'Less pay'], answer: 0 },
    ],
  },
  {
    id: 'r16', title: 'An incident report', level: 'B2',
    text: 'At 10:15 on Tuesday, the test chamber stopped unexpectedly. The operator noticed that the temperature had risen by twelve degrees in under five minutes. After a safety shutdown, the team found that a cooling fan had failed. The fan was replaced and the chamber was retested. No injuries occurred, and the schedule slipped by one day.',
    questions: [
      { q: 'What caused the problem?', options: ['A failed cooling fan', 'An operator error', 'A power cut'], answer: 0 },
      { q: 'What was the consequence?', options: ['One day of delay', 'A serious injury', 'Cancellation of the project'], answer: 0 },
    ],
  },
  {
    id: 'r17', title: 'Is AI changing jobs?', level: 'B2',
    text: 'Artificial intelligence is already changing how many people work. Routine tasks, such as drafting emails or summarising documents, can now be done in seconds. Experts disagree, however, about how many jobs will disappear. Some argue that new roles will emerge, while others warn that the transition could be painful for workers who are not retrained.',
    questions: [
      { q: 'What tasks can AI do quickly?', options: ['Routine tasks like drafting emails', 'Only physical work', 'Only maths'], answer: 0 },
      { q: 'What do experts disagree about?', options: ['How many jobs will disappear', 'Whether AI exists', 'The price of AI'], answer: 0 },
    ],
  },
  {
    id: 'r18', title: 'A difficult conversation', level: 'B2',
    text: 'Telling a colleague that their work is not good enough is never easy. A useful approach is to start with something positive, describe the specific problem rather than criticising the person, and end with a clear suggestion. People are far more likely to listen when they feel respected.',
    questions: [
      { q: 'What should you start with?', options: ['Something positive', 'The biggest mistake', 'A deadline'], answer: 0 },
      { q: 'What should you criticise?', options: ['The specific problem, not the person', 'The person', 'The manager'], answer: 0 },
    ],
  },
  {
    id: 'r19', title: 'Booking a table', level: 'A2',
    text: 'Hello, I’d like to book a table for four people on Friday evening, at around eight. We would prefer a table by the window if possible. One of us is vegetarian, so we’d like to see the vegetarian menu. My name is Dupont, and my number is 0612345678.',
    questions: [
      { q: 'How many people are coming?', options: ['Four', 'Six', 'Two'], answer: 0 },
      { q: 'What special request do they have?', options: ['A vegetarian menu', 'A birthday cake', 'A quiet room'], answer: 0 },
    ],
  },
  {
    id: 'r20', title: 'Tech support chat', level: 'B1',
    text: 'Customer: My tablet won’t turn on. Support: Have you tried charging it for at least thirty minutes? Customer: Yes, but the screen stays black. Support: Hold the power button and the volume-down button for ten seconds. If nothing happens, we’ll arrange a replacement.',
    questions: [
      { q: 'What is the problem?', options: ['The tablet won’t turn on', 'The battery is too hot', 'The screen is cracked'], answer: 0 },
      { q: 'What does support suggest?', options: ['Hold two buttons for ten seconds', 'Buy a new charger', 'Reset the password'], answer: 0 },
    ],
  },
];

export const LISTENING_EXTRA: ListeningItem[] = [
  { id: 'l7', level: 'A1', accent: 'uk', text: 'I get up at seven, have breakfast, and take the bus to work.', questions: [{ q: 'When does the speaker get up?', options: ['At six', 'At seven', 'At eight'], answer: 1 }, { q: 'How does the speaker go to work?', options: ['By bus', 'By car', 'On foot'], answer: 0 }], gaps: ['seven', 'bus'] },
  { id: 'l8', level: 'A1', accent: 'us', text: 'Excuse me, how much is this jacket? It’s forty dollars.', questions: [{ q: 'What is the person buying?', options: ['A jacket', 'A hat', 'Shoes'], answer: 0 }, { q: 'How much is it?', options: ['Fourteen dollars', 'Forty dollars', 'Fifty dollars'], answer: 1 }], gaps: ['jacket', 'forty'] },
  { id: 'l9', level: 'A2', accent: 'us', text: 'The meeting has moved to Thursday at ten, in room four.', questions: [{ q: 'When is the meeting now?', options: ['Tuesday at ten', 'Thursday at ten', 'Thursday at four'], answer: 1 }, { q: 'Which room?', options: ['Room two', 'Room four', 'Room ten'], answer: 1 }], gaps: ['Thursday', 'four'] },
  { id: 'l10', level: 'A2', accent: 'uk', text: 'Could I have a coffee with milk and a sandwich, please? To take away.', questions: [{ q: 'What does the customer order?', options: ['Coffee and a sandwich', 'Tea and a cake', 'Only coffee'], answer: 0 }, { q: 'Eat in or take away?', options: ['Eat in', 'Take away'], answer: 1 }], gaps: ['milk', 'take'] },
  { id: 'l11', level: 'A2', accent: 'us', text: 'The train to Boston leaves from platform six at a quarter past nine.', questions: [{ q: 'Which platform?', options: ['Platform six', 'Platform nine', 'Platform five'], answer: 0 }, { q: 'What time does it leave?', options: ['9:15', '9:45', '6:15'], answer: 0 }], gaps: ['platform', 'quarter'] },
  { id: 'l12', level: 'A2', accent: 'uk', text: 'I’m sorry I’m late. The traffic was terrible, and I couldn’t find a parking space.', questions: [{ q: 'Why is the speaker late?', options: ['Traffic and parking', 'A broken car', 'A missed train'], answer: 0 }], gaps: ['traffic', 'parking'] },
  { id: 'l13', level: 'B1', accent: 'us', text: 'Hi, this is Mark from the IT department. I’m calling about the problem with your laptop. I can come to your desk at two o’clock, if that works for you.', questions: [{ q: 'Who is calling?', options: ['Someone from IT', 'A customer', 'A manager'], answer: 0 }, { q: 'When can he come?', options: ['At two o’clock', 'Tomorrow', 'At noon'], answer: 0 }], gaps: ['IT', 'two'] },
  { id: 'l14', level: 'B1', accent: 'uk', text: 'We’ve decided to postpone the launch by two weeks, because the final tests haven’t been completed yet.', questions: [{ q: 'What was decided?', options: ['To delay the launch', 'To cancel the project', 'To launch early'], answer: 0 }, { q: 'Why?', options: ['Tests are not finished', 'No budget', 'Not enough staff'], answer: 0 }], gaps: ['postpone', 'tests'] },
  { id: 'l15', level: 'B1', accent: 'us', text: 'If you turn left at the traffic lights, you’ll see the bank on your right. The post office is just behind it.', questions: [{ q: 'Where is the bank?', options: ['On your right after the lights', 'On your left', 'Before the lights'], answer: 0 }, { q: 'Where is the post office?', options: ['Behind the bank', 'Opposite the station', 'Next to the lights'], answer: 0 }], gaps: ['left', 'behind'] },
  { id: 'l16', level: 'B1', accent: 'uk', text: 'The package should have arrived on Monday, but it’s still in the sorting centre. I’ll call the courier and let you know this afternoon.', questions: [{ q: 'Where is the package?', options: ['In the sorting centre', 'At home', 'Lost'], answer: 0 }, { q: 'What will the speaker do?', options: ['Call the courier', 'Send a new package', 'Wait a week'], answer: 0 }], gaps: ['sorting', 'courier'] },
  { id: 'l17', level: 'B1', accent: 'us', text: 'Honestly, I’d rather work from home on Fridays. It’s quieter, and I don’t lose an hour on the train.', questions: [{ q: 'What does the speaker prefer?', options: ['Working from home on Fridays', 'Working in the office', 'Working at weekends'], answer: 0 }, { q: 'Why?', options: ['Quieter and saves time', 'Cheaper', 'Better internet'], answer: 0 }], gaps: ['quieter', 'train'] },
  { id: 'l18', level: 'B2', accent: 'uk', text: 'I take your point, but if we skip the final validation, we risk shipping a faulty product, and that would cost us far more than a week’s delay.', questions: [{ q: 'What does the speaker argue?', options: ['Keep the final validation', 'Skip the validation', 'Ship immediately'], answer: 0 }, { q: 'What is the risk?', options: ['Shipping a faulty product', 'Losing the client', 'Higher salaries'], answer: 0 }], gaps: ['validation', 'faulty'] },
  { id: 'l19', level: 'B2', accent: 'us', text: 'Based on the data so far, it looks like the failure only occurs above eighty degrees, so we should focus our investigation on the cooling system.', questions: [{ q: 'When does the failure occur?', options: ['Above eighty degrees', 'Below zero', 'Only at startup'], answer: 0 }, { q: 'What should they investigate?', options: ['The cooling system', 'The software', 'The power supply'], answer: 0 }], gaps: ['eighty', 'cooling'] },
  { id: 'l20', level: 'B2', accent: 'uk', text: 'To be fair, the team has done a great job under pressure, but I think we need to be realistic about what we can deliver by the end of the quarter.', questions: [{ q: 'What is the speaker’s main message?', options: ['Be realistic about the deadline', 'The team did badly', 'More money is needed'], answer: 0 }], gaps: ['realistic', 'quarter'] },
];

export const PRONUNCIATION_EXTRA: PronunciationPair[] = [
  { id: 'p13', a: 'cut', b: 'cat', sounds: '/ʌ/ vs /æ/', tip: '/ʌ/ : bouche détendue, presque « eu » court ; /æ/ : bouche bien ouverte.', sentence: 'The cat cut the cord.' },
  { id: 'p14', a: 'pull', b: 'pool', sounds: '/ʊ/ vs /uː/', tip: 'pull : voyelle courte, lèvres peu arrondies ; pool : longue, lèvres bien arrondies.', sentence: 'Pull the cord by the pool.' },
  { id: 'p15', a: 'hat', b: 'hot', sounds: '/æ/ vs /ɒ/', tip: '/æ/ : bouche étirée ; /ɒ/ : bouche arrondie, mâchoire basse.', sentence: 'The hot hat is on the mat.' },
  { id: 'p16', a: 'pen', b: 'pan', sounds: '/e/ vs /æ/', tip: 'Même contraste ouverture : pan = plus ouvert.', sentence: 'Put the pen in the pan.' },
  { id: 'p17', a: 'bought', b: 'boat', sounds: '/ɔː/ vs /əʊ/', tip: '/ɔː/ reste stable ; /əʊ/ glisse vers « ou ».', sentence: 'I bought a boat last year.' },
  { id: 'p18', a: 'thin', b: 'tin', sounds: '/θ/ vs /t/', tip: 'TH : langue entre les dents, souffle continu ; T : explosion sèche.', sentence: 'The thin tin is empty.' },
  { id: 'p19', a: 'they', b: 'day', sounds: '/ð/ vs /d/', tip: 'TH voisé : langue entre les dents + vibration ; pas de D.', sentence: 'They left the next day.' },
  { id: 'p20', a: 'road', b: 'load', sounds: '/r/ vs /l/', tip: '/l/ : le bout de la langue touche derrière les dents ; /r/ : ne touche rien.', sentence: 'The road is full of heavy loads.' },
  { id: 'p21', a: 'watch', b: 'wash', sounds: '/tʃ/ vs /ʃ/', tip: 'Commence par T pour « ch » ; continu pour « sh ».', sentence: 'Watch me wash my watch.' },
  { id: 'p22', a: 'REcord (nom)', b: 'reCORD (verbe)', sounds: 'accent de mot', tip: 'Beaucoup de mots changent d’accent : nom = 1re syllabe, verbe = 2e (record, present, increase).', sentence: 'Please record the record.' },
  { id: 'p23', a: 'Wednesday', b: 'vegetable', sounds: 'lettres muettes', tip: '« Wednesday » = /ˈwenzdeɪ/ (le d est muet) ; « vegetable » = /ˈvedʒtəbl/ (3 syllabes).', sentence: 'On Wednesday I eat a vegetable soup.' },
  { id: 'p24', a: 'comfortable', b: 'business', sounds: 'syllabes avalées', tip: '/ˈkʌmftəbl/ (3 syllabes) ; /ˈbɪznəs/ (2 syllabes). Les voyelles non accentuées disparaissent.', sentence: 'It’s a comfortable business.' },
  { id: 'p25', a: 'an apple', b: 'turn it off', sounds: 'liaison', tip: 'On lie la consonne finale à la voyelle suivante : « a-napple », « tur-ni-toff ».', sentence: 'Turn it off and eat an apple.' },
  { id: 'p26', a: 'can', b: 'can’t', sounds: 'accent de phrase', tip: '« can » est faible /kən/ ; « can’t » est fort /kɑːnt/. L’accent signale la négation.', sentence: 'I can do it, but he can’t.' },
];
